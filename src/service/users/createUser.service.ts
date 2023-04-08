import AppError from "../../error/appError"
import { ICreateUser } from "../../interface/users.interface"
import { serializerUser } from "../../serializer/user.serializer"
import Repository from "../../util/repository.util"

const createUserService = async ( data:ICreateUser ) => {
    
    const user = await Repository.users.findOneBy({ email:data.email })

    if( user && !user?.isActive ){
        return {
            message:"Usuario desativado",
            user:{
                id:user.id,
                isConfirmedEmail:user.isConfirmedEmail,
                isConfirmedPhone:user.isConfirmedPhone
            }
        }
    }

    if( user ){
        throw new AppError( "Email indisponivel", 401)
    }

    data.phone = "55" + data.phone

    const userCreated = Repository.users.create(data)

    await Repository.users.save( userCreated )
        
    const serializer = await serializerUser.validate(userCreated, { stripUnknown:true })

    return {
        message:"Conta criada, aguardando confirmação de email e telefone",
        user:serializer
    }
}

export default createUserService