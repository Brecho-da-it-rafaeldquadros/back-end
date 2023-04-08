import AppError from "../../error/appError"
import { IToken } from "../../interface/users.interface"
import Repository from "../../util/repository.util"

const removeProductCartService = async ( productId:string, token:IToken ) => {

    const myBag = await Repository.cart.findOne({ where:{ user:{ id:token.id } }, relations:{ user:true, products:true } })

    const hasProductInMyBag = myBag?.products?.find( product => product.id === productId ) 

    if( !hasProductInMyBag ){
        throw new AppError("Producto não encontrado na sua sacola", 404)
    }
    
    await Repository.product.update( productId, { cart:null } )

    if( myBag.products.length === 1 ){
        await Repository.cart.remove(myBag)
    }

    return {
        message:"Produto removido da sacola"
    }
}

export default removeProductCartService