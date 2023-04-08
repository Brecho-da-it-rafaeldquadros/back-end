import AppError from "../../error/appError"
import { IUpdatePreferences, IUpdatePreferencesSend } from "../../interface/preferences.interface"
import { IToken } from "../../interface/users.interface"
import Repository from "../../util/repository.util"

const updatePreferencesService = async ( data:IUpdatePreferences, token:IToken ) => {

    const requiredData = Object.entries( data )

    if( requiredData.length === 0){
        throw new AppError("Deve enviar algo para atualizar")
    }

    const user = await Repository.users.findOne({where:{ id:token.id }, relations:{ preference:true }})
    
    if( !user?.preference ){
        throw new AppError("Preferências não encontradas", 404)
    }

    const hasCategory = data?.category ? await Repository.categories.findOneBy({ name:data?.category }) : false
    const categories = (await Repository.categories.find()).map( category => category.name )

    if( data?.category && !hasCategory ){
        throw new AppError(`As categorias devem ser alguma das seguintes: ${categories.join(", ")}.`)
    }

    if( data?.category && hasCategory ){
        await Repository.preferences.update( user.preference.id,{ category:hasCategory }  )
    }

    const hasBrand = data?.brand ? await Repository.brand.findOneBy({ name:data?.brand }) : false
    const brands = (await Repository.brand.find()).map( category => category.name )

    if( data?.brand && !hasBrand ){
        throw new AppError(`As marcas devem ser alguma das seguintes: ${brands.join(", ")}.`)
    }

    if( data?.brand && hasBrand ){

        await Repository.preferences.update( user.preference.id,{ brand:hasBrand }  )
    }

    const { category, brand,...newData } = data
    data = newData

    if( Object.entries( data ).length > 0 ){
        await Repository.preferences.update( user.preference.id, data as IUpdatePreferencesSend)
    }

    const preferenceUpdated = await Repository.preferences.findOne({where:{ id:user.preference.id }, relations:{ category:true, brand:true }})

    const { user:x, ...resPreference } = preferenceUpdated

    return {
        message:"Preferência atualizada",
        preference:resPreference
    }
}

export default updatePreferencesService