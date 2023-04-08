import { Request, Response } from "express"
import addPreferencesService from "../../service/preference/addPreferences.service"

const addPreferencesController = async ( req:Request, res:Response ) => {

    const data = req.body
    const token = req.token
    const resData = await addPreferencesService( data, token )
    return res.status(200).json( resData )
}

export default addPreferencesController