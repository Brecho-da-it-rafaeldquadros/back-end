import { Request, Response } from "express"
import listDataBankService from "../../service/bankData/listDataBank.service"

const listDataBankController = async ( req:Request, res:Response ) => {

    const auth = req.body
    const { id:userId } = req.params
    const token = req.token
    const resData = await listDataBankService( userId, auth, token )
    return res.status(200).json( resData )
}

export default listDataBankController