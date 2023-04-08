import { IInitSessioneUser } from "../../interface/users.interface"
import { compareSync } from "bcryptjs"
import { sign } from "jsonwebtoken" 
import Repository from "../../util/repository.util"
import AppError from "../../error/appError"
import "dotenv/config"
import { serializerUser } from "../../serializer/user.serializer"

const initSessionUserService = async ( data:IInitSessioneUser ) => {

    const user = await Repository.users.findOne({ where:{ email:data.email }, relations:{ myAccountUpdate:true, code:true } })

    if( !user || !compareSync( data.password, user.password )){
        throw new AppError("Email ou senha inválido", 401)
    }

    if( !user?.isActive ){
        throw new AppError("Usuario inativo", 401)
    }

    const token = sign({ authorizationLevel:user.authorizationLevel }, process.env.SECRET_KEY as string, {
        expiresIn:"7d",
        subject:user.id
    })

    if( user?.myAccountUpdate ){
        await Repository.update.delete( user.myAccountUpdate.id )
    }

    if( user?.code ){
        await Repository.code.delete( user.code.id )
    }

    const serializer = await serializerUser.validate(user, { stripUnknown:true })

    return {
        message:`Olá ${ user.fullName }, sessão iniciada!`,
        token,
        user:serializer
    }
}

export default initSessionUserService