import AppError from "../../error/appError"
import { IDataBank } from "../../interface/bankData.interface"
import { IToken } from "../../interface/users.interface"
import Repository from "../../util/repository.util"

const updateDataBankService = async ( data:IDataBank, token:IToken ) => {

    const user = await Repository.users.findOne({where:{ id:token.id }, relations:{ bankData:true }})
    
    if( !user.bankData ){
        throw new AppError("Dados bancarios não encontrados", 404)
    }

    const hasCardBank = data?.accountNumber || data?.agency || data?.cpf
    const hasCardBankAll = data?.accountNumber && data?.agency && data?.cpf
    const hasCardRegistered = user.bankData.accountNumber && user.bankData.agency && user.bankData.cpf

    if( hasCardBank && !hasCardBankAll && !hasCardRegistered){
        throw new AppError("Dados do cartão deve ter 'CPF', 'Agencia', 'Numero da conta'")
    }

    await Repository.bankData.update( user.bankData.id, data ) 

    const dataBankUpdated = await Repository.bankData.findOne({where:{ user:{ id:token.id } }, relations:{ user:true }})

    const { user:x, ...resBank } = dataBankUpdated

    return {
        message:"Dados bancarios atualizados",
        bank:resBank
    }
}

export default updateDataBankService