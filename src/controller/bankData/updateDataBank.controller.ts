import { Request, Response } from "express"
import updateDataBankService from "../../service/bankData/updateDataBank.service"

const updateDataBankController = async ( req:Request, res:Response ) => {

    const token = req.token
    const data = req.body
    const resData = await updateDataBankService( data, token )
    return res.status(200).json( resData )
}

export default updateDataBankController