import { Router } from "express"
import addAddressController from "../controller/address/addAddress.controller"
import deleteAddressController from "../controller/address/deleteAddress.controller"
import listAddressController from "../controller/address/listAddress.controller"
import listDeliveryController from "../controller/address/listDelivery.controller"
import updateAddressController from "../controller/address/updateAddress.controller"
import validDataMiddleware from "../middlewares/validData.middleware"
import validIdParamsMiddleware from "../middlewares/validIdParms.middleware"
import validTokenMiddleware from "../middlewares/validToken.middleware"
import { addressUpdateUserLevelAll, addressUpdateUserLevelOne, addressUserLevelAll, addressUserLevelOne } from "../serializer/address.serializer"

export const addressRouter = Router()

addressRouter.post("", 
    validTokenMiddleware({}),
    validDataMiddleware({
        serializerLevelAll:addressUserLevelAll,
        serializerLevelOne:addressUserLevelOne
    }),
    addAddressController
)

addressRouter.get("/delivery", 
    validTokenMiddleware({}),
    listDeliveryController
)

addressRouter.get("/:id?/user(/:idTwo?)/type(/all)?", 
    validTokenMiddleware({}),
    validIdParamsMiddleware({ 
        optionalOne:true,
        optionalTwo:true  
    }),
    listAddressController
)

addressRouter.patch("/:id", 
    validTokenMiddleware({}),
    validIdParamsMiddleware({
        optionalTwo:true
    }),
    validDataMiddleware({
        serializerLevelAll:addressUpdateUserLevelAll,
        serializerLevelOne:addressUpdateUserLevelOne
    }),
    updateAddressController
)

addressRouter.delete("/:id", 
    validTokenMiddleware({}),
    validIdParamsMiddleware({
        optionalTwo:true
    }),
    deleteAddressController
)