import AppError from "../../error/appError"
import { IResponseGetPayment, IWebHook } from "../../interface/orders.interface"
import mercadopago from "mercadopago"
import Repository from "../../util/repository.util"
import { verificationTimeProducMyOrders, verificationTimeProductMyBag } from "../../util/verificationutil"

import "dotenv/config"

const webHookService = async ( data:IWebHook ) => {

    if( data?.type === "test" ){
        return
    }

    await verificationTimeProductMyBag( {} )
    await verificationTimeProducMyOrders( {} )

    mercadopago.configure({ access_token:process.env.TOKEN_MERCADOPAGO })   

    if( data.type !== "payment" ){
        throw new AppError("Route for payments", 403)
    }

    const paymentId = Number( data.data.id )
 
    const response:any = await mercadopago.payment.get(paymentId)
    const payment  = response.body as IResponseGetPayment

    if( payment.status === 404 || payment?.cause?.code === 2000 ){
        throw new AppError("Payment not found", 404)
    }

    const order = await Repository.orders.findOne({ where:{ id:payment.metadata.order_id }, relations:{ products:true } })

    if( !order || order?.status === "PAGAMENTO APROVADO"){

        throw new AppError("Order not found", 404)
    }

    let status = ""

    switch(payment.status){
        case 'pending':
            status = "AGUARDANDO PAGAMENTO"
            break
        case 'approved':
            status = "PAGAMENTO APROVADO"
            break
        case "authorized":
            status = "PAGAMENTO AUTORIZADO"
            break
        case "in_process":
            status = "PAGAMENTO EM ANALISE"
            break
        case "in_mediation":
            status = "PAGAMENTO EM DISPUTA"
            break
        case "rejected":
            status = "PAGAMENTO REJEITADO"
            break
        case "cancelled":
            status = "PAGAMENTO CANCELADO"
            break
        case "refunded":
            status = "PAGAMENTO DEVOLVIDO AO USUARIO"
            break
        case "charged_back":
            status = "PAGAMENTO ESTORNADO NO CARTÃO DE CREDITO"
            break
    }
    
    await Repository.orders.update( order.id, { 
        method:payment.payment_method_id, 
        methodType:payment.payment_type_id,
        status,
        paymentId:payment.id
    } )
}

export default webHookService