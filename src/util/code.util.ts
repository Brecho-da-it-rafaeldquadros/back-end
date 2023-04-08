import AppError from "../error/appError";
import { ICode, IVerificationCode } from "../interface/code.interface";
import sendEmailHangle from "./api/sendGrid";
import sendSMS from "./api/telesign.api";
import { generateDatePerMileseconds, getCurrentDateMileseconds, transformDateInMileseconds } from "./date.util";
import { notSolicitationCodeErrorCreate, notSolicitationCodeErrorUpdate } from "./error.util";
import Repository from "./repository.util";

import "dotenv/config"

export const generateRandomCode = (): string => {
    
    let code = ""

    const possibleValues = "0123456789";

    for (let i = 0; i < 6; i++) {
      code += possibleValues.charAt(Math.floor(Math.random() * possibleValues.length));
    }

    return code
}

const alterInUserSolicitationCode = async ( { user, type, route }:ICode ):Promise<void> => {

    if( route === "create" ){
        await Repository.users.update( user.id, type === "email" ? { isConfirmedEmail:false, isSolicitationCode:true } : { isConfirmedPhone:false, isSolicitationCode:true  })
    }else{
        await Repository.users.update( user.id, { isSolicitationCode:true } )
    }
}

export const createAndSendCode = async ( { user, type, route }:ICode ) => {

    if( user?.code ){
        await Repository.code.delete( user.code.id )
    }

    const currentAtMilesecond = getCurrentDateMileseconds()
    const validAt = generateDatePerMileseconds(currentAtMilesecond + 300000)
    const newCode = generateRandomCode()

    const code = type === "email" ? { codeEmail:newCode } : { codeSMS:newCode }

    await alterInUserSolicitationCode({ user, type, route })

    const codeInCreate = { ...code,  validAt:validAt, user } 

    const createdCode = Repository.code.create(codeInCreate)
    await Repository.code.save( createdCode )

    const newEmail = (JSON.parse( user?.myAccountUpdate?.json ? user?.myAccountUpdate?.json : "{}" ))?.email
    const newPhone = (JSON.parse( user?.myAccountUpdate?.json ? user?.myAccountUpdate?.json : "{}" ))?.phone
    
    if( process.env.NODE_ENV !== "test" ){

        if( type === "email" ){
            const email = await sendEmailHangle({
                template: "sendCode",
                context:{ code:newCode },
                to: route === "update" && newEmail ? newEmail : user.email
            })
    
            if( email.status === 500){
                throw new AppError(email.message, 500)
            }
        }else{
            await sendSMS({ phone: route !== "create" && newPhone ? newPhone : user.phone, code:newCode })
        } 
    }    
}

export const validationAndSendCode = async ( { user, type, route }:ICode ):Promise<void> => {

    if( !user.isSolicitationCode ){
        throw new AppError("Código não solicitado")
    }

    const code = user?.code
    const currentAtMilesecond = getCurrentDateMileseconds()
    
    if( !code ){
        await createAndSendCode({ user, type, route })
        return
    }
    
    const isOtherMethodCode = code.codeSMS && type !== "sms" || code.codeEmail && type !== "email"

    if( isOtherMethodCode ){
        await createAndSendCode({ user, type, route })

        return
    }   

    try {
        if( route === "create" ){
            notSolicitationCodeErrorCreate({ user, type, route })
        }else{
            notSolicitationCodeErrorUpdate({ user, type, route })
        }
    } catch (error:any) {
        throw new AppError(error.message, 404)
    }

    const validCode = transformDateInMileseconds(code?.validAt) 
    const isValidCode = currentAtMilesecond < validCode

    if( !isValidCode ){
        await createAndSendCode({ user, type, route })
        
        throw new AppError("Código expirado, novo código enviado")
    }else{

        if( process.env.NODE_ENV !== "test" ){
            const resendCode = code.codeEmail ? code.codeEmail : code.codeSMS

            if( type === "email" ){
                const newEmail = (JSON.parse( user?.myAccountUpdate?.json ? user?.myAccountUpdate?.json : "{}" ))?.email

                const email = await sendEmailHangle({
                    template: "sendCode",
                    context:{ code:resendCode },
                    to: route === "update" && newEmail ? newEmail : user.email
                })

                if( email.status === 500){
                    throw new AppError(email.message, 500)
                }
            }else{
                const newPhone = (JSON.parse( user?.myAccountUpdate?.json ? user?.myAccountUpdate?.json : "{}" ))?.phone

                await sendSMS({ phone: route !== "create" && newPhone ? newPhone : user.phone , code:resendCode })
            }   
        }

        return 
    }
}


export const verificationCode = async ( { user, verificationCode, type, route }:IVerificationCode )=> {

    const tableCode = user?.code
    
    if( !tableCode ){
        throw new AppError("Deve solicitar o código de confirmação", 404)
    }

    try {
        if( route === "create" ){
            notSolicitationCodeErrorCreate({ user, type, route })
        }else{
            notSolicitationCodeErrorUpdate({ user, type, route })
        }
    } catch (error:any) {
        throw new AppError(error.message, 404)
    }

    const id = tableCode.id
    const code = type === "email" ? tableCode.codeEmail : tableCode.codeSMS

    const currentAtMilesecond = getCurrentDateMileseconds()
    const validCode = transformDateInMileseconds(tableCode?.validAt) 
    const isValidCode = currentAtMilesecond < validCode

    if( !isValidCode ){
        throw new AppError("Código expirado, deve solicitar um novo código")
    }

    const equalCode = verificationCode === code

    if( !equalCode ){
        throw new AppError("Código inválido")
    }
    
    if( route === "create" ){
        await Repository.users.update( user.id, type === "email" ? { isConfirmedEmail:true } : { isConfirmedPhone:true })

        const userVerification = await Repository.users.findOneBy({ id:user.id })    

        const { isConfirmedEmail, isConfirmedPhone } = userVerification

        if( isConfirmedEmail && isConfirmedPhone ){
            await Repository.users.update( user.id, { isSolicitationCode:false, isActive:true })
        }
    }else{
        await Repository.update.update( user.myAccountUpdate.id, type === "email" ? { isConfirmedEmail:true } : { isConfirmedPhone:true } )

        const update = await Repository.update.findOneBy({ id:user.myAccountUpdate.id })

        const isSucessEmail = update.isConfirmedEmail == null || update.isConfirmedEmail
        const isSucessPhone = update.isConfirmedPhone == null || update.isConfirmedPhone

        const data = JSON.parse( user.myAccountUpdate.json )

        if( isSucessEmail && isSucessPhone ){
            await Repository.users.update( user.id, { isSolicitationCode:false, isActive:true, ...data})

            await Repository.update.delete(user.myAccountUpdate.id)
        }
    }

    await Repository.code.delete( id )
}