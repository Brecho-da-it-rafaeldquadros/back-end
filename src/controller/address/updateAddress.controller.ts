import { Request, Response } from "express"
import updateAddressService from "../../service/address/updateAddress.service"

const updateAddressController = async ( req:Request, res:Response ) => {

    const { id:addressId } = req.params
    const data = req.body
    const token = req.token
    const resData = await updateAddressService( addressId, data, token )
    return res.status(200).json( resData )
}

export default updateAddressController