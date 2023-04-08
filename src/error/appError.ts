export default class AppError extends Error {
    status
    constructor( message:string, status:number = 400 ){
        super()
        this.message = message
        this.status = status
    }
}