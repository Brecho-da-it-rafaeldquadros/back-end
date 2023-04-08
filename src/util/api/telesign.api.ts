// @ts-ignore
import TeleSignSDK from "telesignsdk"
import "dotenv/config"

interface ISendSMS {
    phone:string
    code:string

}

interface ISucessStatus {
    code: number
    description:string
}

interface ISucess {
    reference_id: string
    external_id: number | null
    status: ISucessStatus
}

const SendSMS = async ( { phone, code }:ISendSMS ) => {
    
    const baseURL = "https://rest-api.telesign.com"
    const timeout = 10*1000

    const client = await new TeleSignSDK( 
        process.env.CUSTOMER_ID,
        process.env.TELESIGN_KEY,
        baseURL,
        timeout 
    )

    const messageType = "ARN"

    async function messageCallback(error:any, sucess:ISucess ) {
        console.log( sucess )
    }

    await client.sms.message(
        messageCallback, 
        phone, 
        `O seu código de verificação para Brecho da It é: ${code}`, 
        messageType
    )
}

export default SendSMS