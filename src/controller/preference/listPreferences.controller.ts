import { Request, Response } from "express"
import listPreferencesService from "../../service/preference/listPreferences.service"

const listPreferencesController = async ( req:Request, res:Response ) => {

    const token = req.token
    const { id:userId } = req.params
    const resData = await listPreferencesService( userId, token )
    return res.status(200).json( resData )
}

export default listPreferencesController