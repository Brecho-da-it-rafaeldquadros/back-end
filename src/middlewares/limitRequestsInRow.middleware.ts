import { Request, Response, NextFunction } from "express"
import Logs from "../entities/logs.entity"
import AppError from "../error/appError"
import { ITypeLog } from "../interface/index.interface"
import Repository from "../util/repository.util"

interface ILimitRequest {
    type: ITypeLog
    limitRequestLevelAll?: number
    limitRequestLevelOne?: number
    milesecondsLevelAll?: number
    milesecondsLevelOne?: number
}

const limitRequestsInRowMiddleware = ( { type, limitRequestLevelAll, limitRequestLevelOne, milesecondsLevelAll, milesecondsLevelOne }:ILimitRequest ) => async ( req:Request, res:Response, next:NextFunction ) => {

    let { id:userIdParms } = req?.params
    const { email } = req.body
    const token = req?.token

    userIdParms = userIdParms ? userIdParms : token?.id

    if( !userIdParms && !email ){
        throw new AppError("Deve enviar o id, email ou token do usuario")
    }

    const limiteRequest = token?.authorizationLevel === 1 && limitRequestLevelOne ? limitRequestLevelOne : limitRequestLevelAll ? limitRequestLevelAll : 8
    const mileseconds = token?.authorizationLevel === 1 && milesecondsLevelOne ? milesecondsLevelOne : milesecondsLevelAll ? milesecondsLevelAll : 60000


    let logs = await Repository.logs.find({ where: userIdParms ? { user:{ id:userIdParms } } : { user:{ email } }, relations:{ user:true } })

    logs = (logs.filter( log => log.type === type ).sort( ( a, b ) => {
        const aMilesecond = Date.parse( (new Date(a.createdAt)).toLocaleString() )
        const bMilesecond = Date.parse( (new Date(b.createdAt)).toLocaleString() )
        
        return aMilesecond - bMilesecond
    } )).reverse()

    if( logs.length < limiteRequest ){
        next()
        return true
    }

    let logsInType:Logs[] = []

    for (let i = 0; i < logs.length; i++) {
        const log = logs[i]

        if( i < limiteRequest){
            logsInType.push( log )
        }else{
            await Repository.logs.delete( log.id )
        }
    }

    const firstLogAt = logsInType[logsInType.length - 1]
    const firstMilesecondAt = Date.parse( (new Date(firstLogAt?.createdAt)).toLocaleString() )
    const currentMilesecondsAt = Date.parse( (new Date()).toLocaleString() )

    const isManyRequestsInShortTime = (currentMilesecondsAt - firstMilesecondAt) < mileseconds

    if( isManyRequestsInShortTime ){
        throw new AppError("Muitas solicitações", 429)
    }

    next()
}

export default limitRequestsInRowMiddleware