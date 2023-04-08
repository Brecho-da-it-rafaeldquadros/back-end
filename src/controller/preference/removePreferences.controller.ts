import { Request, Response } from "express"
import removePreferencesService from "../../service/preference/removePreferences.service"

const removePreferencesController = async ( req:Request, res:Response ) => {

    const token = req.token
    const resData = await removePreferencesService( token )
    return res.status(200).json( resData )
}

export default removePreferencesController