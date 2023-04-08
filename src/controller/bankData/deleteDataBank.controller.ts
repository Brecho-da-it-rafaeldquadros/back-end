import { Request, Response } from "express"
import deleteDataBankService from "../../service/bankData/deleteDataBank.service"

const deleteDataBankController = async ( req:Request, res:Response ) => {

    const token = req.token
    const resData = await deleteDataBankService( token )
    return res.status(200).json( resData )
}

export default deleteDataBankController