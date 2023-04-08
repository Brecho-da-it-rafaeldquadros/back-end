import AppError from "../../error/appError"
import { IToken } from "../../interface/users.interface"
import { generateDatePerMileseconds, getCurrentDateMileseconds } from "../../util/date.util"
import Repository from "../../util/repository.util"
import { verificationTimeProducMyOrders, verificationTimeProductMyBag } from "../../util/verificationutil";

const addProductCartService = async ( productId:string, token:IToken ) => {

    await verificationTimeProductMyBag( {} )
    await verificationTimeProducMyOrders( {} )

    const product = await Repository.product.findOneBy({ id:productId })
    
    if( !product ){
       throw new AppError("Produto não encontrado", 404) 
    }

    const solicitationMessage = "Produto já foi solicitado por outro usuario"

    await verificationCartOtherUsers()

    async function verificationCartOtherUsers(){
        const hasProductCartOtherUser = await Repository.cart.findOne({ where:{ products:{ id:productId } }, relations:{ products:true, user:true } })
        
        const hasIdCart = hasProductCartOtherUser?.user?.id

        if( hasProductCartOtherUser ){
            throw new AppError(hasIdCart === token.id ? "Produto já está na sua sacola" : solicitationMessage, 403 )
        }
    }

    await verificationOrderOtherUsers()

    async function verificationOrderOtherUsers(){
        const hasProductOrderOtherUser = await Repository.orders.findOne({ where:{ products:{ id:productId } }, relations:{ products:true, user:true } })

        const hasIdOrder = hasProductOrderOtherUser?.user?.id

        if( hasProductOrderOtherUser && hasProductOrderOtherUser.status === "PAGAMENTO APROVADO" ){
            throw new AppError(`Produto já foi comprado por ${ hasIdOrder === token.id ? "você" : "outro usuario"}`, 403)
        }

        if( hasProductOrderOtherUser ){
            throw new AppError(hasIdOrder === token.id ? "Produto já está aguardando seu pagamento" : solicitationMessage, 403 )
        }
    }

    const currentMileseconds = getCurrentDateMileseconds()
    const validDate = generateDatePerMileseconds( currentMileseconds + 1800000 )

    const myCart = await hasCartOrCreate()

    async function hasCartOrCreate() {
        
        const hasCart = await Repository.cart.findOne({ where:{ user:{ id:token.id } }, relations:{ user:true } })

        if( hasCart ){
            await Repository.cart.update( hasCart.id, { validAt:validDate } )

            return hasCart
        }

        const user = await Repository.users.findOneBy({ id:token.id })

        const dataCart = {
            validAt:validDate,
            user
        }

        const cart = Repository.cart.create( dataCart )
        await Repository.cart.save( cart )

        return cart
    }

    await Repository.product.update(productId, { cart:myCart, status:"Indisponível" })

    return {
        message:"Produto adicionado"
    }
};

export default addProductCartService