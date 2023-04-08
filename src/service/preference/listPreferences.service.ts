import AppError from "../../error/appError"
import { IToken } from "../../interface/users.interface"
import Repository from "../../util/repository.util"

const listPreferencesService = async ( userId:string, token:IToken ) => {

    if( userId && token.authorizationLevel !== 1 ){
        throw new AppError("Deve listar apenas suas preferências", 401)
    }

    const id = userId ? userId : token.id

    const user = await Repository.users.findOne({where:{ id }, relations:{ preference:{ category:true, brand:true } }})

    if( !user?.preference ){
        return {
            message:"Preferencia",
            preference:{}
        }
    }

    return {
        message: userId && userId !== token.id ? `Preferências do usuario ${user.fullName}` : "Minhas preferências",
        preference:user.preference
    }
}

export default listPreferencesService