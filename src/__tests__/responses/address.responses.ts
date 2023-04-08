import request from 'supertest';

export const responseSucessAddress = ( response:request.Response ) => {

    expect(response.body).toHaveProperty("message")

    expect(response.body.address).toHaveProperty("complement")
    expect(response.body.address).toHaveProperty("neighborhood")
    expect(response.body.address).toHaveProperty("uf")
    expect(response.body.address).toHaveProperty("city")
    expect(response.body.address).toHaveProperty("number")
    expect(response.body.address).toHaveProperty("street")
    expect(response.body.address).toHaveProperty("cep")
    expect(response.body.address).toHaveProperty("isCompanyAddress")
    expect(response.body.address).toHaveProperty("isDefault")
    expect(response.body.address).toHaveProperty("isSameTown")
    expect(response.body.address).toHaveProperty("id")
}