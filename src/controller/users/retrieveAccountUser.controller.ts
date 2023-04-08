import { Request, Response } from "express"
import retrieveAccountUserService from "../../service/users/retrieveAccountUser.service"

const retrieveAccountUserController = async ( req:Request, res:Response ) => {

    const data = req.body
    const resData = await retrieveAccountUserService( data )
    return res.status(200).json( resData )
}

export default retrieveAccountUserController