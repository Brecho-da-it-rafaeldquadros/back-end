import { Request, Response } from "express"
import listDeliveryService from "../../service/address/listDelivery.service"

const listDeliveryController = async ( req:Request, res:Response ) => {

    const token = req.token
    const resData = await listDeliveryService( token )
    return res.status(200).json(resData)
}

export default listDeliveryController