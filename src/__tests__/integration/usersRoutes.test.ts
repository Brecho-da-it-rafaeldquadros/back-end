import request from 'supertest';

import { DataSource } from 'typeorm';
import AppDataSource from '../../data-source';

import app from '../../app';
import { responseSucessUser } from '../responses/user.responses';
import { initializationUserDefault } from '../../util/initialization.util';
import Repository from '../../util/repository.util';
import { mockedCreateLevelOneDefault, mockedCreateLevelOneFirst, mockedCreateLevelOneSecond, mockedCreateLevelTreeFirst, mockedCreateLevelTreeSecond, mockedCreateLevelTreeThird, mockedRetrieveMyAccount, mockedRetrieveNotFoundAccount, mockedSessionLevelOneAfterRetrieveAccount, mockedSessionLevelOneDefault, mockedSessionLevelOneFirst, mockedSessionLevelOneFirstInvalidPassword, mockedSessionLevelTreeFirst, mockedSessionLevelTreeSecond, mockedUpdateMyAccountiImediateAndAwaiting, mockedUpdateMyAccountiImmediate, mockedUpdateMyEmailBeLevel3, mockedUpdateOtherUserLevel3 } from '../mocks/user.mocks';

import "dotenv/config"

describe('/user', () => {
  let connection: DataSource;

  let tokenLevelOneFirst: string;
  let tokenLevelOneSecond: string;
  let tokenLevelOneDefault: string;
  let tokenLevelThreeFirst: string;
  let tokenLevelThreeSecond: string;
 

  let idLevelOneFirst: string;
  let idLevelOneSecond: string;
  let idLevelThreeFirst: string;
  let idLevelThreeSecond: string;
  let idLevelThreeThird: string;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => {
        connection = res;
      })
      .catch((err) => {
        console.error('Error during Data Source initialization', err);
      })

      initializationUserDefault()

      const session = await request(app).post("/session").send(mockedSessionLevelOneDefault)

      expect(session.status).toBe(200)

      tokenLevelOneDefault = session.body.token
  })

  afterAll(async () => {
    await connection.destroy();
  });




  test('POST /users - CREATE USER - Deve ser possível criar um usuario normal - SUCESS 201', async () => {
    const user = await request(app).post("/users").send(mockedCreateLevelTreeFirst)

    expect(user.status).toBe(201)
    expect(user.body.user.authorizationLevel).toBe(3)
    responseSucessUser( user, "user" )

    idLevelThreeFirst = user.body.user.id
  })

  test('GET /users - SOLICITAR CÓDIGO - Deve ser possivel solicitar um código de confirmação de "email" LEVEL 3 CREATE SUCESS 200', async () => {
    const user = await request(app).get(`/users/${idLevelThreeFirst}/solicitation/code=email/create`).send()

    expect(user.status).toBe(200);
    expect(user.body).toHaveProperty("message");
  })

  test('POST /users - CONFIRMAR CÓDIGO - Deve ser possivel confirmar código de "email" LEVEL 3 CREATE SUCESS 200', async () => {

    const code = await Repository.code.findOne({ where:{ user:{ id:idLevelThreeFirst } }, relations:{ user:true } })

    const user = await request(app).post(`/users/${idLevelThreeFirst}/confirm/code=email/create`).send({ code:code.codeEmail })

    expect(user.status).toBe(200);
    responseSucessUser( user, "user" )
  })

  test('GET /users - SOLICITAR CÓDIGO - Deve ser possivel solicitar um código de confirmação de "sms" LEVEL 3 CREATE SUCESS 200', async () => {
    const user = await request(app).get(`/users/${idLevelThreeFirst}/solicitation/code=sms/create`).send()

    expect(user.status).toBe(200);
    expect(user.body).toHaveProperty("message");
  })

  test('POST /users - CONFIRMAR CÓDIGO - Deve ser possivel confirmar código de "sms" LEVEL 3 CREATE SUCESS 200', async () => {

    const code = await Repository.code.findOne({ where:{ user:{ id:idLevelThreeFirst } }, relations:{ user:true } })

    const user = await request(app).post(`/users/${idLevelThreeFirst}/confirm/code=sms/create`).send({ code:code.codeSMS })

    expect(user.status).toBe(200);
    responseSucessUser( user, "user" )
  })

  test('POST /session - INICIAR SESSÃO -  Deve ser possivel iniciar uma sessão com EMAIL e SENHA LEVEL 3  SUCESS 200', async () => {
    const session = await request(app).post("/session").send(mockedSessionLevelTreeFirst)

    expect(session.status).toBe(200)
    expect(session.body).toHaveProperty("token")
    responseSucessUser( session, "user" )

    tokenLevelThreeFirst = session.body.token
  })




  test('POST /users - CREATE USER - Deve ser possivel criar um usuario de nível 1 sendo um usuario logado de nivel 1 SUCESS 201', async () => {
    const user = await request(app).post("/users").send(mockedCreateLevelOneFirst).set("Authorization", `Bearer ${tokenLevelOneDefault}`)

    expect(user.status).toBe(201);
    expect(user.body.user.authorizationLevel).toBe(1)
    responseSucessUser( user, "user" )

    idLevelOneFirst = user.body.user.id
  })

  test('GET /users - SOLICITAR CÓDIGO - Deve ser possivel solicitar um código de confirmação de "email" LEVEL 3 CREATE SUCESS 200', async () => {
    const user = await request(app).get(`/users/${idLevelOneFirst}/solicitation/code=email/create`).send()

    expect(user.status).toBe(200);
    expect(user.body).toHaveProperty("message");
  })

  test('POST /users - CONFIRMAR CÓDIGO - Deve ser possivel confirmar código de "email" LEVEL 3 CREATE SUCESS 200', async () => {

    const code = await Repository.code.findOne({ where:{ user:{ id:idLevelOneFirst } }, relations:{ user:true } })

    const user = await request(app).post(`/users/${idLevelOneFirst}/confirm/code=email/create`).send({ code:code.codeEmail })

    expect(user.status).toBe(200);
    responseSucessUser( user, "user" )
  })

  test('GET /users - SOLICITAR CÓDIGO - Deve ser possivel solicitar um código de confirmação de "sms" LEVEL 3 CREATE SUCESS 200', async () => {
    const user = await request(app).get(`/users/${idLevelOneFirst}/solicitation/code=sms/create`).send()

    expect(user.status).toBe(200);
    expect(user.body).toHaveProperty("message");
  })

  test('POST /users - CONFIRMAR CÓDIGO - Deve ser possivel confirmar código de "sms" LEVEL 3 CREATE SUCESS 200', async () => {

    const code = await Repository.code.findOne({ where:{ user:{ id:idLevelOneFirst } }, relations:{ user:true } })

    const user = await request(app).post(`/users/${idLevelOneFirst}/confirm/code=sms/create`).send({ code:code.codeSMS })

    expect(user.status).toBe(200);
    responseSucessUser( user, "user" )
  })

  test('POST /session - INICIAR SESSÃO -  Deve ser possivel iniciar uma sessão com EMAIL e SENHA LEVEL 3  SUCESS 200', async () => {
    const session = await request(app).post("/session").send(mockedSessionLevelOneFirst)

    expect(session.status).toBe(200)
    expect(session.body).toHaveProperty("token")
    responseSucessUser( session, "user" )

    tokenLevelOneFirst = session.body.token
  })


  test('POST /users - CREATE USER - Não deve ser possível criar um usuario com email duplicado ERROR 401', async () => {
    const user = await request(app).post("/users").send(mockedCreateLevelOneDefault)

    expect(user.status).toBe(401);
    expect(user.body).toHaveProperty("message");
  })

  test('POST /users - CREATE USER - Não deve ser possível criar um usuario sem enviar os dados necessario ERROR 400', async () => {
    const user = await request(app).post("/users").send({})

    expect(user.status).toBe(400);
    expect(user.body).toHaveProperty("message");
  })

  test('POST /users - CREATE USER - Não deve ser possível criar um usuario de nível 1 sem estar logado e sem ser um usuario de nível 1, deverá criar um nivel 3 SUCESS 201 400', async () => {
    const userAndToken = await request(app).post("/users").send(mockedCreateLevelTreeSecond).set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

    expect(userAndToken.status).toBe(201);
    expect(userAndToken.body).toHaveProperty("message");
    expect(userAndToken.body.user.authorizationLevel).toBe(3);

    idLevelThreeSecond  = userAndToken.body.user.id

    const userNotToken = await request(app).post("/users").send(mockedCreateLevelTreeThird)

    expect(userNotToken.status).toBe(201);
    expect(userNotToken.body).toHaveProperty("message");
    expect(userNotToken.body.user.authorizationLevel).toBe(3);

    idLevelThreeThird = userNotToken.body.user.id
  })

  test('POST /users - CREATE USER - Deve ser possivel recuperar o id do usuario caso ainda não tenha sido ativado SUCESS 201 ', async () => {
    const user = await request(app).post("/users").send(mockedCreateLevelTreeSecond)

    expect(user.status).toBe(201);
    expect(user.body).toHaveProperty("message");
  })



  test('GET /users - SOLICITAR CÓDIGO - Não deve ser possivel solicitar código se nenhum serviço pediu "email" ou "sms" em qualquer rota ERROR 400', async () => {
    const userSolicitationCreateSMS = await request(app).get(`/users/${idLevelOneFirst}/solicitation/code=sms/create`).send()
    const userSolicitationUpdateSMS = await request(app).get(`/users/${idLevelOneFirst}/solicitation/code=sms/update`).send()
    const userSolicitationRetrieveAccountSMS = await request(app).get(`/users/${idLevelOneFirst}/solicitation/code=sms/retrieveAccount`).send()
    const userSolicitationCreateEmail = await request(app).get(`/users/${idLevelOneFirst}/solicitation/code=email/create`).send()
    const userSolicitationUpdateEmail = await request(app).get(`/users/${idLevelOneFirst}/solicitation/code=email/update`).send()

    expect(userSolicitationCreateSMS.status).toBe(400);
    expect(userSolicitationUpdateSMS.status).toBe(400);
    expect(userSolicitationRetrieveAccountSMS.status).toBe(400);
    expect(userSolicitationCreateEmail.status).toBe(400);
    expect(userSolicitationUpdateEmail.status).toBe(400);
    expect(userSolicitationCreateSMS.body).toHaveProperty("message");
    expect(userSolicitationUpdateSMS.body).toHaveProperty("message");
    expect(userSolicitationRetrieveAccountSMS.body).toHaveProperty("message");
    expect(userSolicitationCreateEmail.body).toHaveProperty("message");
    expect(userSolicitationUpdateEmail.body).toHaveProperty("message");
  })

  test('GET /users - SOLICITAR CÓDIGO - Não deve ser possivel solicitar código com um usuario inexistente ERROR 404', async () => {
    const user = await request(app).get(`/users/d06a7482-79c9-44cc-921e-30bb60928ac8/solicitation/code=sms/create`).send()

    expect(user.status).toBe(404);
    expect(user.body).toHaveProperty("message");
  })

  test('GET /users - SOLICITAR CÓDIGO - Não deve ser possivel solicitar código sem sinalizar se é para "email" ou "sms" e qual rota é "create", "update", "retrieveAccount" ERROR 400', async () => {
    const userFoundEmailOrSMS = await request(app).get(`/users/${idLevelOneFirst}/solicitation/code/create`).send()
    const userFoundRouteName = await request(app).get(`/users/${idLevelOneFirst}/solicitation/code=sms/`).send()

    expect(userFoundEmailOrSMS.status).toBe(400);
    expect(userFoundEmailOrSMS.body).toHaveProperty("message");
    expect(userFoundRouteName.status).toBe(400);
    expect(userFoundRouteName.body).toHaveProperty("message");
  })

  test('GET /users - SOLICITAR CÓDIGO - Não deve ser possivel recuperar conta pelo email ERROR 400', async () => {

    const user = await request(app).get(`/users/${idLevelOneFirst}/solicitation/code=email/retrieveAccount`).send()

    expect(user.status).toBe(401);
    expect(user.body).toHaveProperty("message");
  })

  test('GET /users - SOLICITAR CÓDIGO - Não deve ser possivel solicitar o código com ID inválido do usuario ERROR 400', async () => {
    const user = await request(app).get(`/users/1/solicitation/code=email/retrieveAccount`).send()

    expect(user.status).toBe(400);
    expect(user.body).toHaveProperty("message");
  })

  test('GET /users - SOLICITAR CÓDIGO - Não deve ser possivel solicitar código de confirmação de usuario se já tiver sido confirmado CREATE ERROR 400', async () => {
    const user = await request(app).get(`/users/${idLevelOneFirst}/solicitation/code=email/create`).send()

    expect(user.status).toBe(400);
    expect(user.body).toHaveProperty("message");
  })

  test('GET /users - SOLICITAR CÓDIGO - Deve ser possivel solicitar um novo código SUCESS 200', async () => {
    const user = await request(app).get(`/users/${idLevelThreeSecond}/solicitation/code=email/create`).send()

    expect(user.status).toBe(200);
    expect(user.body).toHaveProperty("message");
  })





  test('POST /users - CONFIRMAR CÓDIGO - Não deve ser possivel confirmar código sem sinalizar se é para "email" ou "sms" e qual rota é CREATE UPDATE RETRIEVE ACCOUNT ERROR 400', async () => {
    const userFoundEmailOrSMS = await request(app).post(`/users/${idLevelOneFirst}/confirm/code/create`).send()
    const userFoundRouteName = await request(app).post(`/users/${idLevelOneFirst}/confirm/code=sms`).send()

    expect(userFoundEmailOrSMS.status).toBe(400);
    expect(userFoundEmailOrSMS.body).toHaveProperty("message");
    expect(userFoundRouteName.status).toBe(400);
    expect(userFoundRouteName.body).toHaveProperty("message");
  })

  test('POST /users - CONFIRMAR CÓDIGO - Não deve ser possivel confirmar código de "email" para RETRIEVE ACCOUNT ERROR 400', async () => {
    const user = await request(app).post(`/users/${idLevelOneFirst}/confirm/code=email/retrieveAccount`).send({ code:"123456" })

    expect(user.status).toBe(401);
    expect(user.body).toHaveProperty("message");
  })

  test('POST /users - CONFIRMAR CÓDIGO - Não deve ser possivel confirmar código com id do usuario inválido ERROR 400', async () => {
    const user = await request(app).post(`/users/123123/confirm/code=email/retrieveAccount`).send({ code:"123456" })

    expect(user.status).toBe(400);
    expect(user.body).toHaveProperty("message");
  })

  test('POST /users - CONFIRMAR CÓDIGO - Não deve ser possivel confirmar código com um usuario inexistente ERROR 404', async () => {

    const user = await request(app).post(`/users/d06a7482-79c9-44cc-921e-30bb60928ac8/confirm/code=email/create`).send({ code:"123456" })

    expect(user.status).toBe(404);
    expect(user.body).toHaveProperty("message");
  })

  test('POST /users - CONFIRMAR CÓDIGO - Não deve ser possivel confirmar código sem ter solicitado ERROR 404', async () => {

    const user = await request(app).post(`/users/${idLevelOneFirst}/confirm/code=email/update`).send({ code:"123456" })

    expect(user.status).toBe(404);
    expect(user.body).toHaveProperty("message");
  })

  test('POST /users - CONFIRMAR CÓDIGO - Não deve ser possivel confirmar código inválido ERROR 400', async () => {

    const user = await request(app).post(`/users/${idLevelThreeSecond}/confirm/code=email/create`).send({ code:"126" })

    expect(user.status).toBe(400);
    expect(user.body).toHaveProperty("message");
  })




  test('PATCH /users - ATUALIZAR USUARIO - Não deve ser possivel um usuario nivel 3 alterar a conta de outro usuario ERROR 401', async () => {

    const user = await request(app).patch(`/users/${idLevelOneFirst}`).send({ fullName:"teste" }).set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

    expect(user.status).toBe(401);
    expect(user.body).toHaveProperty("message");
  })

  test('PATCH /users - ATUALIZAR USUARIO - Não deve ser possivel alterar a conta de outro usuario com id invalido ERROR 400', async () => {
    const user = await request(app).patch(`/users/2342`).send({ fullName:"teste" }).set("Authorization", `Bearer ${tokenLevelOneDefault}`)

    expect(user.status).toBe(400);
    expect(user.body).toHaveProperty("message");
  })

  test('PATCH /users - ATUALIZAR USUARIO - Não deve ser possivel alterar a conta de outro usuario inexistente ERROR 404', async () => {
    const user = await request(app).patch(`/users/d06a7482-79c9-44cc-921e-30bb60928ac8`).send({ fullName:"teste" }).set("Authorization", `Bearer ${tokenLevelOneDefault}`)

    expect(user.status).toBe(404);
    expect(user.body).toHaveProperty("message");
  })

  test('PATCH /users - ATUALIZAR USUARIO - Não deve ser possivel atualizar para o mesmo email da conta ERROR 400', async () => {

    const user = await request(app).patch(`/users`).send({ email:process.env.DEFAULT_USER_EMAIL }).set("Authorization", `Bearer ${tokenLevelOneDefault}`)

    expect(user.status).toBe(400);
    expect(user.body).toHaveProperty("message");
  })

  test('PATCH /users - ATUALIZAR USUARIO - Não deve ser possivel atualizar para o email da conta de outro usuario ERROR 400', async () => {
    const user = await request(app).patch(`/users`).send({ email:"CreateLevelOneFirst@email.com" }).set("Authorization", `Bearer ${tokenLevelOneDefault}`)

    expect(user.status).toBe(400);
    expect(user.body).toHaveProperty("message");
  })

  test('PATCH /users - ATUALIZAR USUARIO - Deve ser possivel atualizar a sua propia conta caso não tenha password phone email, irá atualizar imediatamente SUCESS 200', async () => {
    const user = await request(app).patch(`/users`).send(mockedUpdateMyAccountiImmediate).set("Authorization", `Bearer ${tokenLevelOneDefault}`)

    expect(user.status).toBe(200);
    expect(user.body).toHaveProperty("message");
    responseSucessUser( user, "user" )
  })

  test('PATCH /users - ATUALIZAR USUARIO - Deve ser possivel ao atualizar dados como senha, telefone, email, colocar em espera somente esses dados para confirmação por código SUCESS 200', async () => {
    const user = await request(app).patch(`/users`).send(mockedUpdateMyAccountiImediateAndAwaiting).set("Authorization", `Bearer ${tokenLevelOneFirst}`)

    expect(user.status).toBe(200);
    responseSucessUser( user, "user" )
    expect(user.body.user.fullName).toEqual("CreateLevelOneFirstUpdated2");
    expect(user.body.user.email).toEqual("CreateLevelOneFirst@email.com");
    expect(user.body.user.phone).toEqual("5500911111111");
  })

  test('GET /users - SOLICITAR CÓDIGO - Deve ser possivel solicitar um código de confirmação de "email" LEVEL 3 UPDATE SUCESS 200', async () => {
    const user = await request(app).get(`/users/${idLevelOneFirst}/solicitation/code=email/update`).send()

    expect(user.status).toBe(200);
    expect(user.body).toHaveProperty("message");
  })

  test('POST /users - CONFIRMAR CÓDIGO - Deve ser possivel confirmar código de "email" LEVEL 3 UPDATE SUCESS 200', async () => {

    const code = await Repository.code.findOne({ where:{ user:{ id:idLevelOneFirst } }, relations:{ user:true } })

    const user = await request(app).post(`/users/${idLevelOneFirst}/confirm/code=email/update`).send({ code:code.codeEmail })

    expect(user.status).toBe(200);
    responseSucessUser( user, "user" )
  })

  test('GET /users - SOLICITAR CÓDIGO - Deve ser possivel solicitar um código de confirmação de "sms" LEVEL 3 UPDATE SUCESS 200', async () => {
    const user = await request(app).get(`/users/${idLevelOneFirst}/solicitation/code=sms/update`).send()

    expect(user.status).toBe(200);
    expect(user.body).toHaveProperty("message");
  })

  test('POST /users - CONFIRMAR CÓDIGO - Deve ser possivel confirmar código de "sms" LEVEL 3 UPDATE SUCESS 200', async () => {

    const code = await Repository.code.findOne({ where:{ user:{ id:idLevelOneFirst } }, relations:{ user:true } })

    const user = await request(app).post(`/users/${idLevelOneFirst}/confirm/code=sms/update`).send({ code:code.codeSMS })

    expect(user.status).toBe(200);
    responseSucessUser( user, "user" )
    expect(user.body.user.fullName).toEqual("CreateLevelOneFirstUpdated2");
    expect(user.body.user.email).toEqual("CreateLevelOneFirstUpdate@email.com");
    expect(user.body.user.phone).toEqual("5500955555555");
  })

  test('PATCH /users - ATUALIZAR USUARIO - Deve ser possivel usuario level 1 atualizar a conta de outros usuarios SUCESS 200', async () => {

    const user = await request(app).patch(`/users/${idLevelThreeThird}`).send(mockedUpdateOtherUserLevel3).set("Authorization", `Bearer ${tokenLevelOneFirst}`)

    expect(user.status).toBe(200);
    responseSucessUser( user, "user" )
    expect(user.body.user.fullName).toEqual("updateUserLevel3PerLevel1");
    expect(user.body.user.authorizationLevel).toEqual(1);
    expect(user.body.user.email).toEqual("CreateLevelTreeThird@email.com");
    expect(user.body.user.phone).toEqual("5500911111111");
  })

  test('GET /users - SOLICITAR CÓDIGO - Deve ser possivel solicitar um código de confirmação de "sms" atualização por meio do usuario LEVEL 1 UPDATE SUCESS 200', async () => {
    const user = await request(app).get(`/users/${idLevelThreeThird}/solicitation/code=sms/update`).send()

    expect(user.status).toBe(200);
    expect(user.body).toHaveProperty("message");
  })

  test('POST /users - CONFIRMAR CÓDIGO - Deve ser possivel confirmar código de "sms" atualização por meio do usuario LEVEL 1 UPDATE SUCESS 200', async () => {

    const code = await Repository.code.findOne({ where:{ user:{ id:idLevelThreeThird } }, relations:{ user:true } })

    const user = await request(app).post(`/users/${idLevelThreeThird}/confirm/code=sms/update`).send({ code:code.codeSMS })

    expect(user.status).toBe(200);
    responseSucessUser( user, "user" )
    expect(user.body.user.email).toEqual("updateUserLevel3PerLevel1@email.com");
    expect(user.body.user.phone).toEqual("5500933333333");
  })

  test('PATCH /users - ATUALIZAR USUARIO - Não deve ser possivel usuarios que não tem level 1 atualizarem o "email" ERROR 403', async () => {

    const user = await request(app).patch(`/users`).send(mockedUpdateMyEmailBeLevel3).set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

    expect(user.status).toBe(403);
    expect(user.body).toHaveProperty("message");
  })


  test('POST /session - INICIAR SESSÃO -  Não deve ser possivel iniciar uma sessão sem passar EMAIL e SENHA ERROR 400', async () => {
    const session = await request(app).post("/session").send({})

    expect(session.status).toBe(400)
    expect(session.body).toHaveProperty("message");
  })
  
  test('POST /session - INICIAR SESSÃO -  Não deve ser possivel iniciar uma sessão com SENHA inválida ERROR 401', async () => {
    const session = await request(app).post("/session").send(mockedSessionLevelOneFirstInvalidPassword)

    expect(session.status).toBe(401)
    expect(session.body).toHaveProperty("message");
  })

  test('POST /session - INICIAR SESSÃO -  Não deve ser possivel iniciar uma sessão com usuario inativo ERROR 401', async () => {
    const session = await request(app).post("/session").send(mockedSessionLevelTreeSecond)

    expect(session.status).toBe(401)
    expect(session.body).toHaveProperty("message");
  })


  test('POST /users - RECUPERAR CONTA - Não deve ser possivel solicitar um recuperação de um usuario que não exista ERROR 404', async () => {
    const retrieveAccount = await request(app).post("/users/retrieveAccount").send(mockedRetrieveNotFoundAccount)

    expect(retrieveAccount.status).toBe(404);
    expect(retrieveAccount.body).toHaveProperty("message");
  })

  test('POST /users - RECUPERAR CONTA - Não deve ser possivel solicitar um recuperação sem EMAIL e NEWPASSWORD ERROR 400', async () => {
    const retrieveAccount = await request(app).post("/users/retrieveAccount").send({})

    expect(retrieveAccount.status).toBe(400);
    expect(retrieveAccount.body).toHaveProperty("message");
  })

  test('POST /users - RECUPERAR CONTA - Deve ser possivel solicitar recuperação de conta SUCESS 200', async () => {
    const retrieveAccount = await request(app).post("/users/retrieveAccount").send(mockedRetrieveMyAccount)

    expect(retrieveAccount.status).toBe(200);
    expect(retrieveAccount.body).toHaveProperty("message");
  })

  test('GET /users - SOLICITAR CÓDIGO - Deve ser possivel solicitar um código de confirmação de "sms" RETRIEVE ACCOUNT SUCESS 200', async () => {
    const user = await request(app).get(`/users/${idLevelOneFirst}/solicitation/code=sms/retrieveAccount`).send()

    expect(user.status).toBe(200);
    expect(user.body).toHaveProperty("message");
  })

  test('POST /users - CONFIRMAR CÓDIGO - Deve ser possivel confirmar código de "sms" RETRIEVE ACCOUNT SUCESS 200', async () => {

    const code = await Repository.code.findOne({ where:{ user:{ id:idLevelOneFirst } }, relations:{ user:true } })

    const user = await request(app).post(`/users/${idLevelOneFirst}/confirm/code=sms/retrieveAccount`).send({ code:code.codeSMS })

    expect(user.status).toBe(200);
    responseSucessUser( user, "user" )
  })

  test('POST /session - INICIAR SESSÃO -  Deve ser possivel iniciar uma sessão com a nova senha apartir da recuperação de conta SUCESS 200', async () => {
    const session = await request(app).post("/session").send(mockedSessionLevelOneAfterRetrieveAccount)

    expect(session.status).toBe(200)
    expect(session.body).toHaveProperty("message");
    responseSucessUser( session, "user" )

    tokenLevelOneFirst = session.body.token
  })


  test('GET /users - LISTAR UNICO USUARIO - Não deve ser possivel listar com ou usuario com level 1 usando id invalido ERROR 400', async () => {
    const user = await request(app).get(`/users/asdas`).send().set("Authorization", `Bearer ${tokenLevelOneFirst}`)

    expect(user.status).toBe(400);
    expect(user.body).toHaveProperty("message");
  })

    test('GET /users - LISTAR UNICO USUARIO - Não deve ser possivel listar outro usuario sem ser LEVEL 1 ERROR 401', async () => {
      const user = await request(app).get(`/users/${idLevelOneFirst}`).send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

      expect(user.status).toBe(401);
      expect(user.body).toHaveProperty("message");
    })

  test('GET /users - LISTAR UNICO USUARIO - Não deve ser possivel listar um usuario que não existe ERROR 404', async () => {
    const user = await request(app).get(`/users/d06a7482-79c9-44cc-921e-30bb60928ac8`).send().set("Authorization", `Bearer ${tokenLevelOneFirst}`)

    expect(user.status).toBe(404);
    expect(user.body).toHaveProperty("message");
  })

  test('GET /users - LISTAR UNICO USUARIO - Deve ser possivel listar seu propio usuario SUCESS 200', async () => {
    const user = await request(app).get(`/users`).send().set("Authorization", `Bearer ${tokenLevelOneFirst}`)

    expect(user.status).toBe(200);
    responseSucessUser( user, "user" )
  })

  test('GET /users - LISTAR UNICO USUARIO - Deve ser possivel listar outro usuario como LEVEL 1 SUCESS 200', async () => {
    const user = await request(app).get(`/users/${idLevelThreeFirst}`).send().set("Authorization", `Bearer ${tokenLevelOneFirst}`)

    expect(user.status).toBe(200);
    responseSucessUser( user, "user" )
  })




  test('GET /users - LISTAR VARIOS USUARIOS - ADM - Não deve ser possivel listar não sendo LEVEL 1 SUCESS 401', async () => {
    const user = await request(app).get(`/users/all`).send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

    expect(user.status).toBe(401);
    expect(user.body).toHaveProperty("message");
  })

  test('GET /users - LISTAR VARIOS USUARIOS - ADM - Deve ser possivel listar todos os usuarios como LEVEL 1 SUCESS 200', async () => {
    const user = await request(app).get(`/users/all`).send().set("Authorization", `Bearer ${tokenLevelOneFirst}`)

    expect(user.status).toBe(200);
    expect(user.body).toHaveProperty("message")
    expect(user.body.users[0]).toHaveProperty("updatedAt")
    expect(user.body.users[0]).toHaveProperty("createdAt")
    expect(user.body.users[0]).toHaveProperty("authorizationLevel")
    expect(user.body.users[0]).toHaveProperty("phone")
    expect(user.body.users[0]).toHaveProperty("email")
    expect(user.body.users[0]).toHaveProperty("fullName")
    expect(user.body.users[0]).toHaveProperty("id")
  })
  



  test('DELETE /users - DESATIVAR USUARIO - ADM - Não deve ser possivel desativar outro usuaio caso não exista ERROR 404', async () => {
    const user = await request(app).delete(`/users/d06a7482-79c9-44cc-921e-30bb60928ac8`).send().set("Authorization", `Bearer ${tokenLevelOneFirst}`)

    expect(user.status).toBe(404);
    expect(user.body).toHaveProperty("message");
  })

  test('DELETE /users - DESATIVAR USUARIO - ADM - Não deve ser possivel desativar outro usuaio caso o usuario não seja LEVEL 1 ERROR 401', async () => {
    const user = await request(app).delete(`/users/${idLevelOneFirst}`).send().set("Authorization", `Bearer ${tokenLevelThreeFirst}`)

    expect(user.status).toBe(401);
    expect(user.body).toHaveProperty("message");
  })

  test('DELETE /users - DESATIVAR USUARIO - Deve ser possivel desativar outro usuario caso sejá LEVEL 1 SUCESS 200', async () => {
    const user = await request(app).delete(`/users/${idLevelThreeFirst}`).send().set("Authorization", `Bearer ${tokenLevelOneFirst}`)

    expect(user.status).toBe(200);
    expect(user.body).toHaveProperty("message");
  })

  test('DELETE /users - DESATIVAR USUARIO - Deve ser possivel desativar o propio usuario SUCESS 200', async () => {
    const user = await request(app).delete(`/users`).send().set("Authorization", `Bearer ${tokenLevelOneFirst}`)

    expect(user.status).toBe(200);
    expect(user.body).toHaveProperty("message");
  })
})
