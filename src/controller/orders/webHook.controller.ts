import { Request, Response } from "express"
import webHookService from "../../service/orders/webHook.service"

const webHookController = async ( req:Request, res:Response ) => {

    const data = req.body
    const resData = await webHookService( data )
    return res.status(200).json( resData )
}

export default webHookController