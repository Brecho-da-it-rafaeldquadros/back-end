import { Request, Response, NextFunction } from "express"
import AppError from "../error/appError"
import { ITypeLog } from "../interface/index.interface"
import Repository from "../util/repository.util"

interface ICreateLog {
    type:ITypeLog
}

const createLogMiddleware = ( { type }:ICreateLog ) => async ( req:Request, res:Response, next:NextFunction ) => {
    
    const { id:userIdParms } = req?.params
    const { email } = req.body

    const user = await Repository.users.findOneBy( userIdParms ? { id:userIdParms } : { email })

    const logCreated = Repository.logs.create({ type:String(type), user })
    await Repository.logs.save( logCreated )

    next()
}

export default createLogMiddleware