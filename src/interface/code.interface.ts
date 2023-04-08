import Users from "../entities/users.entity"

export interface ICode{
    user:Users
    type: "sms" | "email"
    route?: "update" | "create" | "retrieveAccount"
}

export interface IVerificationCode {
    user:Users
    verificationCode:string
    type: "sms" | "email"
    route?: "update" | "create" | "retrieveAccount"
}