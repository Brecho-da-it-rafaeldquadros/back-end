import AppError from "../../error/appError"
import { IToken } from "../../interface/users.interface"
import Repository from "../../util/repository.util"

const deleteDataBankService = async ( token:IToken ) => {

    const user = await Repository.users.findOne({ where:{ id:token.id }, relations:{ bankData:true }})

    if( !user?.bankData ){
        throw new AppError("Dados bancarios não encontrado", 404)
    }

    await Repository.bankData.delete( user.bankData.id )

    return {
        message:"Dados bancarios removidos"
    }
}

export default deleteDataBankService