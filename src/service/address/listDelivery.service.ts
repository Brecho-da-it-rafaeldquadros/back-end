import { IToken } from "../../interface/users.interface"
import ApiNodeCorreios from "node-correios"
import Repository from "../../util/repository.util";
import AppError from "../../error/appError";
import { addressDeliveryArray } from "../../serializer/address.serializer";

const correios = new ApiNodeCorreios();

const listDeliveryService = async ( token:IToken ) => {

    const addressUser = await Repository.address.findOne({ where:{ user:{ id:token.id }, isDefault:true }, relations:{ user:true } })

    if( !addressUser ){
        throw new AppError("Endereço não encontrado", 404)
    }

    const addressCompany = await Repository.address.findOne({ where:{ isCompanyAddress:true } })

    if( !addressCompany ){
        throw new AppError("Endereço da origem não cadastrado, solicitar um adminitrador", 404)
    }

    const data = {
        sCepOrigem: addressCompany.cep,
        sCepDestino: addressUser.cep,
        nVlPeso: '1',
        nCdFormato: '1',
        nVlComprimento: '20',
        nVlAltura: '20',
        nVlLargura: '20',
        nCdServico: ['04014', '40169', '40215', '40290'],
        nVlDiametro: '0',
    }

    try {
        const sucess = await correios.calcPrecoPrazo(data)

        let serializer = await addressDeliveryArray.validate(sucess, { stripUnknown:true })

        if( addressUser.isSameTown ){

            const a = addressCompany

            const pickUpInStore = {
                type: "Pegar na loja",
                description:`Rua ${a.street}, ${a.number}, ${a.neighborhood}, ${a.city}/${a.uf} ${a.cep}`,
                Codigo: 0,
                Valor: "00,00",
                PrazoEntrega: "0",
                EntregaDomiciliar: null,
                EntregaSabado: null
            }

            serializer.push(pickUpInStore)
        }

        return {
            message:"Métodos de entrega",
            delivery:serializer
        }
    } catch (error) {
        return error.message
    }
}

export default listDeliveryService