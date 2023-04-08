import { Request, Response } from "express"
import confirmCodeUserService from "../../service/users/confirmCodeUser.service"

const confirmCodeUserController = async ( req:Request, res:Response ) => {

    const data = req.body
    const { id:userId } = req.params
    const URL = req.originalUrl
    const resData = await confirmCodeUserService( userId, data, URL )
    return res.status(200).json( resData )
}

export default confirmCodeUserController