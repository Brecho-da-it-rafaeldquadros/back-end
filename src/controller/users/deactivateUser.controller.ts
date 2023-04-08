import { Request, Response } from "express"
import deactivateUserService from "../../service/users/deactivateUser.service"

const deactivateUserController = async ( req:Request, res:Response ) => {

    const auth = req.body
    const token = req.token
    const { id:userId } = req.params
    const resData = await deactivateUserService( userId, auth, token )
    return res.status(200).json( resData )
}

export default deactivateUserController