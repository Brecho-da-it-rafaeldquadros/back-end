import { Request, Response, NextFunction } from "express"
import {  ValidationError } from "yup"
import AppError from "../error/appError"
import { IValidParams } from "../interface/index.interface"
import { schemaValidIdParams } from "../serializer/index.serializer"

const validIdParamsMiddleware = ( { optionalOne, optionalTwo }:IValidParams ) => async ( req:Request, res:Response, next:NextFunction ) => {
    const { id, idTwo } = req.params

    const isValidatedOne = optionalOne && id || !optionalOne
    const isValidatedTwo = optionalTwo && idTwo || !optionalTwo

    try {
        if( isValidatedOne ){
            await schemaValidIdParams.validate( {id}, { 
                stripUnknown:true,
                abortEarly:false
            } )
        }

        if( isValidatedTwo ){
            await schemaValidIdParams.validate( {id:idTwo}, { 
                stripUnknown:true,
                abortEarly:false
            } )
        }

        next()
    } catch (error) {
        if(error instanceof ValidationError){
            throw new AppError(error.errors[0] ,400);
        }
    }
}

export default validIdParamsMiddleware
