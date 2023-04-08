import { Request, Response } from "express";
import removeProductCartService from "../../service/bag/removeProductCart.service";

const removeProductCartController = async ( req:Request, res:Response ) => {

    const { id:productId } = req.params
    const token = req.token
    const resData = await removeProductCartService( productId, token )
    return res.status(200).json(resData)
}

export default removeProductCartController