import { Request, Response } from "express"
import updateUserService from "../../service/users/updateUserController.service"

const updateUserController = async ( req:Request, res:Response ) => {

    const { auth ,...data} = req.body
    const token = req.token
    const { id:userId } = req.params
    const resData = await updateUserService( userId, auth, data, token )
    return res.status(200).json( resData )
}

export default updateUserController