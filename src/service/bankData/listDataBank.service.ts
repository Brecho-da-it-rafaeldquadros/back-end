import AppError from "../../error/appError"
import { IAuth, IToken } from "../../interface/users.interface"
import Repository from "../../util/repository.util"
import { verificationEqualPasswordInTokenOrError } from "../../util/verificationutil"

const listDataBankService = async ( userId:string, auth:IAuth, token:IToken  ) => {

    if( userId && token.authorizationLevel !== 1 ){
        throw new AppError("Usuario só pode listar seus dados bancarios", 401)
    }

    await verificationEqualPasswordInTokenOrError( auth.password, token )

    const id = userId ? userId : token.id

    const user = await Repository.users.findOne({where:{ id }, relations:{ bankData:true }})

    if( !user ){
        throw new AppError("Usuario não encontrado", 404)
    }

    if( !user.bankData ){
        return {
            message:"Dados bancarios",
            bank:{}
        }
    }

    const dataBank = await Repository.bankData.findOne({ where:{ user:{ id } }, relations:{ user:true } })

    const { user:x, ...resBank } = dataBank

    return {
        message: userId && userId !== token.id ? `Dados bancários do usuario ${user.fullName}` : "Meus dados bancários",
        bank:resBank
    }
}

export default listDataBankService