import { Request, Response } from "express";
import listProductsCartService from "../../service/bag/listProductsCart.service";

const listProductsCartController = async ( req:Request, res:Response ) => {

    const token = req.token
    const resData = await listProductsCartService( token )
    return res.status(200).json(resData)
}
export default listProductsCartController