import { hashSync, compareSync } from "bcryptjs"
import AppError from "../../error/appError"
import { IAuth, IToken, IUpdateUser } from "../../interface/users.interface"
import { serializerUser } from "../../serializer/user.serializer"
import { generateDatePerMileseconds, getCurrentDateMileseconds } from "../../util/date.util"
import Repository from "../../util/repository.util"
import { verificationEqualPasswordInTokenOrError } from "../../util/verificationutil"

const updateUserService = async ( userId:string, auth:IAuth, data:IUpdateUser, token:IToken ) => {
        
    if( userId && token?.authorizationLevel !== 1 ){
        throw new AppError("Usuario pode alterar apenas sua propia conta", 401)
    }

    if( data?.email && token?.authorizationLevel !== 1 ){
        throw new AppError("Usuario deve ser administrador para atualizar o email", 403)
    }

    await verificationEqualPasswordInTokenOrError( auth.password, token )

    const alterUserId = userId ? userId : token?.id

    const hasUser = await Repository.users.findOne({where:{ id:alterUserId }, relations:{ myAccountUpdate:{ solicitationUser:true } }})

    if( !hasUser ){
        throw new AppError("Usuario não encontrado", 404)
    }

    if( data?.email ){
        const hasUserEmail = await Repository.users.findOneBy({ email:data?.email })

        if( hasUser.email === data.email ){
            throw new AppError("Email já está cadastrado na conta")
        }

        if( hasUserEmail && hasUserEmail.id !== hasUser.id ){
            throw new AppError("Email indisponível")
        }
    }

    const currentDateMileseconds = getCurrentDateMileseconds()
    const validDateMileseconds = generateDatePerMileseconds( currentDateMileseconds + 86400000 )

    if(hasUser?.myAccountUpdate ){
        await Repository.update.delete( hasUser?.myAccountUpdate.id )
    }

    let UpdateImmediateList:any[] = []
    let UpdateIsRequiredConfirmList:any[] = []

    Object.entries( data ).forEach( (property) => {

        const [key] = property

        if( key === "password" ){
            property[1] = hashSync( property[1], 10 )
            UpdateIsRequiredConfirmList.push( property )
        }
        if( key === "phone" ){
            property[1] = "55" + property[1] 
            UpdateIsRequiredConfirmList.push( property )
        }
        if(  key === "email" ){
            UpdateIsRequiredConfirmList.push( property )
        }
        if( key !== "email" && key !== "phone" && key !== "password" ){
            UpdateImmediateList.push( property )
        }
    })

    if( UpdateImmediateList.length > 0 ){
        await Repository.users.update(alterUserId, Object.fromEntries( UpdateImmediateList ))

        const user = await Repository.users.findOneBy({ id:alterUserId })

        await Repository.users.update( hasUser?.id, {  lastUserIdUpdated:token?.id })

        const update = await Repository.update.findOne({ where:{ alterUser:{ id:alterUserId }}, relations:{ alterUser:true } })

        if( update ){
            await Repository.update.delete( update.id )
        }

        if( UpdateIsRequiredConfirmList.length === 0 ){

            const serializer = await serializerUser.validate(user, { stripUnknown:true })

            return {
                message:"Usuario atualizado",
                user:serializer
            }
        }
    }

    const userSolicitation = await Repository.users.findOneBy({ id:token?.id })

    const confirmCode =  { isConfirmedPhone:false }

    const dataUpdateAwait = {
        json:JSON.stringify( Object.fromEntries( UpdateIsRequiredConfirmList ) ),
        ...confirmCode,
        validAt:validDateMileseconds,
        alterUser:hasUser,
        solicitationUser: userSolicitation
    }

    const updateWaitCreate = Repository.update.create( dataUpdateAwait )
    await Repository.update.save( updateWaitCreate )

    const user = await Repository.users.findOneBy({ id:alterUserId })

    const serializer = await serializerUser.validate(user, { stripUnknown:true })

    await Repository.users.update( serializer.id, { isSolicitationCode:true })

    return {
        message:`${ UpdateImmediateList.length > 0 ? "Alguns dados foram atualizados, e outros estão aguardando código de solicição e confirmação" : UpdateIsRequiredConfirmList.length > 0 ? "Aguardando confirmação SMS" : "Usuario atualizado"}`,
        user:serializer
    }
}

export default updateUserService