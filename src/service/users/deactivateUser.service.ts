import AppError from "../../error/appError"
import { IAuth, IToken } from "../../interface/users.interface"
import Repository from "../../util/repository.util"
import { verificationEqualPasswordInTokenOrError } from "../../util/verificationutil"

const deactivateUserService = async ( userId:string, auth:IAuth, token:IToken ) => {

    if( userId && token.authorizationLevel !== 1 ){
        throw new AppError("Usuario pode desativar apenas a propia conta", 401)
    }

    await verificationEqualPasswordInTokenOrError( auth.password, token )

    const id = userId ? userId : token.id
 
    const user = await Repository.users.findOneBy({ id:id })

    if( !user ){
        throw new AppError("Usuario não encontrado", 404)
    }
    

    await Repository.users.update( id, { isActive:false })

    return {
        message:"Usuario desativado"
    }
}

export default deactivateUserService