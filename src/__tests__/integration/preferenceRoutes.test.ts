import request from 'supertest';

import { DataSource } from 'typeorm';
import AppDataSource from '../../data-source';

import app from '../../app';
import { initializationUserDefault } from '../../util/initialization.util';
import Repository from '../../util/repository.util';

import "dotenv/config"
import { mockedSessionLevelOneDefault, mockedSessionLevelTreeFirst } from '../mocks/user.mocks';
import { mockedCreateBrandFirst, mockedCreateBrandSecond, mockedCreateCategoryFirst, mockedCreateCategorySecond, mockedCreatePreference, mockedCreatePreferenceInvalidBrand, mockedCreatePreferenceInvalidCategory, mockedUpdatePreference } from '../mocks/preference.mocks';
import { responseSucessUser } from '../responses/user.responses';
import { responseSucessPreference } from '../responses/preference.responses';

describe('/user', () => {
    let connection: DataSource;

    let tokenLevelOneFirst: string;
    let tokenLevelThreeFirst: string;
    
    let idLevelOneFirst: string;
    let idLevelThreeFirst: string;

    let categoryNameFirst: string
    let categoryNameSecond: string
    let brandNameFirst: string
    let brandNameSecond: string

    beforeAll(async () => {
        await AppDataSource.initialize()
        .then((res) => {
            connection = res;
        })
        .catch((err) => {
            console.error('Error during Data Source initialization', err);
        })

        const idLevelOne = await initializationUserDefault()
        idLevelOneFirst = idLevelOne

        const user = {
            fullName: "teste",
            email: "CreateLevelTreeFirst@email.com",
            authorizationLevel: 3,
            password: "123",
            phone: "55" + "00988888888",
            isConfirmedEmail:true,
            isConfirmedPhone:true,
            isActive:true,
            isSolicitationCode:false
        }
      
        const createdDefaultUser = Repository.users.create(user)
        await Repository.users.save(createdDefaultUser)

        idLevelThreeFirst = createdDefaultUser.id

        const sessionADM = await request(app).post("/session").send(mockedSessionLevelOneDefault)

        expect(sessionADM.status).toBe(200)
        tokenLevelOneFirst = sessionADM.body.token

        const sessionNORMAL = await request(app).post("/session").send(mockedSessionLevelTreeFirst)

        expect(sessionNORMAL.status).toBe(200)
        tokenLevelThreeFirst = sessionNORMAL.body.token

        const categoryFirst = await request(app).post("/categories").send(mockedCreateCategoryFirst).set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(categoryFirst.status).toBe(201)
        categoryNameFirst = categoryFirst.body.category.name

        const categorySecond = await request(app).post("/categories").send(mockedCreateCategorySecond).set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(categorySecond.status).toBe(201)
        categoryNameSecond = categorySecond.body.category.name

        const brandFirst = await request(app).post("/brands").send(mockedCreateBrandFirst).set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(brandFirst.status).toBe(201)
        brandNameFirst = brandFirst.body.brand.name

        const brandSecond = await request(app).post("/brands").send(mockedCreateBrandSecond).set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(brandSecond.status).toBe(201)
        brandNameSecond = brandSecond.body.brand.name
    })

    afterAll(async () => {
        await connection.destroy();
    });

    test('POST /preference - CREATE PREFERENCE - Não deve ser possivel adicionar uma preferencia sem um TOKEN ERROR 401', async () => {
        const preference = await request(app).post("/preference").send()

        expect(preference.status).toBe(401);
        expect(preference.body).toHaveProperty("message");
    })

    test('POST /preference - CREATE PREFERENCE - Não deve ser possivel adicionar um preferencia com um TOKEN inválido ERROR 401', async () => {
        const preference = await request(app).post("/preference").send().set("Authorization", `Bearer ${13123}`)

        expect(preference.status).toBe(401);
        expect(preference.body).toHaveProperty("message");
    })

    test('POST /preference - CREATE PREFERENCE - Não deve ser possivel adicionar um preferencia sem enviar nada ERROR 400', async () => {
        const preference = await request(app).post("/preference").send({}).set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(preference.status).toBe(400);
        expect(preference.body).toHaveProperty("message");
    })

    test('POST /preference - CREATE PREFERENCE - Não deve ser possivel adicionar um preferencia caso a categoria não exista ERROR 400', async () => {
        const preference = await request(app).post("/preference").send(mockedCreatePreferenceInvalidCategory).set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(preference.status).toBe(400);
        expect(preference.body).toHaveProperty("message");
    })

    test('POST /preference - CREATE PREFERENCE - Não deve ser possivel adicionar um preferencia caso a marca não exista ERROR 400', async () => {
        const preference = await request(app).post("/preference").send(mockedCreatePreferenceInvalidBrand).set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(preference.status).toBe(400);
        expect(preference.body).toHaveProperty("message");
    })

    test('POST /preference - CREATE PREFERENCE - Deve ser possivel adicionar um preferencia como LEVEL 1 SUCESS 200', async () => {
        const preference = await request(app).post("/preference").send(mockedCreatePreference).set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(preference.status).toBe(200);
        expect(preference.body).toHaveProperty("message");
    })

    test('POST /preference - CREATE PREFERENCE - Deve ser possivel adicionar um preferencia como Level 3 SUCESS 200', async () => {
        const preference = await request(app).post("/preference").send(mockedCreatePreference).set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(preference.status).toBe(200);
        expect(preference.body).toHaveProperty("message");
    })

    test('POST /preference - CREATE PREFERENCE - Não deve ser possivel adicionar um preferencia se já tiver sido adicionada ERROR 400', async () => {
        const preference = await request(app).post("/preference").send(mockedCreatePreference).set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(preference.status).toBe(400);
        expect(preference.body).toHaveProperty("message");
    })



    test('GET /preference - LIST PREFERENCE - Não deve ser possivel listar uma preferencia sem um TOKEN ERROR 401', async () => {
        const preference = await request(app).get("/preference").send()

        expect(preference.status).toBe(401);
        expect(preference.body).toHaveProperty("message");
    })

    test('GET /preference - LIST PREFERENCE - Não deve ser possivel listar um preferencia com um TOKEN inválido ERROR 401', async () => {
        const preference = await request(app).get("/preference").send().set("Authorization", `Bearer ${13123}`)

        expect(preference.status).toBe(401);
        expect(preference.body).toHaveProperty("message");
    })

    test('GET /preference - LIST PREFERENCE - Não deve ser possivel listar a preferencia de outro usuario sem ser LEVEL 1 ERROR 401', async () => {
        const preference = await request(app).get(`/preference/user/${idLevelOneFirst}`).send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(preference.status).toBe(401);
        expect(preference.body).toHaveProperty("message");
    })

    test('GET /preference - LIST PREFERENCE - Não deve ser possivel listar a preferencia de outro usuario com id inválido ERROR 404', async () => {
        const preference = await request(app).get(`/preference/user/${213123}`).send().set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(preference.status).toBe(400);
        expect(preference.body).toHaveProperty("message");
    })

    test('GET /preference - LIST PREFERENCE - Deve ser possivel listar sua propia preferencia SUCESS 200', async () => {
        const preference = await request(app).get("/preference").send().set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(preference.status).toBe(200);
        expect(preference.body).toHaveProperty("message");
    })

    test('GET /preference - LIST PREFERENCE - LEVEL 1 - Deve ser possivel listar a preferencia de outro usuario SUCESS 200', async () => {
        const preference = await request(app).get(`/preference/user/${idLevelThreeFirst}`).send().set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(preference.status).toBe(200);
        expect(preference.body).toHaveProperty("message");
    })



    test('PATCH /preference - UPDATE PREFERENCE - Não deve ser possivel atualizar uma preferencia sem um TOKEN ERROR 401', async () => {
        const preference = await request(app).patch("/preference").send()

        expect(preference.status).toBe(401);
        expect(preference.body).toHaveProperty("message");
    })

    test('PATCH /preference - UPDATE PREFERENCE - Não deve ser possivel atualizar um preferencia com um TOKEN inválido ERROR 401', async () => {
        const preference = await request(app).patch("/preference").send().set("Authorization", `Bearer ${32234}`)

        expect(preference.status).toBe(401);
        expect(preference.body).toHaveProperty("message");
    })

    test('PATCH /preference - UPDATE PREFERENCE - Não deve ser possivel atualizar um preferencia sem enviar nada ERROR 401', async () => {
        const preference = await request(app).patch("/preference").send({}).set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(preference.status).toBe(400);
        expect(preference.body).toHaveProperty("message");
    })

    test('PATCH /preference - UPDATE PREFERENCE - Deve ser possivel atualizar uma preferencia SUCESS 200', async () => {
        const preference = await request(app).patch("/preference").send(mockedUpdatePreference).set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(preference.status).toBe(200);
        expect(preference.body).toHaveProperty("message");
        responseSucessPreference( preference )

        expect(preference.body.preference.isActive).toEqual(true)
        expect(preference.body.preference.shoeSize).toEqual("42")
        expect(preference.body.preference.clothingSize).toEqual("M")
        expect(preference.body.preference.handBagSize).toEqual("45")
        expect(preference.body.preference.color).toEqual("preto")
        expect(preference.body.preference.category.name).toEqual("Calçado")
        expect(preference.body.preference.brand.name).toEqual("anjus")
    })




    test('DELETE /preference - DELETE PREFERENCE - Não deve ser possivel deletar uma preferencia sem um TOKEN ERROR 401', async () => {
        const preference = await request(app).delete("/preference").send()

        expect(preference.status).toBe(401);
        expect(preference.body).toHaveProperty("message");
    })

    test('DELETE /preference - DELETE PREFERENCE - Não deve ser possivel deletar um preferencia com um TOKEN inválido ERROR 401', async () => {
        const preference = await request(app).delete("/preference").send().set("Authorization", `Bearer ${32234}`)

        expect(preference.status).toBe(401);
        expect(preference.body).toHaveProperty("message");
    })

    test('DELETE /preference - DELETE PREFERENCE - Deve ser possivel remover a preferencia SUCESS 200', async () => {
        const preference = await request(app).delete("/preference").send().set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(preference.status).toBe(200);
        expect(preference.body).toHaveProperty("message");
    })

    test('DELETE /preference - UPDATE PREFERENCE - Não deve ser possivel deletar uma preferencia que não existe ERROR 404', async () => {
        const preference = await request(app).delete("/preference").send().set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(preference.status).toBe(404);
        expect(preference.body).toHaveProperty("message");
    })

    test('GET /preference - LIST PREFERENCE - Não deve ser possivel listar a preferencia caso ela não exista ERROR 404', async () => {
        const preference = await request(app).get("/preference").send().set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(preference.status).toBe(404);
        expect(preference.body).toHaveProperty("message");
    })

    test('PATCH /preference - UPDATE PREFERENCE - Não deve ser possivel atualizar um preferencia que não existe ERROR 404', async () => {
        const preference = await request(app).patch("/preference").send(mockedUpdatePreference).set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(preference.status).toBe(404);
        expect(preference.body).toHaveProperty("message");
    })
})