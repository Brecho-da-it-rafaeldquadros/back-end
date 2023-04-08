import { Router } from "express"
import initSessionUserController from "../controller/session/initSessionUser.controller"
import confirmCodeUserController from "../controller/users/confirmCodeUser.controller"
import createUserController from "../controller/users/createUser.controller"
import deactivateUserController from "../controller/users/deactivateUser.controller"
import listUserOrUsersController from "../controller/users/listUserOrUsers.controller"
import retrieveAccountUserController from "../controller/users/retrieveAccountUser.controller"
import solicitationCodeUserController from "../controller/users/solicitationCodeUser.controller"
import updateUserController from "../controller/users/updateUserController.controller"
import createLogMiddleware from "../middlewares/createLog.middleware"
import limitRequestsInRowMiddleware from "../middlewares/limitRequestsInRow.middleware"
import validQueryPaginationMiddleware from "../middlewares/pagination.middleware"
import validDataMiddleware from "../middlewares/validData.middleware"
import validIdParamsMiddleware from "../middlewares/validIdParms.middleware"
import validTokenMiddleware from "../middlewares/validToken.middleware"
import { confirmCodeUser, schemaAuth, schemaCreateUserLevelAll, schemaCreateUserLevelOne, schemaInitSessionUser, schemaRetrieveAccountUser, schemaUpdateUserLevelAll, schemaUpdateUserLevelOne } from "../serializer/user.serializer"

export const sessionRouter = Router()

sessionRouter.post("",
    limitRequestsInRowMiddleware({ 
        type:"init_session",
        limitRequestLevelAll:12390,
        milesecondsLevelAll:86400000,
        limitRequestLevelOne:200,
        milesecondsLevelOne:60000
    }),
    createLogMiddleware({
        type:"init_session"
    }),
    validDataMiddleware({
        serializerLevelAll:schemaInitSessionUser
    }),
    initSessionUserController
)

export const usersRouter = Router()

usersRouter.post("/retrieveAccount",
    validIdParamsMiddleware({ 
        optionalOne:true,
        optionalTwo:true
    }),
    limitRequestsInRowMiddleware({ 
        type:"retrieve_account",
        limitRequestLevelAll:209090,
        milesecondsLevelAll:86400000
    }),
    createLogMiddleware({
        type:"retrieve_account"
    }),
    validDataMiddleware({
        serializerLevelAll:schemaRetrieveAccountUser
    }),
    retrieveAccountUserController
)

usersRouter.post("",
    validTokenMiddleware({ 
        optional:true
    }),
    limitRequestsInRowMiddleware({ 
        type:"create_user",
        limitRequestLevelAll:590909,
        milesecondsLevelAll:86400000
    }),
    createLogMiddleware({
        type:"create_user"
    }),
    validDataMiddleware({
        serializerLevelAll:schemaCreateUserLevelAll,
        serializerLevelOne:schemaCreateUserLevelOne
    }),
    createUserController
)

usersRouter.post("/:id/confirm/code(=email)?(=sms)?(/update)?(/create)?(/retrieveAccount)?",
    validIdParamsMiddleware({
        optionalTwo:true
    }),
    limitRequestsInRowMiddleware({ 
        type:"confirm_code",
        limitRequestLevelAll:123909,
        milesecondsLevelAll:86400000
    }),
    createLogMiddleware({
        type:"confirm_code"
    }),
    validDataMiddleware({
        serializerLevelAll:confirmCodeUser
    }),
    confirmCodeUserController
)

usersRouter.get("/:id/solicitation/code(=email)?(=sms)?(/update)?(/create)?(/retrieveAccount)?",
    validIdParamsMiddleware({
        optionalTwo:true
    }),    
    limitRequestsInRowMiddleware({ 
        type:"solicitation_code",
        limitRequestLevelAll:123123123123232323,
        milesecondsLevelAll:86400000323232
    }),
    createLogMiddleware({
        type:"solicitation_code"
    }),
    solicitationCodeUserController
)

usersRouter.get("(/all)?/:id?",
    validTokenMiddleware({}),
    validIdParamsMiddleware({ 
        optionalOne:true,
        optionalTwo:true
    }),
    validQueryPaginationMiddleware,
    listUserOrUsersController
)   

usersRouter.patch("/:id?",
    validTokenMiddleware({}),
    validIdParamsMiddleware({ 
        optionalOne:true,
        optionalTwo:true
    }),
    limitRequestsInRowMiddleware({ 
        type:"update_user",
        limitRequestLevelAll:39090,
        milesecondsLevelAll: 86400000,
        limitRequestLevelOne:200,
        milesecondsLevelOne: 60000
    }),
    createLogMiddleware({
        type:"update_user"
    }),
    validDataMiddleware({
        serializerLevelAll:schemaUpdateUserLevelAll,
        serializerLevelOne:schemaUpdateUserLevelOne
    }),
    updateUserController
)

usersRouter.post("/deactivate/:id?",
    validTokenMiddleware({}),
    validIdParamsMiddleware({ 
        optionalOne:true,
        optionalTwo:true
    }),
    limitRequestsInRowMiddleware({ 
        type:"deactivate_user",
        limitRequestLevelAll:29090,
        milesecondsLevelAll:86400000
    }),
    createLogMiddleware({
        type:"deactivate_user"
    }),
    validDataMiddleware({
        serializerLevelAll:schemaAuth
    }),
    deactivateUserController
)