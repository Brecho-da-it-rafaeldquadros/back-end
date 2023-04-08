import Address from "../../entities/address.entity"
import AppError from "../../error/appError"
import { IDataAddress } from "../../interface/address.interface"
import { IToken } from "../../interface/users.interface"
import { solicitationInformationsCEP } from "../../util/api/viaCep.api"
import { transformsPTBRFormat } from "../../util/date.util"
import Repository from "../../util/repository.util"

const addAddressService = async ( data:IDataAddress, token:IToken ) => {

    const hasCompanyAddress = await Repository.address.findOne({where:{ isCompanyAddress:true }, relations:{ user:true }})

    if( hasCompanyAddress && data?.isCompanyAddress  ){
        throw new AppError(`O administrador ${ hasCompanyAddress?.user.fullName }, já possui um endereço da sede cadastrado`)
    }

    const address = await Repository.address.find({ where:{ user:{ id:token?.id } }, relations:{ user:true } })

    if( address?.length === 5 ){
        throw new AppError("Usuario pode ter apenas 5 endereços cadastrados")
    }

    const isSomeDefaultAddress = address.find( address => address?.isDefault )

    if( data?.isDefault && isSomeDefaultAddress ){
        await Repository.address.update( isSomeDefaultAddress?.id, { isDefault:false } )
    }

    if( !data?.isDefault && !isSomeDefaultAddress ){
        data.isDefault = true
    }

    const user = await Repository.users.findOneBy({ id:token?.id })

    if( !user ){
        throw new AppError("Usuario não encontrado", 404)
    }

    const informationsCEP = await solicitationInformationsCEP({ cep:data?.cep })

    if( informationsCEP?.erro ){
        throw new AppError("CEP inválido")
    }

    const equalCity = hasCompanyAddress?.city === informationsCEP?.localidade

    const CEP = {
        cep:informationsCEP?.cep,
        city:informationsCEP?.localidade,
        uf:informationsCEP?.uf,
        street:informationsCEP?.logradouro,
        neighborhood:informationsCEP?.bairro,
        isSameTown:equalCity,
    }

    const addressData = { ...CEP, user, complement:"Nenhum", createdAt:transformsPTBRFormat() ,...data }

    // @ts-ignore
    const createAddress = Repository.address.create( addressData )

    await Repository.address.save( createAddress )

    if(createAddress.isCompanyAddress){
        const allAddress = await Repository.address.find()

        for (let i = 0; i < allAddress.length; i++) {
            const address = allAddress[i];
            
            await Repository.address.update( address.id, { isSameTown:address.city === createAddress?.city } )
        }
    }

    const { user:x, ...resData } = createAddress

    return {
        message:"Endereço adicionado",
        address:resData
    }
}

export default addAddressService