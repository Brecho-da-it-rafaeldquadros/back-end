import { Request, Response } from "express"
import createUserService from "../../service/users/createUser.service"

const createUserController = async ( req:Request, res:Response ) => {

    const data = req.body
    const resData = await createUserService( data )
    return res.status(201).json( resData )
}

export default createUserController