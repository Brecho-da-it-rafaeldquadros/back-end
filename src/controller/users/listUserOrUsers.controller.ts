import { Request, Response } from "express"
import listUserOrUsersService from "../../service/users/listUserOrUsers.service"

const listUserOrUsersController = async ( req:Request, res:Response ) => {

    const token = req.token
    const URL = req.originalUrl
    const { id:userId } = req.params
    const query = req.query
    const resData = await listUserOrUsersService( userId, token, URL, query )
    return res.status(200).json( resData )
}

export default listUserOrUsersController