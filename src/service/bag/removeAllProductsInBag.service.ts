import AppError from "../../error/appError"
import { IToken } from "../../interface/users.interface"
import Repository from "../../util/repository.util"

const removeAllProductsInBagService = async ( token:IToken ) => {

    const myBag = await Repository.cart.findOne({ where:{ user:{ id:token.id } }, relations:{ user:true, products:true } })

    if( !myBag ){
        throw new AppError("Sacola não encontrada", 404)
    }

    for (let i = 0; i < myBag.products.length; i++) {
        const productId = myBag.products[i].id
        
        await Repository.product.update( productId, { cart:null } )
    }

    await Repository.cart.remove( myBag )

    return {
        message:"Sacola removida"
    }
}

export default removeAllProductsInBagService