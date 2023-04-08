import request from 'supertest';

export const responseSucessDataBankCard = ( response:request.Response ) => {

    expect(response.body).toHaveProperty("message")

    expect(response.body.bank).toHaveProperty("id")
    expect(response.body.bank).toHaveProperty("cpf")
    expect(response.body.bank).toHaveProperty("accountNumber")
    expect(response.body.bank).toHaveProperty("agency")
    expect(response.body.bank).not.toHaveProperty("pix")
}

export const responseSucessDataBankPix = ( response:request.Response ) => {

    expect(response.body).toHaveProperty("message")

    expect(response.body.bank).toHaveProperty("id")
    expect(response.body.bank).toHaveProperty("pix")
}

export const responseSucessDataBankComplete = ( response:request.Response ) => {

    expect(response.body).toHaveProperty("message")

    expect(response.body.bank).toHaveProperty("id")
    expect(response.body.bank).toHaveProperty("cpf")
    expect(response.body.bank).toHaveProperty("accountNumber")
    expect(response.body.bank).toHaveProperty("agency")
    expect(response.body.bank).toHaveProperty("pix")
}