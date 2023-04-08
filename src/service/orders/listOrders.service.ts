import AppError from "../../error/appError"
import { IToken } from "../../interface/users.interface"
import { schemaSerializerOrderArray } from "../../serializer/orders.serializer"
import { transformDateInMileseconds } from "../../util/date.util"
import { paginate } from "../../util/pagination.util"
import Repository from "../../util/repository.util"
import { verificationTimeProducMyOrders } from "../../util/verificationutil"

const listOrdersService = async ( orderId:string, userId:string, token:IToken, query:object ) => {

    await verificationTimeProducMyOrders( { token } )

    if( userId && token.authorizationLevel !== 1 ){
        throw new AppError("Não autorizado", 401)
    }

    if( orderId ){

        const order = await Repository.orders.findOne({ where:{ id:orderId, user: token.authorizationLevel !== 1 ? { id:token.id } : {}  }, relations:{ products:true, user:true } })

        if( !order ){
            throw new AppError("Pedido não encontrado", 404)
        }

        const { user, ...resData } = order

        return {
            message:`Listando um pedido`,
            order:resData
        }
    }

    const id = userId ? userId : token.id

    const user = await Repository.users.findOneBy({ id:token.id })

    if( !user ){
        throw new AppError("Usuario não encontrado", 404)
    }

    const orders = await Repository.orders.find( token.authorizationLevel === 1 && !userId ? {} : { where:{ user:{ id } }, relations:{ user:true } })

    const serializer = await schemaSerializerOrderArray.validate(orders, { stripUnknown:true })

    const serializarOorder = serializer.sort( ( a, b ) => {
       
        const milesecondsA = transformDateInMileseconds( String( b.validAt ) )
        const milesecondsB = transformDateInMileseconds( String( a.validAt ) )

        return milesecondsA - milesecondsB
    } )

    return {
        message: userId ? `Pedidos do usuario ${user.fullName}` : "Meus pedidos",
        ...paginate({
            list: serializarOorder,
            query,
        }),
    }
}

export default listOrdersService