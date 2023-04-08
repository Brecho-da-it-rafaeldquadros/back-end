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

describe('/bag', () => {
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
        productIdSecond = productSecond.body.product.id
    })

    afterAll(async () => {
        await connection.destroy();
    });

    test('POST /bag - CREATE BAG - Não deve ser possivel adicionar um produto na sacola sem ter um TOKEN ERROR 401', async () => {
        const bag = await request(app).post(`/bag/product/${productIdFirst}`).send()

        expect(bag.status).toBe(401);
        expect(bag.body).toHaveProperty("message");
    })

    test('POST /bag - CREATE BAG - Não deve ser possivel adicionar um produto na sacola com um TOKEN inválido ERROR 401', async () => {
        const bag = await request(app).post(`/bag/product/${productIdFirst}`).send().set("Authorization", `Bearer ${234}`)

        expect(bag.status).toBe(401);
        expect(bag.body).toHaveProperty("message");
    })

    test('POST /bag - CREATE BAG - Não deve ser possivel adicionar um produto na sacola com um ID inválido ERROR 400', async () => {
        const bag = await request(app).post(`/bag/product/1`).send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(bag.status).toBe(400);
        expect(bag.body).toHaveProperty("message");
    })

    test('POST /bag - CREATE BAG - Não deve ser possivel adicionar um produto na sacola com um ID de um produto inexistente ERROR 404', async () => {
        const bag = await request(app).post("/bag/product/787930bf-392c-4014-8f3c-83cb00481c02").send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(bag.status).toBe(404);
        expect(bag.body).toHaveProperty("message");
    })

    test('POST /bag - CREATE BAG - Deve ser possivel adicionar um produto na sacola SUCESS 201', async () => {
        const bag = await request(app).post(`/bag/product/${productIdFirst}`).send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(bag.status).toBe(201);
        expect(bag.body).toHaveProperty("message");
    })

    test('POST /bag - CREATE BAG - Não deve ser possivel adicionar um produto que esteja na sacola de outro usuario ERROR 403', async () => {
        const bag = await request(app).post(`/bag/product/${productIdFirst}`).send().set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(bag.status).toBe(403);
        expect(bag.body).toHaveProperty("message");
    })

    test('POST /bag - CREATE BAG - Deve ser possivel adicionar mais de um produto na sacola SUCESS 201', async () => {
        const bag = await request(app).post(`/bag/product/${productIdSecond}`).send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(bag.status).toBe(201);
        expect(bag.body).toHaveProperty("message");
    })

    // test('POST /bag - CREATE BAG - Não deve ser possivel adicionar um produto que esteja no pedido de outro usuario ERROR 401', async () => {
    //     const bag = await request(app).post("/bag").send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

    //     expect(bag.status).toBe(401);
    //     expect(bag.body).toHaveProperty("message");
    // })




    test('GET /bag - LIST BAG - Não deve ser possivel listar a sacola sem ter um TOKEN ERROR 401', async () => {
        const bag = await request(app).get("/bag").send()

        expect(bag.status).toBe(401);
        expect(bag.body).toHaveProperty("message");
    })

    test('GET /bag - LIST BAG - Não deve ser possivel listar a sacola com um TOKEN inválido ERROR 401', async () => {
        const bag = await request(app).get("/bag").send().set("Authorization", `Bearer ${123}`)

        expect(bag.status).toBe(401);
        expect(bag.body).toHaveProperty("message");
    })

    test('GET /bag - LIST BAG - Deve ser possivel listar a sacola sem ter nada como NULL SUCESS 200', async () => {
        const bag = await request(app).get("/bag").send().set("Authorization", `Bearer ${tokenLevelOneFirst}`)

        expect(bag.status).toBe(200);
        expect(bag.body).toHaveProperty("message");
        expect(bag.body).toHaveProperty("bag");
        expect(bag.body.bag).toEqual(null);
    })

    test('GET /bag - LIST BAG - Deve ser possivel listar a sacola com produtos e resumo SUCESS 200', async () => {
        const bag = await request(app).get("/bag").send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(bag.status).toBe(200);
        expect(bag.body).toHaveProperty("message");
        expect(bag.body).toHaveProperty("resume");
        expect(bag.body.resume).toHaveProperty("price");
        expect(bag.body.resume).toHaveProperty("amount");
        expect(bag.body).toHaveProperty("bag");
        expect(bag.body.bag).toHaveProperty("id");
        expect(bag.body.bag).toHaveProperty("validAt");
        expect(bag.body.bag).toHaveProperty("updatedAt");
        expect(bag.body.bag).toHaveProperty("createdAt");
        expect(bag.body.bag).toHaveProperty("products");
        expect(bag.body.bag.products.length).toEqual(2);
        expect(bag.body.bag.products[0]).toHaveProperty("id");
        expect(bag.body.bag.products[0]).toHaveProperty("name");
        expect(bag.body.bag.products[0]).toHaveProperty("priceAll");
        expect(bag.body.bag.products[0]).toHaveProperty("isSale");
        expect(bag.body.bag.products[0]).toHaveProperty("salePrice");
        expect(bag.body.bag.products[0]).toHaveProperty("image_1");
        expect(bag.body.bag.products[0]).toHaveProperty("category");
        expect(bag.body.bag.products[0]).toHaveProperty("brand");
        expect(bag.body.bag.products[0].category).toHaveProperty("name");
        expect(bag.body.bag.products[0].brand).toHaveProperty("name");
    })




    test('DELETE /bag - REMOVE ONE OR ALL BAG - Não deve ser possivel remover um ou todos os produtos da sacola sem ter um TOKEN ERROR 401', async () => {
        const bag = await request(app).delete("/bag").send()

        expect(bag.status).toBe(401);
        expect(bag.body).toHaveProperty("message");
    })

    test('DELETE /bag - REMOVE ONE OR ALL BAG - Não deve ser possivel remover um ou todos os produtos da sacola com um TOKEN inválido ERROR 401', async () => {
        const bag = await request(app).delete("/bag").send().set("Authorization", `Bearer ${123}`)

        expect(bag.status).toBe(401);
        expect(bag.body).toHaveProperty("message");
    })

    test('DELETE /bag - REMOVE ONE BAG - Não deve ser possivel remover um produto da sacola com um ID inválido ERROR 400', async () => {
        const bag = await request(app).delete("/bag/product/ad").send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(bag.status).toBe(400);
        expect(bag.body).toHaveProperty("message");
    })

    test('DELETE /bag - REMOVE ONE BAG - Não deve ser possivel remover um produto que não existe ERROR 404', async () => {
        const bag = await request(app).delete("/bag/product/787930bf-392c-4014-8f3c-83cb00481c02").send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(bag.status).toBe(404);
        expect(bag.body).toHaveProperty("message");
    })

    test('DELETE /bag - REMOVE ONE BAG - Deve ser possivel remover um unico produto da sacola SUCCESS 200', async () => {
        const bag = await request(app).delete(`/bag/product/${productIdFirst}`).send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(bag.status).toBe(200);
        expect(bag.body).toHaveProperty("message");
    })

    test('DELETE /bag - REMOVE ALL BAG - Deve ser possivel remover todos os produto da sacola SUCCESS 200', async () => {
        const bag = await request(app).delete("/bag").send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(bag.status).toBe(200);
        expect(bag.body).toHaveProperty("message");
    })
    
    test('DELETE /bag - REMOVE ALL BAG - Não deve ser possivel remover todos os produtos da sacola caso ela não exista ERROR 404', async () => {
        const bag = await request(app).delete("/bag").send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

        expect(bag.status).toBe(404);
        expect(bag.body).toHaveProperty("message");
    })
})