import { Request, Response } from "express"
import deleteAddressService from "../../service/address/deleteAddress.service"

const deleteAddressController = async ( req:Request, res:Response ) => {

    const { id:addressId } = req.params
    const token = req.token
    const resData = await deleteAddressService( addressId, token )
    return res.status(200).json( resData )
}

export default deleteAddressController