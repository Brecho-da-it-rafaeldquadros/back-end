import AppError from "../../error/appError"
import { IResponsePreference, ITransport } from "../../interface/orders.interface"
import { IToken } from "../../interface/users.interface"
import { createDateFormtExpirationMercadoPago, generateDatePerMileseconds, getCurrentDateMileseconds } from "../../util/date.util"
import Repository from "../../util/repository.util"
import { verificationTimeProductMyBag } from "../../util/verificationutil"
import mercadopago from "mercadopago"
import { CreatePreferencePayload, PreferenceItem } from "mercadopago/models/preferences/create-payload.model"
import { schemaSerializerOrderReduced } from "../../serializer/orders.serializer"

import "dotenv/config"

const createOrderService = async ( transport:ITransport, token:IToken ) => {

    mercadopago.configure({ access_token:process.env.TOKEN_MERCADOPAGO })   

    await verificationTimeProductMyBag( {token} )

    const user = await Repository.users.findOne({ where:{ id:token.id }, relations:{ bankData:true, cart:{ products:{ category:true } }, address:true } })
    
    if( !user?.cart || user?.cart?.products?.length === 0 ){
        throw new AppError("Produtos da sacola não foram encontrados", 404)
    }

    const address = getAddressDefault()
    
    function getAddressDefault(){

        const address = user?.address

        if( address.length === 0 ){
            throw new AppError("Endereço não encontrado", 404)
        }

        const addressDefault = address.find( address => address.isDefault )

        if( !addressDefault ){
            throw new AppError("Deve ter um endereço padrão", 403)
        }

        return addressDefault
    }

    const products = user?.cart?.products

    const date_of_expiration = createDateFormtExpirationMercadoPago( generateDatePerMileseconds((getCurrentDateMileseconds() - 3600000) + 1800000) )
    const date_init = createDateFormtExpirationMercadoPago( generateDatePerMileseconds((getCurrentDateMileseconds() - 3600000)) )

    const productsPayment = products.map( product => { 

        const picture_url = 
            product?.image_1 ? product?.image_1 : 
            product?.image_2 ? product?.image_2 : 
            product?.image_3 ? product?.image_3 : 
            "Não encontrado"

        const newObj:PreferenceItem = {	
            id:product.id,
            title: product.name,
            description: product.description,
            picture_url: picture_url,
            category_id: product.category.name,
            quantity: 1,
            currency_id: "BRL",
            unit_price: product.priceAll
        }

        return newObj
    } )

    const deliveryStowageAt = generateDeliveryStowageAt()

    function generateDeliveryStowageAt():string{
        
        let mileseconds = transport.delivery_time * 86400000
        mileseconds += 86400000
        
        const currentDate = getCurrentDateMileseconds() 
        const resultDate = generateDatePerMileseconds(currentDate + mileseconds)

        return resultDate.slice(0,10)
    }

    const productPrice = productsPayment.reduce( ( acc, current ) => acc + current.unit_price ,0)

    const company = await Repository.address.findOne({ where:{ isCompanyAddress:true } })

    const order = {
        method:"NÃO SELECIONADO",
        simpleProducts:productsPayment.map( product => `${ product.title } - ${product.category_id} - ${product.unit_price}` ),
        priceAll: productPrice + ( transport?.price / 100 ),
        priceTransport: ( transport?.price / 100 ),
        companyAddress:`${company.street}, ${company.number}, ${company.neighborhood}, ${company.city}/${company.uf} - ${company.cep}`,
        deliveryStowageAt,
        deliveryMethodCode:transport.code,
        priceProducts:productPrice,
        address:`Rua ${address.street}, número ${address.number}, ${address.neighborhood}, ${address.city}/${address.uf} - ${address.cep}`,
        validAt:generateDatePerMileseconds(getCurrentDateMileseconds() + 1800000),
        status:"AGUARDANDO PAGAMENTO",
        user
    }

    const orderCreated = Repository.orders.create( order )

    try {
        
        await Repository.orders.save( orderCreated )
    } catch (error:any) {
        throw new AppError(error.message)
    }
    
    const preferencesData:CreatePreferencePayload = {
        additional_info:"Compra em Brecho da It",
        metadata:{ order_id:orderCreated.id },
        expires:true,
        external_reference:"Brecho da It",
        items: productsPayment,
        payment_methods:{
            excluded_payment_methods:[{"id":"meliplace"}, {"id":"pec"}, {"id":"bolbradesco"}]
        },
        shipments: {
            cost:( transport?.price / 100 ),
            receiver_address: {
                zip_code: address.cep,
                street_name: address.street,
                street_number: Number( address.number ),
                city_name: address.city,
                state_name: address.uf
            }
        },
        payer:{
            name:user.fullName,
            email:user.email,
            phone:{
                area_code:user.phone.slice(2,4),
                // @ts-ignore
                number:Number( user.phone.slice(4,user.phone.length) )
            }
        }
    }

    if( process.env.NODE_ENV !== "test" ){
        preferencesData.date_of_expiration = date_of_expiration
        preferencesData.expiration_date_from = date_init
        preferencesData.expiration_date_to = date_of_expiration
    }

    try {
        
        const sucess = await mercadopago.preferences.create(
            preferencesData
        )

        const data = sucess.body as IResponsePreference

        const order = {
            preferenceId:data.id,
            paymentURL:data.sandbox_init_point,
            user
        }

        await Repository.orders.update( orderCreated.id, order )

        const resOrder = await Repository.orders.findOneBy({ id:orderCreated.id })

        for (let i = 0; i < products.length; i++) {
            const { id } = products[i]
            
            await Repository.product.update( id, { cart:null, order:resOrder } )
        }

        await Repository.cart.delete( user.cart.id )

        const serializer = await schemaSerializerOrderReduced.validate(resOrder, { stripUnknown:true })

        return {
            message:"Pedido criado",
            order:serializer
        }
    } catch (error:any) {
        await Repository.orders.delete( orderCreated.id )

        throw new AppError(`${error.message}`, 500)
    }
}

export default createOrderService
