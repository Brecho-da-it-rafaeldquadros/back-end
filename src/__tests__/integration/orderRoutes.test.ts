import request from 'supertest';

import { DataSource } from 'typeorm';
import AppDataSource from '../../data-source';

import app from '../../app';
import { initializationUserDefault } from '../../util/initialization.util';
import Repository from '../../util/repository.util';

import "dotenv/config"
import { mockedSessionLevelOneDefault, mockedSessionLevelTreeFirst } from '../mocks/user.mocks';
import { mockedCreateBrandFirst, mockedCreateBrandSecond, mockedCreateCategoryFirst, mockedCreateCategorySecond } from '../mocks/preference.mocks';
import { transformsPTBRFormat } from '../../util/date.util';
import { mockedTransport } from '../mocks/order.mocks';

describe('/orders', () => {
    let connection: DataSource;

    let tokenLevelOneFirst: string;
    let tokenLevelThreeFirst: string;
    
    let idLevelOneFirst: string;
    let idLevelThreeFirst: string;

    let categoryIdFirst: string
    let categoryIdSecond: string

    let brandIdFirst: string
    let brandIdSecond: string

    let productIdFirst: string
    let productIdSecond: string

    let orderIdFirst:string

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
        categoryIdFirst = categoryFirst.body.category.id

        const categorySecond = await request(app).post("/categories").send(mockedCreateCategorySecond).set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(categorySecond.status).toBe(201)
        categoryIdSecond = categorySecond.body.category.id

        const brandFirst = await request(app).post("/brands").send(mockedCreateBrandFirst).set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(brandFirst.status).toBe(201)
        brandIdFirst = brandFirst.body.brand.id

        const brandSecond = await request(app).post("/brands").send(mockedCreateBrandSecond).set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(brandSecond.status).toBe(201)
        brandIdSecond = brandSecond.body.brand.id

        const productFirst = await request(app).post("/products").set("Authorization", `Bearer ${tokenLevelOneFirst}`).send({
            name: "Produto de teste",
            description: "Descrição de teste",
            color: "Red",
            launchTime: transformsPTBRFormat(),
            priceSeller: 1000,
            size: "P",
            category: categoryIdFirst,
            brand: brandIdFirst,
        });

        expect(productFirst.status).toEqual(201);
        productIdFirst = productFirst.body.product.id

        const productSecond = await request(app).post("/products").set("Authorization", `Bearer ${tokenLevelOneFirst}`).send({
            name: "Produto de teste",
            description: "Descrição de teste",
            color: "Red",
            launchTime: transformsPTBRFormat(),
            priceSeller: 2000,
            size: "P",
            category: categoryIdSecond,
            brand: brandIdSecond,
        });

        expect(productSecond.status).toEqual(201);
        productIdSecond = productSecond.body.product.id;

        const productFirstBag = await request(app).post(`/bag/product/${productIdFirst}`).send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(productFirstBag.status).toBe(201);

        const productSecondBag = await request(app).post(`/bag/product/${productIdSecond}`).send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(productSecondBag.status).toBe(201);
        
        const address = await request(app).post("/address").send({ 
            name:"Teste",
	        cep:"83701600",
	        number:"000",
	        complement:"Casa dos fundos",
            isDefault:true
        }).set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(address.status).toBe(201);
    })

    afterAll(async () => {
        await connection.destroy();
    });

    test('POST /orders - CREATE ORDER - Não deve ser possivel criar um pedido sem um TOKEN ERROR 401', async () => {
        const order = await request(app).post(`/orders`).send()

        expect(order.status).toBe(401);
        expect(order.body).toHaveProperty("message");
    })

    test('POST /orders - CREATE ORDER - Não deve ser possivel criar um pedido com um TOKEN inválido ERROR 401', async () => {
        const order = await request(app).post(`/orders`).send().set("Authorization", `Bearer ${234}`)

        expect(order.status).toBe(401);
        expect(order.body).toHaveProperty("message");
    })

    test('POST /orders - CREATE ORDER - Não deve ser possivel criar um pedido com o carrinho vazio ERROR 404', async () => {
        const order = await request(app).post(`/orders`).send(mockedTransport).set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(order.status).toBe(404);
        expect(order.body).toHaveProperty("message");
    })

    test('POST /orders - CREATE ORDER - Não deve ser possivel criar um pedido sem enviar dados de transporte ERROR 400', async () => {
        const order = await request(app).post(`/orders`).send().set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(order.status).toBe(400);
        expect(order.body).toHaveProperty("message");
    })

    test('POST /orders - CREATE ORDER - Deve ser possivel criar um pedido SUCCESS 201', async () => {
        const order = await request(app).post(`/orders`).send(mockedTransport).set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(order.status).toBe(201);
        expect(order.body).toHaveProperty("message");

        orderIdFirst = order.body.order.id
    })




    test('GET /orders - LIST ONE OR ALL ORDER - Não deve ser possivel listar um ou mais pedido(s) sem um TOKEN ERROR 401', async () => {
        const order = await request(app).get(`/orders`).send()

        expect(order.status).toBe(401);
        expect(order.body).toHaveProperty("message");
    })

    test('GET /orders - LIST ONE OR ALL ORDER - Não deve ser possivel listar um ou mais pedido(s) com um TOKEN inválido ERROR 401', async () => {
        const order = await request(app).get(`/orders`).send().set("Authorization", `Bearer ${123}`)

        expect(order.status).toBe(401);
        expect(order.body).toHaveProperty("message");
    })

    test('GET /orders - LIST ONE ORDER - Não deve ser possivel listar um pedido com id inválido ERROR 400', async () => {
        const order = await request(app).get(`/orders/123`).send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(order.status).toBe(400);
        expect(order.body).toHaveProperty("message");
    })

    test('GET /orders - LIST ONE ORDER - Não deve ser possivel listar um pedido que não exista ERROR 404', async () => {
        const order = await request(app).get(`/orders/5965ca46-adb0-4eda-acc7-977d0c90da69`).send().set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(order.status).toBe(404);
        expect(order.body).toHaveProperty("message");
    })

    test('GET /orders - LIST ALL ORDER - Não deve ser possivel listar os pedidos de outro usuario caso não sejá NIVEL 1 ERROR 401', async () => {
        const order = await request(app).get(`/orders/user/${idLevelOneFirst}`).send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(order.status).toBe(401);
        expect(order.body).toHaveProperty("message");
    })

    test('GET /orders - LIST ALL ORDER - Deve ser possivel listar os pedidos de outro usuario como NIVEL 1 SUCCESS 200', async () => {
        const order = await request(app).get(`/orders/user/${idLevelThreeFirst}`).send().set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(order.status).toBe(200);
        expect(order.body).toHaveProperty("message");
    })

    test('GET /orders - LIST ALL ORDER - Deve ser possivel listar todos os pedidos SUCESS 200', async () => {
        const order = await request(app).get(`/orders`).send().send().set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(order.status).toBe(200);
        expect(order.body).toHaveProperty("message");
    })

    test('GET /orders - LIST ONE ORDER - Deve ser possivel listar um único pedidos SUCESS 200', async () => {
        const order = await request(app).get(`/orders/${orderIdFirst}`).send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(order.status).toBe(200);
        expect(order.body).toHaveProperty("message");
    })




    test('PATCH /orders - UPDATE ORDER - Não deve ser possivel atualizar um pedido sem um TOKEN ERROR 401', async () => {
        const order = await request(app).patch(`/orders/s`).send()

        expect(order.status).toBe(401);
        expect(order.body).toHaveProperty("message");
    })

    test('PATCH /orders - UPDATE ORDER - Não deve ser possivel atualizar um pedido com um TOKEN inválido ERROR 401', async () => {
        const order = await request(app).patch(`/orders/s`).send().set("Authorization", `Bearer ${123}`)

        expect(order.status).toBe(401);
        expect(order.body).toHaveProperty("message");
    })

    test('PATCH /orders - UPDATE ORDER - Não deve ser possivel atualizar um pedido com um id inválido ERROR 401', async () => {
        const order = await request(app).patch(`/orders/asdas`).send().send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(order.status).toBe(401);
        expect(order.body).toHaveProperty("message");
    })

    test('PATCH /orders - UPDATE ORDER - Não deve ser possivel atualizar um pedido que não exista ERROR 401', async () => {
        const order = await request(app).patch(`/orders/c5390fa4-3b09-42bc-be68-353cc2ea0e58`).send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(order.status).toBe(401);
        expect(order.body).toHaveProperty("message");
    })

    test('PATCH /orders - UPDATE ORDER - Não deve ser possivel atualizar um pedido caso não tenha nivel 1 ERROR 401', async () => {
        const order = await request(app).patch(`/orders/${orderIdFirst}`).send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)


        expect(order.status).toBe(401);
        expect(order.body).toHaveProperty("message");
    })

    test('PATCH /orders - UPDATE ORDER - Deve ser possivel atualizar o transporte de um pedido SUCCESS 200', async () => {
        const order = await request(app).patch(`/orders/${orderIdFirst}`).send({
            trackingCode:"32234324",
            companyTrackingAreaLink:"https://rastreamento.correios.com.br/app/index.php"
        }).set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(order.status).toBe(200);
        expect(order.body).toHaveProperty("message");
    })




    test('POST /orders - WEBHOOK ORDER - Não deve ser possivel enviar dados de pagamento caso eles não existão ERROR 400', async () => {
        const order = await request(app).post(`/orders/webhook`).send()

        expect(order.status).toBe(400);
        expect(order.body).toHaveProperty("message");
    })

    test('POST /orders - WEBHOOK ORDER - Não deve ser possivel enviar dados de pagamento caso eles não sejam do pagamento ERROR 403', async () => {
        const order = await request(app).post(`/orders/webhook`).send({
            action: "payment.created",
            api_version: "v1",
            data: {
              id: "1312047260"
            },
            date_created: "2023-03-12T22:04:38Z",
            id: 105222241792,
            live_mode: true,
            type: "teste",
            user_id: "1317804432"
        })

        expect(order.status).toBe(403);
        expect(order.body).toHaveProperty("message");
    })

    test('POST /orders - WEBHOOK ORDER - Não deve ser possivel enviar dados de pagamento caso o pagamento não exista ERROR 404', async () => {
        const order = await request(app).post(`/orders/webhook`).send({
            action: "payment.created",
            api_version: "v1",
            data: {
              id: "1312047260"
            },
            date_created: "2023-03-12T22:04:38Z",
            id: 105222241792,
            live_mode: true,
            type: "payment",
            user_id: "1317804432"
        })

        expect(order.status).toBe(404);
        expect(order.body).toHaveProperty("message");
    })
})