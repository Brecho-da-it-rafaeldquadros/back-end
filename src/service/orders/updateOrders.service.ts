import AppError from "../../error/appError"
import { IUpdateOrder } from "../../interface/orders.interface"
import { IToken } from "../../interface/users.interface"
import Repository from "../../util/repository.util"

const updateOrdersService = async ( orderId:string, data:IUpdateOrder, token:IToken ) => {

    const order = await Repository.orders.findOneBy({ id:orderId })
    
    if( !order ){
        throw new AppError("Pedido não encontrado", 404)
    }

    const isTimeDefeated = order?.status === "TEMPO ESGOTADO"

    if( isTimeDefeated ){
        throw new AppError("Tempo esgotado")
    }

    const defaultMessage = "AGUARDANDO RASTREIO"

    const isDefaultDataOrderTracking = order?.companyTrackingAreaLink === defaultMessage && order?.trackingCode === defaultMessage
    const isSendTwoKeys = data?.companyTrackingAreaLink && data?.trackingCode

    if( isDefaultDataOrderTracking && !isSendTwoKeys){
        throw new AppError("Deve enviar o código de rastreio e o link do site aconde poderá ser usado")
    }

    await Repository.orders.update( orderId, data )

    const resOrder = await Repository.orders.findOneBy({ id:orderId })

    return {
        message:"Rastreio atualizado",
        order:resOrder
    }
}

export default updateOrdersService