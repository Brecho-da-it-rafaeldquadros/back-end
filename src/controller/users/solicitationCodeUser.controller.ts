import { Request, Response } from "express"
import solicitationCodeUserService from "../../service/users/solicitationCodeUser.service"

const solicitationCodeUserController = async ( req:Request, res:Response ) => {

    const { id:userId } = req.params
    const URL = req.originalUrl
    const resData = await solicitationCodeUserService( userId, URL )
    return res.status(200).json( resData )
}

export default solicitationCodeUserController