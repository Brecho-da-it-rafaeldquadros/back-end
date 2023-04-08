import { Router } from "express"
import addProductCartController from "../controller/bag/addProductCart.controller"
import listProductsCartController from "../controller/bag/listProductsCart.controller"
import removeProductCartController from "../controller/bag/removeProductCart.controller"
import removeAllProductsInBagController from "../controller/bag/removeAllProductsInBag.controller"
import validIdParamsMiddleware from "../middlewares/validIdParms.middleware"
import validTokenMiddleware from "../middlewares/validToken.middleware"

export const cartRouter = Router()

cartRouter.post("/product/:id", 
    validTokenMiddleware({}),
    validIdParamsMiddleware({ 
        optionalTwo:true
    }),
    addProductCartController
)

cartRouter.get("", 
    validTokenMiddleware({}),
    listProductsCartController
)

cartRouter.delete("/product/:id", 
    validTokenMiddleware({}),
    validIdParamsMiddleware({ 
        optionalTwo:true
    }),
    removeProductCartController
)

cartRouter.delete("", 
    validTokenMiddleware({}),
    removeAllProductsInBagController
)
