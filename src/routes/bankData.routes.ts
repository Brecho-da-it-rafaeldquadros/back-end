import { Router } from "express"
import addDataBankController from "../controller/bankData/addDataBank.controller "
import deleteDataBankController from "../controller/bankData/deleteDataBank.controller"
import listDataBankController from "../controller/bankData/listDataBank.controller"
import updateDataBankController from "../controller/bankData/updateDataBank.controller"
import validDataMiddleware from "../middlewares/validData.middleware"
import validIdParamsMiddleware from "../middlewares/validIdParms.middleware"
import validTokenMiddleware from "../middlewares/validToken.middleware"
import { schemaBankData } from "../serializer/bankData.serializer"
import { schemaAuth } from "../serializer/user.serializer"

export const bankDataRouter = Router()

bankDataRouter.post("",
    validTokenMiddleware({}),
    validDataMiddleware({
        serializerLevelAll:schemaBankData,
    }),
    addDataBankController
)

bankDataRouter.post("(/user/:id?)?",
    validTokenMiddleware({}),
    validIdParamsMiddleware({
        optionalOne:true,
        optionalTwo:true
    }),
    validDataMiddleware({
        serializerLevelAll:schemaAuth,
    }),
    listDataBankController
)

bankDataRouter.patch("",
    validTokenMiddleware({}),
    validDataMiddleware({
        serializerLevelAll:schemaBankData,
    }),
    updateDataBankController
)

bankDataRouter.delete("",
    validTokenMiddleware({}),
    deleteDataBankController
)