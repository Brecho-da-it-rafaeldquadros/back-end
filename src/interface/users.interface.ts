import { FindOneOptions } from "typeorm"
import Users from "../entities/users.entity"

export interface IAuth {
    password:string
}

export interface IToken {
    id:string
    authorizationLevel:number
}

export interface ICreateUser {
    fullName:string
    email:string
    password:string
    isTermsAccepted: boolean
    phone:string
    authorizationLevel?:number
}

export interface IInitSessioneUser {
    email:string
    password:string
}

export interface IUpdateUser {
    fullName?:string
    email?:string
    password?:string
    phone?:string
    authorizationLevel?: number
    isActive?: boolean
}

export interface IRetrieveAccountUser {
    email:string
    newPassword:string
    code?:string
}

export interface IGetUserOrError {
    options:FindOneOptions<Users>
    error: "found" | "not found"
    message?: string
}

export interface IConfirmCode {
    code: string
}