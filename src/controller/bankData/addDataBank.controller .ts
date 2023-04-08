import { Request, Response } from "express"
import addDataBankService from "../../service/bankData/addDataBank.service"

const addDataBankController = async ( req:Request, res:Response ) => {

    const data = req.body
    const token = req.token
    const resData = await addDataBankService( data, token )
    return res.status(200).json( resData )
}

export default addDataBankController