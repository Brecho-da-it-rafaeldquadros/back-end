import AppError from "../../error/appError"
import { IToken } from "../../interface/users.interface"
import Repository from "../../util/repository.util"

const removePreferencesService = async ( token:IToken ) => {

    const user = await Repository.users.findOne({where:{ id:token.id }, relations:{ preference:true }})

    if( !user?.preference ){
        throw new AppError("Preferências não encontradas", 404)
    }

    await Repository.preferences.delete( user.preference.id )

    return {
        message:"Preferência removida"
    }
}

export default removePreferencesService