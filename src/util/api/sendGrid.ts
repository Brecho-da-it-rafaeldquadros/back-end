import sgMail from "@sendgrid/mail"

import "dotenv/config"

interface IEmailRequest {
  to: string
  template: string
  context?: object
}

const sendEmailHangle = async ({ template, to, context }: IEmailRequest) => {

  const key = process.env.SENDGRID_API_KEY

  sgMail.setApiKey(key)

  const msg = {
    to: to, 
    from: process.env.SMTP_USER,
    subject: 'Código de confirmação Brecho da It',
    // @ts-ignore
    text: `O seu código de verificação para Brecho da It é: ${context?.code}`,
    // @ts-ignore
    html: `<strong>O seu código de verificação para Brecho da It é: ${context?.code}</strong>`,
  }
  
  try{

    const sucess = await sgMail
    .send(msg)

    console.log( sucess ) 

      return {
        status:200,
        message:""
    }
  } catch (error) {
      return {
          status:500,
          message:error
      }
  }
}

export default sendEmailHangle