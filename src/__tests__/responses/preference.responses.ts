import request from 'supertest';

export const responseSucessPreference = ( response:request.Response ) => {

    expect(response.body).toHaveProperty("message")

    expect(response.body.preference).toHaveProperty("isActive")
    expect(response.body.preference).toHaveProperty("shoeSize")
    expect(response.body.preference).toHaveProperty("clothingSize")
    expect(response.body.preference).toHaveProperty("handBagSize")
    expect(response.body.preference).toHaveProperty("color")
    expect(response.body.preference).toHaveProperty("category")
    expect(response.body.preference).toHaveProperty("brand")
    expect(response.body.preference.category).toHaveProperty("id")
    expect(response.body.preference.category).toHaveProperty("name")
    expect(response.body.preference.brand).toHaveProperty("id")
    expect(response.body.preference.brand).toHaveProperty("name")
}
