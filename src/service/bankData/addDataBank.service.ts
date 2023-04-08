import AppError from "../../error/appError"
import { IDataBank } from "../../interface/bankData.interface"
import { IToken } from "../../interface/users.interface"
import { getCurrentDateMileseconds } from "../../util/date.util"
import Repository from "../../util/repository.util"

const addDataBankService = async ( data:IDataBank, token:IToken ) => {

    const hasDataBank = await Repository.bankData.findOne({where:{ user:{ id:token.id } }, relations:{ user:true }})

    if( hasDataBank ){
        throw new AppError("Usuario já possui dados bancarios")
    }

    const user = await Repository.users.findOneBy({ id:token.id })

    const hasCardBank = data?.accountNumber || data?.agency || data?.cpf
    const hasCardBankAll = data?.accountNumber && data?.agency && data?.cpf

    if( hasCardBank && !hasCardBankAll ){
        throw new AppError("Dados do cartão deve ter 'CPF', 'Agencia', 'Numero da conta'")
    }
   
    const dataBankCreated = Repository.bankData.create({...data, user }) 
    await Repository.bankData.save( dataBankCreated )

    const { user:x, ...resBank } = dataBankCreated

    return {
        message:"Dados bancarios adicionados",
        bank:resBank
    }
}

export default addDataBankService