import { Request, Response } from "express"
import listAddressService from "../../service/address/listAddress.service"

const listAddressController = async ( req:Request, res:Response ) => {

    const URL = req.originalUrl
    const token = req.token
    const { id:addressId, idTwo:userId } = req.params
    const resData = await listAddressService( addressId, userId, URL, token )
    return res.status(200).json( resData )
}

export default listAddressController