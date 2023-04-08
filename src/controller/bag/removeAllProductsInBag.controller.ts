import { Request, Response } from "express";
import removeAllProductsInBagService from "../../service/bag/removeAllProductsInBag.service";

const removeAllProductsInBagController = async ( req:Request, res:Response ) => {

    const token = req.token
    const resData = await removeAllProductsInBagService( token )
    return res.status(200).json(resData)
}

export default removeAllProductsInBagController