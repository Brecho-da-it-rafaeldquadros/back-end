import { Router } from "express"
import addPreferencesController from "../controller/preference/addPreferences.controller"
import listPreferencesController from "../controller/preference/listPreferences.controller"
import removePreferencesController from "../controller/preference/removePreferences.controller"
import updatePreferencesController from "../controller/preference/updatePreferences.controller"
import validDataMiddleware from "../middlewares/validData.middleware"
import validIdParamsMiddleware from "../middlewares/validIdParms.middleware"
import validTokenMiddleware from "../middlewares/validToken.middleware"
import { schemaAddPreferencesAll, schemaUpdatePreferencesAll } from "../serializer/preferences.serializer"

export const preferenceRouter = Router()

preferenceRouter.post("",
    validTokenMiddleware({}),
    validDataMiddleware({
        serializerLevelAll:schemaAddPreferencesAll
    }),
    addPreferencesController
)

preferenceRouter.get("(/user/:id?)?",
    validTokenMiddleware({}),
    validIdParamsMiddleware({ 
        optionalOne:true,
        optionalTwo:true  
    }),
    listPreferencesController
)

preferenceRouter.patch("",
    validTokenMiddleware({}),
    validDataMiddleware({
        serializerLevelAll:schemaUpdatePreferencesAll
    }),
    updatePreferencesController
)

preferenceRouter.delete("",
    validTokenMiddleware({}),
    removePreferencesController
)