import AppError from "../../error/appError"
import { IConfirmCode } from "../../interface/users.interface"
import { serializerUser } from "../../serializer/user.serializer"
import { verificationCode } from "../../util/code.util"
import Repository from "../../util/repository.util"

import { hasEmailOrPhoneAndError, hasRouteNameSolicitation } from "../../util/verificationutil"

const confirmCodeUserService = async ( userId:string, data:IConfirmCode, URL:string ) => {
    
    const emailOrPhone = hasEmailOrPhoneAndError( URL )

    const type = hasRouteNameSolicitation( URL )

    if( emailOrPhone === "email" && type === "retrieveAccount" ){
        throw new AppError("Confirmação de recuperação de conta somente por 'SMS'", 401)
    }

    const user = await Repository.users.findOne({where:{ id:userId }, relations:{ code:true, myAccountUpdate:{ solicitationUser:true } }})

    if( !user ){
        throw new AppError("Usuario não encontrado", 404)
    }

    if( !user?.myAccountUpdate && type !== "create" ){
        throw new AppError("Atualização não encontrada", 404)
    }
    
    await verificationCode({ user, verificationCode:data.code, type:emailOrPhone, route:type })
  
    const resUser = await Repository.users.findOneBy({ id:userId })

    const serializer = await serializerUser.validate(resUser, { stripUnknown:true })

    return {
        message:`${ resUser.isSolicitationCode ?  emailOrPhone === "email" ? "Email confirmado" : "Celular confirmado" : type === "create" ? "Conta ativada" : "Conta atualizada" }`,
        user:serializer
    }
}

export default confirmCodeUserService