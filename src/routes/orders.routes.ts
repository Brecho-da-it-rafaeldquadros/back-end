import { Router } from "express"
import createOrderController from "../controller/orders/createOrder.controller"
import listOrdersController from "../controller/orders/listOrders.controller"
import updateOrdersController from "../controller/orders/updateOrders.controller"
import webHookController from "../controller/orders/webHook.controller"
import ensureIsAdminMiddleware from "../middlewares/isAdmin.middleware"
import validQueryPaginationMiddleware from "../middlewares/pagination.middleware"
import validDataMiddleware from "../middlewares/validData.middleware"
import validIdParamsMiddleware from "../middlewares/validIdParms.middleware"
import validTokenMiddleware from "../middlewares/validToken.middleware"
import { schemaTransport, schemaUpdateOrder, schemaWebHook } from "../serializer/orders.serializer"

export const ordersRouter = Router()

ordersRouter.post("/webhook", 
    validDataMiddleware({
        serializerLevelAll:schemaWebHook
    }),
    webHookController
)

ordersRouter.post("", 
    validTokenMiddleware({}),
    validDataMiddleware({
        serializerLevelAll:schemaTransport
    }),
    createOrderController
)

ordersRouter.get("/:id?(/user/:idTwo)?",     
    validTokenMiddleware({}),
    validIdParamsMiddleware({ 
        optionalOne:true,
        optionalTwo:true
    }),
    validQueryPaginationMiddleware,
    listOrdersController
)

ordersRouter.patch("/:id", 
    validTokenMiddleware({}),
    ensureIsAdminMiddleware,
    validIdParamsMiddleware({ 
        optionalTwo:true
    }),
    validDataMiddleware({
        serializerLevelAll:schemaUpdateOrder
    }),
    updateOrdersController
)