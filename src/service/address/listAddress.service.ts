import AppError from "../../error/appError"
import { IToken } from "../../interface/users.interface"
import { transformDateInMileseconds } from "../../util/date.util"
import Repository from "../../util/repository.util"

const listAddressService = async ( addressId:string, userId:string, URL:string, token:IToken ) => {

    const isAdm = token.authorizationLevel === 1
    const idUser = userId ? userId : token.id
    const isAll = URL.includes("all")

    const user = await Repository.users.findOneBy({ id:idUser })

    if( !user ){
        throw new AppError("Usuario não encontrado", 404)
    }

    if( userId && !isAdm ){
        throw new AppError("Usuario não tem permissão", 401)
    }

    if( !isAll && !addressId ){
        throw new AppError("ID do endereço não encontrado", 404)
    }

    if( !isAll ){

        const address = await Repository.address.findOne({where:{ id:addressId, user:{ id:idUser } }, relations:{ user:true }})

        if( !address ){
            throw new AppError("Endereço não encontrado", 404)
        }
    
        const { user:x, ...resData } = address

        return {
            message:`Endereço ${address.isDefault ? "principal" : "alternativo"}`,
            address:resData
        }
    }

    const address = await Repository.address.find({ where:{ user:{ id:idUser } } })

    const serializarOorder = address.sort( ( a, b ) => {
       
        const milesecondsA = transformDateInMileseconds( b.createdAt )
        const milesecondsB = transformDateInMileseconds( a.createdAt )

        return milesecondsA - milesecondsB
    } )

    return {
        message:`${ userId && userId !== token.id ? `Endereções do usuario ${user.fullName}` : "Meus endereços" }`,
        address:serializarOorder
    }
}

export default listAddressService