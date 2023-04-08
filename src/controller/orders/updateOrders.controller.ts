import { Request, Response } from "express"
import updateOrdersService from "../../service/orders/updateOrders.service"

const updateOrdersController = async ( req:Request, res:Response ) => {

    const { id:orderId } = req.params
    const token = req.token
    const data = req.body
    const resData = await updateOrdersService( orderId, data, token )
    return res.status(200).json( resData )
}

export default updateOrdersController