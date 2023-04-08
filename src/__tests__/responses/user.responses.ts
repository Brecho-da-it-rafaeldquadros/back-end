import request from 'supertest';

export const responseSucessUser = ( response:request.Response, way:string ) => {

    expect(response.body).toHaveProperty("message")

    expect(response.body[way]).toHaveProperty("updatedAt")
    expect(response.body[way]).toHaveProperty("createdAt")
    expect(response.body[way]).toHaveProperty("authorizationLevel")
    expect(response.body[way]).toHaveProperty("phone")
    expect(response.body[way]).toHaveProperty("email")
    expect(response.body[way]).toHaveProperty("fullName")
    expect(response.body[way]).toHaveProperty("id")
}