import Brand from "../entities/brand.entity"
import Categories from "../entities/categories.entity"

export interface IAddPreferences {
    shoeSize: string
    clothingSize: string
    handBagSize: string
    category:  string 
    brand:  string 
    color: string
}

export interface IUpdatePreferences {
    shoeSize?: string
    clothingSize?: string
    handBagSize?: string
    category?:  string
    brand?:  string
    color?: string
}

export interface IUpdatePreferencesSend {
    shoeSize?: string
    clothingSize?: string
    handBagSize?: string
    color?: string
}