import AppError from "../../error/appError"
import { IAddPreferences } from "../../interface/preferences.interface"
import { IToken } from "../../interface/users.interface"
import Repository from "../../util/repository.util"

const addPreferencesService = async ( data:IAddPreferences, token:IToken ) => {
    
    const user = await Repository.users.findOne({where:{ id:token.id }, relations:{ preference:true }})
    
    if( user?.preference ){
        throw new AppError("Já foi adicionado as preferências")
    }

    const hasCategory = await Repository.categories.findOneBy({ name:data.category })
    const categories = (await Repository.categories.find()).map( category => category.name )
    const hasCategoriesSize = categories?.length > 0
    const idLevelOneUser = token.authorizationLevel === 1

    if( !hasCategory ){
        throw new AppError(hasCategoriesSize ? `As categorias devem ser alguma das seguintes: ${categories.join(", ")}.` : idLevelOneUser ? "Deve criar uma categoria antes" : "Deve solicitar para um administrador a inserção de categorias")
    }

    const hasBrands = await Repository.brand.findOneBy({ name:data.brand })
    const brands = (await Repository.brand.find()).map( brancd => brancd.name )
    const hasBrandsSize = brands?.length > 0

    if( !hasBrands ){
        throw new AppError(hasBrandsSize ? `As marcas devem ser alguma das seguintes: ${brands.join(", ")}.` : idLevelOneUser ? "Deve criar uma categoria antes" : "Deve solicitar para um administrador a inserção de categorias")
    }

    const { category, brand ,...newData } = data

    const preferenceCreated = Repository.preferences.create({ ...newData, category:hasCategory, brand:hasBrands, user })
    await Repository.preferences.save( preferenceCreated )

    const { user:x, ...resPreference } = preferenceCreated

    return {
        message:"Preferência adicionada",
        preference:resPreference
    }
}

export default addPreferencesService