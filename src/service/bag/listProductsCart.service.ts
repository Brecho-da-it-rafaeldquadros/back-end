import { IToken } from "../../interface/users.interface";
import { schemaResponseBag } from "../../serializer/cart.serializer";
import Repository from "../../util/repository.util";
import { tranformPennyInPriceFloat } from "../../util/transform.util";
import { verificationTimeProductMyBag } from "../../util/verificationutil";

const listProductsCartService = async ( token:IToken ) => {

    await verificationTimeProductMyBag( {token} )

    const bag = await Repository.cart.findOne({ where:{ user:{ id:token.id } }, relations:{ user:true, products:{ brand:true, category:true } } })

    if( !bag ){
        return {
            message:"Minha sacola",
            bag
        }
    }

    const products = bag.products

    const productPrice = products.reduce( ( acc, current ) => acc + current.priceAll ,0)

    const serializer = await schemaResponseBag.validate(bag, { stripUnknown:true })

    const format = productPrice.toFixed(2).replace(".", "")

    return {
        message:"Minha sacola",
        resume:{
            price:tranformPennyInPriceFloat(Number(format)).valueFomart,
            amount:products.length
        },
        bag:serializer
    }
}
export default listProductsCartService