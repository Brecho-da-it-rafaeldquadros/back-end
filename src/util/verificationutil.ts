import { compareSync } from "bcryptjs"
import AppError from "../error/appError"
import { IToken } from "../interface/users.interface"
import { getCurrentDateMileseconds, transformDateInMileseconds } from "./date.util"
import Repository from "./repository.util"

export const hasEmailOrPhoneAndError = ( URL:string ) => {
    const hasEmail = URL.includes("email")
    const hasPhone = URL.includes("sms")

    if( hasEmail && hasPhone || !hasEmail && !hasPhone){
        throw new AppError("Deve sinalizar na URL se é para 'EMAIL' ou 'SMS'")
    }

    const emailOrPhone = hasEmail ? "email" : "sms"

    return emailOrPhone
}

export const hasRouteNameSolicitation = ( URL:string ) => {
    const isUpdate = URL.includes("update")
    const isCreate = URL.includes("create")
    const isRetrieveAccount = URL.includes("retrieveAccount")

    if( isUpdate || isCreate || isRetrieveAccount){
        
        const type = isUpdate ? "update" : isCreate ? "create" : "retrieveAccount"

        return type
    }

    throw new AppError("Deve sinalizar qual rota")
}

export const verificationEqualPasswordInTokenOrError = async ( password:string, token:IToken ) => {

    const user = await Repository.users.findOneBy({ id:token.id })

    const equalPassword = compareSync( password, user.password )

    if( !equalPassword ){
        throw new AppError("Senha inválida", 401)
    }
}

interface IOptionalToken {
    token?:IToken 
}

export const verificationTimeProductMyBag = async ( { token }:IOptionalToken ) => {
    const bags = await Repository.cart.find({ where:{ user:token ? { id:token.id } : {} }, relations:{ user:true, products:true } })

    if( bags.length === 0 ){
        return
    }

    for (let i = 0; i < bags.length; i++) {
        const bag = bags[i];
        
        const validCart = transformDateInMileseconds(bag?.validAt) 
        
        const currentMilesecond = getCurrentDateMileseconds()

        const isClearCart = validCart < currentMilesecond

        if( isClearCart ){

            const products = bag?.products

            for (let i = 0; i < products?.length; i++) {
                const product = products[i];

                await Repository.product.update( product.id, { cart:null, status:"Disponível" } )
            }
            await Repository.cart.remove( bag )
        }
    }
}

export const verificationTimeProducMyOrders = async ( { token }:IOptionalToken ) => {
    const myAwaitOrders = await Repository.orders.find({ where:{ user: token ? { id:token.id } : {} }, relations:{ user:true, products:true } })

    const listOrders = myAwaitOrders.filter( ({ status }) => status === "AGUARDANDO PAGAMENTO" || status === "PAGAMENTO EM ANALISE" )

    if( listOrders.length === 0 ){
        return
    }

    for (let i = 0; i < listOrders.length; i++) {
        const order = listOrders[i];

        const validOrder = transformDateInMileseconds(order.validAt) 
            
        const currentMilesecond = getCurrentDateMileseconds()

        const isClearOrder = validOrder < currentMilesecond

        if( isClearOrder ){

            const products = order.products

            for (let i = 0; i < products.length; i++) {
                const product = products[i];

                await Repository.product.update( product.id, { order:null, status:"Disponível" } )
            }

            await Repository.orders.update( order.id, { 
                status:"TEMPO ESGOTADO", 
                trackingCode:"TEMPO ESGOTADO", 
                companyTrackingAreaLink:"TEMPO ESGOTADO", 
                method:"TEMPO ESGOTADO",
                methodType:"TEMPO ESGOTADO",
                ...(order.paymentId === "AGUARDANDO PAGAMENTO")&&{paymentId:"TEMPO ESGOTADO"}
            } )
        }   
    }
}

