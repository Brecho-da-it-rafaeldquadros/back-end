import Users from "../entities/users.entity"

export interface IDataAddress {
    name:string
    cep:string
    city:string
    uf:string
    street:string
    complement: string
    neighborhood:string
    isCompanyAddress: boolean
    number:number
    isSameTown:boolean
    isDefault:boolean
    user:Users
}