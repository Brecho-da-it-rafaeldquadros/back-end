import { Request, Response } from "express";
import addProductCartService from "../../service/bag/addProductCart.service";

const addProductCartController = async ( req:Request, res:Response ) => {

    const { id:productId } = req.params
    const token = req.token
    const resData = await addProductCartService( productId, token )
    return res.status(201).json(resData)
}

export default addProductCartController