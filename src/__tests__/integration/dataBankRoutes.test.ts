import request from 'supertest';

import { DataSource } from 'typeorm';
import AppDataSource from '../../data-source';

import app from '../../app';
import { initializationUserDefault } from '../../util/initialization.util';
import Repository from '../../util/repository.util';

import "dotenv/config"
import { mockedSessionLevelOneDefault, mockedSessionLevelTreeFirst } from '../mocks/user.mocks';
import { mockedCreateDataBankCardSUCESS, mockedCreateDataBankInvalidCardERROR, mockedCreateDataBankPixSUCESS, mockedUpdateCreateDataBankCardERROR, mockedUpdateCreateDataBankCardSUCESS, mockedUpdateDataBankSUCESS } from '../mocks/dataBank.mocks';
import { responseSucessDataBankCard, responseSucessDataBankComplete } from '../responses/dataBank.responses';

describe('/bankData', () => {
    let connection: DataSource;

    let tokenLevelOneFirst: string;
    let tokenLevelThreeFirst: string;
    
    let idLevelOneFirst: string;
    let idLevelThreeFirst: string;

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
    })

    afterAll(async () => {
        await connection.destroy();
    });

    test('POST /bankData - CREATE DATA BANK - Não deve ser possivel inserir dados bancarios sem o TOKEN ERROR 401', async () => {
        const address = await request(app).post("/bankData").send(mockedCreateDataBankCardSUCESS)

        expect(address.status).toBe(401);
        expect(address.body).toHaveProperty("message");
    })

    test('POST /bankData - CREATE DATA BANK - Não deve ser possivel inserir dados com TOKEN inválido ERROR 401', async () => {
        const address = await request(app).post("/bankData").send(mockedCreateDataBankCardSUCESS).set("Authorization", `Bearer ${324324}`)

        expect(address.status).toBe(401);
        expect(address.body).toHaveProperty("message");
    })

    test('POST /bankData - CREATE DATA BANK - Não deve ser possivel inserir dados do cartão sem inserir "CPF", "AGÊNCIA", "NUMERO DO CARTÃO" ERROR 400', async () => {
        const address = await request(app).post("/bankData").send(mockedCreateDataBankInvalidCardERROR).set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(address.status).toBe(400);
        expect(address.body).toHaveProperty("message");
    })

    test('POST /bankData - CREATE DATA BANK - Deve ser possivel inserir dados do cartão SUCESS 200', async () => {
        const address = await request(app).post("/bankData").send(mockedCreateDataBankCardSUCESS).set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(address.status).toBe(200);
        responseSucessDataBankComplete( address )
    })




    test('GET /bankData - LISTAR DATA BANK - Não deve ser possivel listar dados bancarios sem o TOKEN ERROR 401', async () => {
        const address = await request(app).get("/bankData/user").send()

        expect(address.status).toBe(401);
        expect(address.body).toHaveProperty("message");
    })

    test('GET /bankData - LISTAR DATA BANK - Não deve ser possivel listar dados com TOKEN inválido ERROR 401', async () => {
        const address = await request(app).get("/bankData/user").send().set("Authorization", `Bearer ${12312}`)

        expect(address.status).toBe(401);
        expect(address.body).toHaveProperty("message");
    })

    test('GET /bankData - LISTAR DATA BANK - Não deve ser possivel um usuario de autorização 3 listar dados bancarios de outro usuario ERROR 401', async () => {
        const address = await request(app).get(`/bankData/user/${idLevelOneFirst}`).send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(address.status).toBe(401);
        expect(address.body).toHaveProperty("message");
    })

    test('GET /bankData - LISTAR DATA BANK - Não deve ser possivel listar bados bancarios de uma usuario enexistente ERROR 404', async () => {
        const address = await request(app).get("/bankData/user/198a3aa5-f29e-4fac-873f-d4d2f1a13bff").send().set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(address.status).toBe(404);
        expect(address.body).toHaveProperty("message");
    })

    test('GET /bankData - LISTAR DATA BANK - Não deve ser possivel listar dados bancarios se não existirem ERROR 404', async () => {
        const address = await request(app).get("/bankData/user").send().set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(address.status).toBe(404);
        expect(address.body).toHaveProperty("message");
    })

    test('GET /bankData - LISTAR DATA BANK - Não deve ser possivel listar dados bancarios com ID inválido ERROR 400', async () => {
        const address = await request(app).get("/bankData/user/2321").send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(address.status).toBe(400);
        expect(address.body).toHaveProperty("message");
    })

    test('GET /bankData - LISTAR DATA BANK - Deve ser possivel listar seus propios dados bancarios SUCESS 200', async () => {
        const address = await request(app).get("/bankData").send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(address.status).toBe(200);
        responseSucessDataBankCard( address )
    })

    test('GET /bankData - LISTAR DATA BANK - Deve ser possivel um usuario de LEVEL 1 listar dados bancarios de outro usuario SUCESS 200', async () => {
        const address = await request(app).get(`/bankData/user/${idLevelThreeFirst}`).send().set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(address.status).toBe(200);
        responseSucessDataBankCard( address )
    })




    test('PATCH /bankData - ATUALIZAR DATA BANK - Não deve ser possivel atualizar dados bancarios sem o TOKEN ERROR 401', async () => {
        const address = await request(app).patch("/bankData").send()

        expect(address.status).toBe(401);
        expect(address.body).toHaveProperty("message");
    })

    test('PATCH /bankData - ATUALIZAR DATA BANK - Não deve ser possivel atualizar dados com TOKEN inválido ERROR 401', async () => {
        const address = await request(app).patch("/bankData").send().set("Authorization", `Bearer ${234234}`)

        expect(address.status).toBe(401);
        expect(address.body).toHaveProperty("message");
    })

    test('PATCH /bankData - ATUALIZAR DATA BANK - Não deve ser possivel atualizar dados bancarios caso não exista ERROR 404', async () => {
        const address = await request(app).patch("/bankData").send().set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(address.status).toBe(404);
        expect(address.body).toHaveProperty("message");
    })

    test('POST /bankData - CREATE DATA BANK - Deve ser possivel inserir pix SUCESS 200', async () => {
        const address = await request(app).post("/bankData").send(mockedCreateDataBankPixSUCESS).set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(address.status).toBe(200);
        responseSucessDataBankComplete( address )
    })

    test('PATCH /bankData - ATUALIZAR DATA BANK - Não deve ser possivel atualizar dados bancarios do cartão de forma incompleta caso não exista ERROR 400', async () => {
        const address = await request(app).patch("/bankData").send(mockedUpdateCreateDataBankCardERROR).set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(address.status).toBe(400);
        expect(address.body).toHaveProperty("message");
    })

    test('PATCH /bankData - ATUALIZAR DATA BANK - Deve ser possivel atualizar os dados do cartão pela primeira vez SUCESS 200', async () => {
        const address = await request(app).patch("/bankData").send(mockedUpdateCreateDataBankCardSUCESS).set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(address.status).toBe(200);
        responseSucessDataBankComplete( address )
    })

    test('PATCH /bankData - ATUALIZAR DATA BANK - Deve ser possivel atualizar todos os dados do cartão SUCESS 200', async () => {
        const address = await request(app).patch("/bankData").send(mockedUpdateDataBankSUCESS).set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(address.status).toBe(200);
        responseSucessDataBankComplete( address )
    })



    test('DELETE /bankData - DELETAR DATA BANK - Não deve ser possivel deletar dados bancarios sem o TOKEN ERROR 401', async () => {
        const address = await request(app).delete("/bankData").send()

        expect(address.status).toBe(401);
        expect(address.body).toHaveProperty("message");
    })

    test('DELETE /bankData - DELETAR DATA BANK - Não deve ser possivel deletar dados com TOKEN inválido ERROR 401', async () => {
        const address = await request(app).delete("/bankData").send().set("Authorization", `Bearer ${123312}`)

        expect(address.status).toBe(401);
        expect(address.body).toHaveProperty("message");
    })

    test('DELETE /bankData - DELETAR DATA BANK - Deve ser possivel deletar os dados do banco SUCESS 200', async () => {
        const address = await request(app).delete("/bankData").send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(address.status).toBe(200);
        expect(address.body).toHaveProperty("message");
    })

    test('DELETE /bankData - DELETAR DATA BANK - Não deve ser possivel deletar dados bancarios caso o não existam ERROR 404', async () => {
        const address = await request(app).delete("/bankData").send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(address.status).toBe(404);
        expect(address.body).toHaveProperty("message");
    })
})