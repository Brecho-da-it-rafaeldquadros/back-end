import AppError from "../../error/appError"
import { IDataAddress } from "../../interface/address.interface"
import { IToken } from "../../interface/users.interface"
import { addressUpdateUserLevelOne } from "../../serializer/address.serializer"
import { solicitationInformationsCEP } from "../../util/api/viaCep.api"
import Repository from "../../util/repository.util"

const updateAddressService = async ( addressId:string, data:IDataAddress, token:IToken ) => {

    if( Object.entries( data ).length === 0 ){
        throw new AppError("Deve enviar algo para atualizar", 404)
    }

    const address = await Repository.address.findOne({where:{ id:addressId }, relations:{ user:true }})

    if( address && address?.user?.id !== token.id  ){
        throw new AppError("Usuario pode atualizar apenas seus propios endereços", 401)
    }

    if( !address ){
        throw new AppError("Endereço não encontrado", 404)
    }

    const addressMany = await Repository.address.findOne({ where:{ user:{ id:token.id } ,isDefault:true }, relations:{ user:true } })

    if( data?.isDefault && addressMany && addressMany?.id !== addressId ){
        
        await Repository.address.update( addressMany.id, { isDefault:false } )
    }

    const hasCompanyAddress = await Repository.address.findOne({where:{ isCompanyAddress:true }, relations:{ user:true }})
    
    if( hasCompanyAddress && data?.isCompanyAddress ){
        throw new AppError(`O administrador ${ hasCompanyAddress.user.fullName }, já possui um endereço da sede cadastrado`)
    }

    if( data?.cep && !data?.number ){
        throw new AppError("Deve indicar o numero da casa junto ao CEP")
    }

    if( data?.cep ){
        const informationsCEP = await solicitationInformationsCEP({ cep:data.cep })

        const equalCity = hasCompanyAddress?.city === informationsCEP?.localidade

        let updateCEP = {
            cep:informationsCEP?.cep,
            city:informationsCEP?.localidade,
            uf:informationsCEP?.uf,
            street:informationsCEP?.logradouro,
            neighborhood:informationsCEP.bairro,
            isSameTown:equalCity
        }

        const addressUpdate = { ...data ,...updateCEP  }

        // @ts-ignore
        await Repository.address.update( addressId, addressUpdate )
    }else{

     // @ts-ignore
        await Repository.address.update( addressId, data )
    }

    const resAddress = await Repository.address.findOneBy({ id:addressId })

    if( token.authorizationLevel === 1 && data.isCompanyAddress === ( true || false ) ){

        const manyAddress = await Repository.address.find()

        for (let i = 0; i < manyAddress.length; i++) {
            const currentAddress = manyAddress[i];
            
            if( address.isCompanyAddress && !data.isCompanyAddress ){
                await Repository.address.update( currentAddress.id, { isSameTown:false } )
            }
            if( !address.isCompanyAddress && data.isCompanyAddress ){
                await Repository.address.update( currentAddress.id, { isSameTown:resAddress.city === currentAddress.city} )
            }
        }
    }

    return {
        message:"Endereço atualizado",
        address:resAddress
    }
}

export default updateAddressService