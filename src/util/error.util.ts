import AppError from "../error/appError"
import { ICode } from "../interface/code.interface"

export const notSolicitationCodeErrorCreate = ( { user, type }:ICode ) => {

    if( 
        type === "email" && !user.code.codeEmail || 
        type === "email" && user.isConfirmedEmail 
    ){
        throw new AppError("Código não solicitado para email", 404)
    }

    if( 
        type === "sms" && !user.code.codeSMS || 
        type === "sms" && user.isConfirmedPhone 
    ){
        throw new AppError("Código não solicitado para SMS", 404)
    }
}

export const notSolicitationCodeErrorUpdate = ( { user, type }:ICode ) => {

    const { code, myAccountUpdate } = user

    if( 
        type === "email" && !code.codeEmail || 
        type === "email" && myAccountUpdate.isConfirmedEmail === null ||
        type === "email" && myAccountUpdate.isConfirmedEmail
    ){
        throw new AppError("Código não solicitado para email", 404)
    }

    if( 
        type === "sms" && !code.codeSMS || 
        type === "sms" && myAccountUpdate.isConfirmedPhone === null ||
        type === "sms" && myAccountUpdate.isConfirmedPhone
    ){
        throw new AppError("Código não solicitado para SMS", 404)
    }
}