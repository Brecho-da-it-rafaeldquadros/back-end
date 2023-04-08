import { Request, Response } from "express"
import listOrdersService from "../../service/orders/listOrders.service"

const listOrdersController = async ( req:Request, res:Response ) => {

    const { id:orderId ,idTwo:userId } = req.params
    const token = req.token
    const query = req.query
    const resData = await listOrdersService( orderId, userId, token, query )
    return res.status(200).json( resData )
}

export default listOrdersController