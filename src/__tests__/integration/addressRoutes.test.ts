import request from 'supertest';

import { DataSource } from 'typeorm';
import AppDataSource from '../../data-source';

import app from '../../app';
import { initializationUserDefault } from '../../util/initialization.util';
import Repository from '../../util/repository.util';

import "dotenv/config"
import { mockedSessionLevelOneDefault, mockedSessionLevelTreeFirst } from '../mocks/user.mocks';
import { mockedCreateAddressUserLevelOneBusinessSUCESS, mockedCreateAddressUserLevelTreeBusinessERROR, mockedCreateAddressUserLevelTreeNewDefaultSUCESS, mockedUpdateAddress } from '../mocks/address.mocks';
import { responseSucessAddress } from '../responses/address.responses';

describe('/user', () => {
    let connection: DataSource;

    let tokenLevelOneFirst: string;
    let tokenLevelThreeFirst: string;
    
    let idLevelOneFirst: string;
    let idLevelThreeFirst: string;

    let idAddressLevelTreeFirst: string;
    let idAddressLevelTreeSecond: string;

    let idAddressLevelOneFirst: string;
    let idAddressLevelOneSecond: string;

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

    test('POST /address - CREATE ADDRESS - Não deve ser possivel criar um endereço sem enviar algo ERROR 400', async () => {
        const address = await request(app).post("/address").send({}).set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(address.status).toBe(400);
        expect(address.body).toHaveProperty("message");
    })

    test('POST /address - CREATE ADDRESS - Não deve ser possivel um usuario normal adionar seu endereço como da empresa, devera ignorar SUCESS 201', async () => {
        const address = await request(app).post("/address").send(mockedCreateAddressUserLevelTreeBusinessERROR).set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(address.status).toBe(201);
        expect(address.body).toHaveProperty("message");
        responseSucessAddress( address )

        idAddressLevelTreeFirst = address.body.address.id
    })

    test('POST /address - CREATE ADDRESS - Não deve ser possivel adicionar um endereço sem estar com o TOKEN ERROR 401', async () => {
        const address = await request(app).post("/address").send(mockedCreateAddressUserLevelTreeBusinessERROR)

        expect(address.status).toBe(401);
        expect(address.body).toHaveProperty("message");
    })

    test('POST /address - CREATE ADDRESS - Não deve ser possivel adicionar um enredeço com um TOKEN inválido ERROR 401', async () => {
        const address = await request(app).post("/address").send(mockedCreateAddressUserLevelTreeBusinessERROR).set("Authorization", `Bearer ${12312}`)

        expect(address.status).toBe(401);
        expect(address.body).toHaveProperty("message");
    })

    test('POST /address - CREATE ADDRESS - Não deve ser possivel adicionar mais de 5 endereços ERROR 401', async () => {
        const addressSave = await request(app).post("/address").send(mockedCreateAddressUserLevelTreeBusinessERROR).set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        idAddressLevelTreeSecond = addressSave.body.address.id

        await request(app).post("/address").send(mockedCreateAddressUserLevelTreeBusinessERROR).set("Authorization", `Bearer ${tokenLevelThreeFirst}`)
        await request(app).post("/address").send(mockedCreateAddressUserLevelTreeBusinessERROR).set("Authorization", `Bearer ${tokenLevelThreeFirst}`)
        await request(app).post("/address").send(mockedCreateAddressUserLevelTreeBusinessERROR).set("Authorization", `Bearer ${tokenLevelThreeFirst}`)
        const address = await request(app).post("/address").send(mockedCreateAddressUserLevelTreeBusinessERROR).set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(address.status).toBe(400);
        expect(address.body).toHaveProperty("message");
    })

    test('POST /address - CREATE ADDRESS - ADM - Deve ser possivel adicionar um endereço como da empresa SUCESS 201', async () => {
        const address = await request(app).post("/address").send(mockedCreateAddressUserLevelOneBusinessSUCESS).set("Authorization", `Bearer ${tokenLevelOneFirst}`)
        
        expect(address.status).toBe(201);
        expect(address.body).toHaveProperty("message");
        responseSucessAddress( address )

        idAddressLevelOneFirst = address.body.address.id
    })

    test('POST /address - CREATE ADDRESS - ADM - Não deve ser possivel adicionar dois endereços da empresa com nivel de autorização 1 ERROR 401', async () => {
        const address = await request(app).post("/address").send(mockedCreateAddressUserLevelOneBusinessSUCESS).set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(address.status).toBe(400);
        expect(address.body).toHaveProperty("message");
    }) 

    test('POST /address - CREATE ADDRESS  - Deve ser possivel adicionar um endereço como principal da conta SUCESS 201', async () => {
        const address = await request(app).post("/address").send(mockedCreateAddressUserLevelTreeNewDefaultSUCESS).set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(address.status).toBe(201);
        expect(address.body).toHaveProperty("message");
        expect(address.body.address.isDefault).toEqual(true);
        responseSucessAddress( address )

        idAddressLevelOneSecond = address.body.address.id
    })




    test('GET /address - LISTAMENTO ÚNICO - Não deve ser possivel listar endereço de outro usuario caso não tenha autorização 1 ERROR 404', async () => {
        const address = await request(app).get(`/address/${idAddressLevelOneFirst}/user/type`).send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(address.status).toBe(404);
        expect(address.body).toHaveProperty("message");
    })

    test('GET /address - LISTAMENTO ÚNICO - Não deve ser possivel listar um endereço sem enviar o ID ERROR 404', async () => {
        const address = await request(app).get(`/address/user/type`).send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(address.status).toBe(404);
    })

    test('GET /address - LISTAMENTO ÚNICO - Não deve ser possivel listar um endereço com id invalido ERROR 400', async () => {
        const address = await request(app).get(`/address/${123123}/user/type`).send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(address.status).toBe(400);
        expect(address.body).toHaveProperty("message");
    })

    test('GET /address - LISTAMENTO ÚNICO - Não deve ser possivel listar se não estiver autenticado com um TOKEN ERROR 401', async () => {
        const address = await request(app).get(`/address/${idAddressLevelOneFirst}/user/type`).send()

        expect(address.status).toBe(401);
        expect(address.body).toHaveProperty("message");
    })

    test('GET /address - LISTAMENTO ÚNICO - Não deve ser possivel listar se o TOKEN for inválido ERROR 401', async () => {
        const address = await request(app).get(`/address/${idAddressLevelOneFirst}/user/type`).send().set("Authorization", `Bearer ${123}`)

        expect(address.status).toBe(401);
        expect(address.body).toHaveProperty("message");
    })

    test('GET /address - LISTAMENTO ÚNICO - Deve ser possivel listar um unico endereço SUCESS 200', async () => {
        const address = await request(app).get(`/address/${idAddressLevelTreeFirst}/user/type`).send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(address.status).toBe(200);
        responseSucessAddress( address )
    })

    test('GET /address - LISTAMENTO ÚNICO - Deve ser possivel listar um unico endereço de outro usuario como nivel 1 de autorização SUCESS 200', async () => {
        const address = await request(app).get(`/address/${idAddressLevelTreeFirst}/user/${idLevelThreeFirst}/type`).send().set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(address.status).toBe(200);
        responseSucessAddress( address )
    })




    test('GET /address - LISTAMENTO VARIOS - Não Deve ser possivel listar varios endereços caso não tenha a palavra ALL na URL ERROR 400', async () => {
        const address = await request(app).get(`/address/user/type`).send().set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(address.status).toBe(404);
    })

    test('GET /address - LISTAMENTO VARIOS - Não deve ser possivel listar endereços de um usuario que não existe ERROR 404', async () => {
        const address = await request(app).get(`/address/${idAddressLevelTreeFirst}/user/6f514b80-f58b-4939-a7af-fafb750c2b0d/type/all`).send().set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(address.status).toBe(404);
        expect(address.body).toHaveProperty("message");
    })

    test('GET /address - LISTAMENTO VARIOS - Não deve ser possivel listar varios endereços de outro usuario caso não tenha autorização LEVEL 1 ERROR 401', async () => {
        const address = await request(app).get(`/address/${idAddressLevelOneFirst}/user/${idLevelOneFirst}/type/all`).send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(address.status).toBe(401);
        expect(address.body).toHaveProperty("message");
    })

    test('GET /address - LISTAMENTO VARIOS - Deve ser possivel listar seus varios endereços SUCESS 200', async () => {
        const address = await request(app).get(`/address/user/type/all`).send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(address.status).toBe(200);
        expect(address.body).toHaveProperty("message")

        expect(address.body.address[0]).toHaveProperty("complement")
        expect(address.body.address[0]).toHaveProperty("neighborhood")
        expect(address.body.address[0]).toHaveProperty("uf")
        expect(address.body.address[0]).toHaveProperty("city")
        expect(address.body.address[0]).toHaveProperty("number")
        expect(address.body.address[0]).toHaveProperty("street")
        expect(address.body.address[0]).toHaveProperty("cep")
        expect(address.body.address[0]).toHaveProperty("isCompanyAddress")
        expect(address.body.address[0]).toHaveProperty("isDefault")
        expect(address.body.address[0]).toHaveProperty("isSameTown")
        expect(address.body.address[0]).toHaveProperty("id")
    })

    test('GET /address - LISTAMENTO VARIOS - ADM - Deve ser possivel listar varios endereços de outro usuario com LEVEL 1 de autorização SUCESS 200', async () => {
        const address = await request(app).get(`/address/user/${idLevelThreeFirst}/type/all`).send().set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(address.status).toBe(200);
        expect(address.body).toHaveProperty("message");
    })




    test('PATCH /address - ATUALIZAMDO MEU ENDEREÇO - Não deve ser possivel alterar o endereço sem um TOKEN de autorização ERROR 401', async () => {
        const address = await request(app).patch(`/address/${idAddressLevelOneFirst}`).send()

        expect(address.status).toBe(401);
        expect(address.body).toHaveProperty("message");
    })

    test('PATCH /address - ATUALIZAMDO MEU ENDEREÇO - Não deve ser possivel alterar o endereço com um TOKEN inválido ERROR 401', async () => {
        const address = await request(app).patch(`/address/${idAddressLevelOneFirst}`).send().set("Authorization", `Bearer ${12312}`)

        expect(address.status).toBe(401);
        expect(address.body).toHaveProperty("message");
    })

    test('PATCH /address - ATUALIZAMDO MEU ENDEREÇO - Não deve ser possivel um usuario alterar o endereço de outro usuario sem mesmo LEVEL 1 ERROR 401', async () => {
        const address = await request(app).patch(`/address/${idAddressLevelOneFirst}`).send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(address.status).toBe(401);
        expect(address.body).toHaveProperty("message");
    })

    test('PATCH /address - ATUALIZAMDO MEU ENDEREÇO - Não deve ser possivel alterar um endereço sem enviar o id do endereço ERROR 404', async () => {
        const address = await request(app).patch(`/address`).send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(address.status).toBe(404);
    })

    test('PATCH /address - ATUALIZAMDO MEU ENDEREÇO - Não deve ser possivel alterar um endereço com ID inválido ERROR 400', async () => {
        const address = await request(app).patch(`/address/3123`).send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(address.status).toBe(400);
        expect(address.body).toHaveProperty("message");
    })

    test('PATCH /address - ATUALIZAMDO MEU ENDEREÇO - Não deve ser possivel alterar o CEP sem enviar o numero da casa ERROR 400', async () => {
        const address = await request(app).patch(`/address/3123`).send({ cep:"83123123" }).set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(address.status).toBe(400);
        expect(address.body).toHaveProperty("message");
    })

    test('PATCH /address - ATUALIZAMDO MEU ENDEREÇO - ADM - Não deve ser possivel alterar o endereço da empresa por um usuario que não é LEVEL 1 ERROR 200', async () => {
        const address = await request(app).patch(`/address/${idAddressLevelTreeFirst}`).send(mockedCreateAddressUserLevelTreeBusinessERROR).set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(address.status).toBe(200);
        expect(address.body).toHaveProperty("message");
        expect(address.body.address.isCompanyAddress).toEqual(false);
        responseSucessAddress( address )
    })

    test('PATCH /address - ATUALIZAMDO MEU ENDEREÇO - ADM - Não deve ser possivel definir um novo endereço da empresa caso tenha sido defido um ERROR 400', async () => {
        const address = await request(app).patch(`/address/${idAddressLevelOneSecond}`).send(mockedCreateAddressUserLevelTreeBusinessERROR).set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(address.status).toBe(400);
        expect(address.body).toHaveProperty("message");
    })

    test('PATCH /address - ATUALIZAMDO MEU ENDEREÇO - Deve ser possivel atualizar seus endereços SUCESS 200', async () => {
        const address = await request(app).patch(`/address/${idAddressLevelOneSecond}`).send(mockedUpdateAddress).set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(address.status).toBe(200);
        expect(address.body).toHaveProperty("message");
        responseSucessAddress( address )
    })




    test('DELETE /address - REMOVENDO MEU ENDEREÇO - Não deve ser possivel alterar o endereço sem um TOKEN de autorização ERROR 401', async () => {
        const address = await request(app).delete(`/address/${idAddressLevelOneSecond}`).send()

        expect(address.status).toBe(401);
        expect(address.body).toHaveProperty("message");
    })

    test('DELETE /address - REMOVENDO MEU ENDEREÇO - Não deve ser possivel alterar o endereço com um TOKEN inválido ERROR 401', async () => {
        const address = await request(app).delete(`/address/${idAddressLevelOneSecond}`).send().set("Authorization", `Bearer ${123}`)

        expect(address.status).toBe(401);
        expect(address.body).toHaveProperty("message");
    })

    test('DELETE /address - REMOVENDO MEU ENDEREÇO - Não deve ser possivel remover endereço de outros usuarios ERROR 401', async () => {
        const address = await request(app).delete(`/address/${idAddressLevelTreeFirst}`).send().set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(address.status).toBe(401);
        expect(address.body).toHaveProperty("message");
    })

    test('DELETE /address - REMOVENDO MEU ENDEREÇO - Não deve ser possivel remover um endereço que não exista ERROR 404', async () => {
        const address = await request(app).delete(`/address/2caadd0c-0529-4f3d-851b-2a3692cc3e74`).send().set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(address.status).toBe(404);
        expect(address.body).toHaveProperty("message");
    })

    test('DELETE /address - REMOVENDO MEU ENDEREÇO - Deve ser possivel remover um endereço SUCESS 200', async () => {
        const address = await request(app).delete(`/address/${ idAddressLevelOneFirst }`).send().set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(address.status).toBe(200);
        expect(address.body).toHaveProperty("message");
    })
})