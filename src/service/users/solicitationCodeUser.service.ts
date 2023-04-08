import AppError from "../../error/appError"
import { validationAndSendCode } from "../../util/code.util"
import Repository from "../../util/repository.util"

import { hasEmailOrPhoneAndError, hasRouteNameSolicitation } from "../../util/verificationutil"

const solicitationCodeUserService = async ( userId:string, URL:string ) => {

    const emailOrPhone = hasEmailOrPhoneAndError( URL )

    const route = hasRouteNameSolicitation( URL )

    if( emailOrPhone === "email" && route === "retrieveAccount" ){
        throw new AppError("Solicitação de recuperação de conta somente por 'SMS'", 401)
    }

    const user = await Repository.users.findOne({where:{ id:userId }, relations:{ code:true, myAccountUpdate:true }})

    if( !user ){
        throw new AppError("Usuario não encontrado", 404)
    }

    if( route === "create" && emailOrPhone === "email" && user.isConfirmedEmail ){
        throw new AppError("Usuario já confirmou o email!")
    }

    if( route === "create" && emailOrPhone === "sms" && user.isConfirmedPhone ){
        throw new AppError("Usuario já confirmou o celular!")
    }

    if( emailOrPhone === "sms" ){
   
        await validationAndSendCode({ user, type:"sms", route })

        return {
            message:"Código enviado por SMS"
        }
    }

    await validationAndSendCode({ user, type:"email", route })

    return {
        message:"Código enviado por Email"
    }
}

export default solicitationCodeUserService