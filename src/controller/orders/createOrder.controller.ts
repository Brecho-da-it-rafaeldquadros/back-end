import { Request, Response } from "express"
import createOrderService from "../../service/orders/createOrder.service"

const createOrderController = async ( req:Request, res:Response ) => {

    const token = req.token
    const data = req.body
    const resData = await createOrderService( data, token )
    return res.status(201).json( resData )
}

export default createOrderController