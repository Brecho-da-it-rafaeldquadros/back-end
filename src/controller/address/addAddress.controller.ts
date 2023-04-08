import { Request, Response } from "express"
import addAddressService from "../../service/address/addAddress.service"

const addAddressController = async ( req:Request, res:Response ) => {

    const data = req.body
    const token = req.token
    const resData = await addAddressService( data, token )
    return res.status(201).json( resData )
}

export default addAddressController