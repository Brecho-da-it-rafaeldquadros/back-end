import Update from "../entities/update.entity"
import Users from "../entities/users.entity"

export interface IQuery {
    code?:string
}

export type ITypeLog = "create_user" | "init_session" | "retrieve_account" | "confirm_code" | "solicitation_code" | "update_user" | "deactivate_user"

export interface IValidParams {
    optionalOne?:boolean
    optionalTwo?:boolean
}

export interface IPaginate {
    list:Array<any>,
    countPerPage?:number
    query:object
    filterException?:Array<string>
}

export interface INotSolicitationCodeErrorUpdate {
    userAlterAccount:Users 
    update:Update
    type:"email" | "sms"
}

export interface CreditCardExpiration {
    month: number;
    year: number;
}