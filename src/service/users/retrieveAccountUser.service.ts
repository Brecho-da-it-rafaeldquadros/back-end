import { hashSync } from "bcryptjs"
import AppError from "../../error/appError"
import { IRetrieveAccountUser } from "../../interface/users.interface"
import { generateDatePerMileseconds, getCurrentDateMileseconds } from "../../util/date.util"
import Repository from "../../util/repository.util"

const retrieveAccountUserService = async ( data:IRetrieveAccountUser ) => {

    const hasUser = await Repository.users.findOne({where:{ email:data.email }, relations:{ myAccountUpdate:true }})

    if( !hasUser ){
        throw new AppError("Usuario não encontrado", 404)
    }

    const currentDateMileseconds = getCurrentDateMileseconds()
    const validDateMileseconds = generateDatePerMileseconds( currentDateMileseconds + 86400000 )
    
    const dataUpdateAwait = {
        json:JSON.stringify( { password: hashSync(data.newPassword , 10) } ),
        isConfirmedPhone:false,
        validAt:validDateMileseconds,
        alterUser:hasUser,
        solicitationUser: hasUser
    }

    if(hasUser?.myAccountUpdate ){
        await Repository.update.delete( hasUser?.myAccountUpdate.id )
    }

    const updateWaitCreate = Repository.update.create( dataUpdateAwait )
    await Repository.update.save( updateWaitCreate )

    await Repository.users.update( hasUser.id, { isSolicitationCode:true } )

    return {
        message:"Recuperação solicitada, aguardando solicitação e confirmação de SMS",
        user:{
            id:hasUser.id
        }
    }
}

export default retrieveAccountUserService