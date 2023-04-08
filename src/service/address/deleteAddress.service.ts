import AppError from "../../error/appError"
import { IToken } from "../../interface/users.interface"
import Repository from "../../util/repository.util"

const deleteAddressService = async ( addressId:string, token:IToken ) => {

    const address = await Repository.address.findOne({where:{ id:addressId }, relations:{ user:true }})

    if( address && address?.user?.id !== token.id  ){
        throw new AppError("Usuario pode remover apenas seus propios endereços", 401)
    }

    if( !address ){
        throw new AppError("Endereço não encontrado", 404)
    }

    await Repository.address.delete( addressId )

    return {
        message:"Endereço removido"
    }
}

export default deleteAddressService