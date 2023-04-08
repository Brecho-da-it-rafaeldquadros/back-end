import { Request, Response } from "express"
import updatePreferencesService from "../../service/preference/updatePreferences.service"

const updatePreferencesController = async ( req:Request, res:Response ) => {

    const data = req.body
    const token = req.token
    const resData = await updatePreferencesService( data, token )
    return res.status(200).json( resData )
}

export default updatePreferencesController