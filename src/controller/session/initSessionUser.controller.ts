import { Request, Response } from "express"
import initSessionUserService from "../../service/session/initSessionUser.service"

const initSessionUserController = async ( req:Request, res:Response ) => {

    const data = req.body
    const resData = await initSessionUserService( data )
    return res.status(200).json( resData )
}

export default initSessionUserController