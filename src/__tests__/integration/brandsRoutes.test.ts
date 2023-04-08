import AppDataSource from "../../data-source";
import request from "supertest";
import app from "../../app";
import {
  mockedSessionLevelOneDefault,
  mockedSessionLevelTreeFirst,
} from "../mocks/user.mocks";
import { mockedCreateCategory } from "../mocks/categories.mocks";
import { DataSource } from "typeorm";
import { initializationUserDefault } from "../../util/initialization.util";
import Repository from "../../util/repository.util";
import { mockedProduct } from "../mocks/products.mocks";
import {
  mockedCreateBrand,
  mockedCreateBrandForDelete,
} from "../mocks/brands.mocks";

describe("/brands", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => {
        connection = res;
      })
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    const user = {
      fullName: "teste",
      email: "CreateLevelTreeFirst@email.com",
      authorizationLevel: 3,
      password: "123",
      phone: "55" + "00988888888",
      isConfirmedEmail: true,
      isConfirmedPhone: true,
      isActive: true,
      isSolicitationCode: false,
    };

    const createdDefaultUser = Repository.users.create(user);
    await Repository.users.save(createdDefaultUser);

    await initializationUserDefault();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test("POST /brands - must be able to create a brand", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const response = await request(app)
      .post("/brands")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedCreateBrand);

    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("brand");
    expect(response.body.brand).toHaveProperty("id");
    expect(response.body.brand).toHaveProperty("name");
    expect(response.body.brand.name).toEqual("first brand");
    expect(response.body.message).toEqual("A marca foi criada com sucesso");
    expect(response.status).toEqual(201);
  });

  test("POST /brands - should not be able to create brand not being admin", async () => {
    const userLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelTreeFirst);
    const response = await request(app)
      .post("/brands")
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`)
      .send(mockedCreateBrand);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Deve ser um administrador");
    expect(response.status).toEqual(401);
  });

  test("POST /brands - should not be able to create a brand that already exists", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const response = await request(app)
      .post("/brands")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedCreateBrand);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("A marca já existe");
    expect(response.status).toBe(409);
  });

  test("POST /brands - should not be able to create a brand with invalid token", async () => {
    const response = await request(app)
      .post("/brands")
      .set("Authorization", `Bearer ${"asuhuashuhsauhsauh"}`)
      .send(mockedCreateCategory);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Token invalido");
    expect(response.status).toBe(401);
  });

  test("POST /brands - should not be able to create abrand without authorization", async () => {
    const response = await request(app).post("/brands").send(mockedCreateBrand);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Cabeçalhos de autorização ausentes");
    expect(response.status).toBe(401);
  });

  test("GET /brands - must be able to list brand", async () => {
    const response = await request(app).get("/brands");

    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("brands");
    expect(response.body.brands[0]).toHaveProperty("id");
    expect(response.body.brands[0]).toHaveProperty("name");
    expect(response.body.brands[0].name).toEqual("first brand");
    expect(response.body.message).toEqual("Marcas listadas com sucesso");
    expect(response.status).toEqual(200);
  });

  test("GET /brands/:id/products - must be able to list brands with products", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const createCategory = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedCreateCategory);

    const categories = await request(app).get("/categories");
    const brands = await request(app).get("/brands");

    mockedProduct.category = categories.body.categories[0].id;
    mockedProduct.brand = brands.body.brands[0].id;

    const product = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedProduct);

    const response = await request(app).get(
      `/brands/${brands.body.brands[0].id}/products`
    );

    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("productsDisponible");
    expect(response.body.productsDisponible[0]).toHaveProperty("id");
    expect(response.body.productsDisponible[0]).toHaveProperty("name");
    expect(response.body.productsDisponible[0]).toHaveProperty("description");
    expect(response.body.productsDisponible[0]).toHaveProperty("color");
    expect(response.body.productsDisponible[0]).toHaveProperty("size");
    expect(response.body.productsDisponible[0]).toHaveProperty("launchTime");
    expect(response.body.productsDisponible[0]).toHaveProperty("priceAll");
    expect(response.body.productsDisponible[0]).toHaveProperty("priceSeller");
    expect(response.body.productsDisponible[0]).toHaveProperty("priceService");
    expect(response.body.productsDisponible[0]).toHaveProperty(
      "percentageService"
    );
    expect(response.body.productsDisponible[0]).toHaveProperty("isSale");
    expect(response.body.productsDisponible[0]).toHaveProperty("salePrice");
    expect(response.body.productsDisponible[0]).toHaveProperty("status");
    expect(response.body.productsDisponible[0]).toHaveProperty("image_1");
    expect(response.body.productsDisponible[0]).toHaveProperty("image_2");
    expect(response.body.productsDisponible[0]).toHaveProperty("image_3");
    expect(response.body.productsDisponible[0]).toHaveProperty("brand");
    expect(response.body.productsDisponible[0]).toHaveProperty("category");
    expect(response.body.productsDisponible[0]).toHaveProperty("cart");
    expect(response.body.productsDisponible[0]).toHaveProperty("order");
    expect(response.status).toEqual(200);
  });

  test("DELETE /brands/:id - must be able to delete a brand", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const brandsForDelete = await request(app)
      .post("/brands")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedCreateBrandForDelete);

    const response = await request(app)
      .delete(`/brands/${brandsForDelete.body.brand.id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("A marca foi deletada com sucesso!");
    expect(response.status).toEqual(200);
  });

  test("DELETE /brands/:id - should not be able to delete brand not being admin", async () => {
    const userLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelTreeFirst);
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const brandForDelete = await request(app)
      .post("/brands")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedCreateBrandForDelete);

    const response = await request(app)
      .delete(`/brands/${brandForDelete.body.brand.id}`)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Deve ser um administrador");
    expect(response.status).toEqual(401);
  });

  test("DELETE /brands/:id - should not be able to delete brands with invalid id", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);

    const response = await request(app)
      .delete(`/brands/sauhsuahasusahusahuh`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Invalid id");
    expect(response.status).toEqual(404);
  });

  test("DELETE /brands/:id - should not be able to delete brand with invalid token", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const brandForDelete = await request(app)
      .get("/brands")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const response = await request(app)
      .delete(`/brands/${brandForDelete.body.brands[1].id}`)
      .set("Authorization", `Bearer ${"asdasdasdasddasdadsa"}`);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Token invalido");
    expect(response.status).toEqual(401);
  });

  test("DELETE /brands/:id - should not be able to delete brands without authorization", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const brandForDelete = await request(app)
      .get("/brands")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const response = await request(app).delete(
      `/brands/${brandForDelete.body.brands[1].id}`
    );

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Cabeçalhos de autorização ausentes");
    expect(response.status).toEqual(401);
  });

  test("PATCH /brands/:id - must be able to update brand", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const brandForUpdate = await request(app)
      .get("/brands")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const response = await request(app)
      .patch(`/brands/${brandForUpdate.body.brands[1].id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({ name: "brand atualizada" });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("A marca foi atualizada com sucesso");
    expect(response.body.updatedBrand).toHaveProperty("id");
    expect(response.body.updatedBrand).toHaveProperty("name");
    expect(response.body.updatedBrand.name).toEqual("brand atualizada");
    expect(response.status).toEqual(200);
  });

  test("PATCH /brands/:id - should not be able to update id field", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const categoryForUpdate = await request(app)
      .get("/brands")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const response = await request(app)
      .patch(`/brands/${categoryForUpdate.body.brands[1].id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({ id: "isnotpossible", name: "categoria atualizada" });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual(
      "Não é possivel atualizar o campo id"
    );
    expect(response.status).toEqual(400);
  });

  test("PATCH /brands/:id - should not be able to update brands not being admin", async () => {
    const userLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelTreeFirst);
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const categoryForUpdate = await request(app)
      .get("/brands")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const response = await request(app)
      .patch(`/brands/${categoryForUpdate.body.brands[1].id}`)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`)
      .send({ name: "brand atualizada" });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Deve ser um administrador");
    expect(response.status).toEqual(401);
  });

  test("PATCH /brands/:id - should not be able to update brands with invalid id", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);

    const response = await request(app)
      .patch(`/brands/sadjasuhdaiushdiuash`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({ name: "brand atualizada" });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Invalid id");
    expect(response.status).toEqual(404);
  });

  test("PATCH /brands/:id - should not be able to update brand with invalid token", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const brandForUpdate = await request(app)
      .get("/brands")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const response = await request(app)
      .patch(`/brands/${brandForUpdate.body.brands[1].id}`)
      .set("Authorization", `Bearer ${"asdasdadasdas"}`)
      .send({ name: "categoria atualizada" });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Token invalido");
    expect(response.status).toEqual(401);
  });

  test("PATCH /brands/:id - should not be able to update brands without authorization", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const brandForUpdate = await request(app)
      .get("/brands")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const response = await request(app)
      .patch(`/brands/${brandForUpdate.body.brands[1].id}`)
      .send({ name: "categoria atualizada" });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Cabeçalhos de autorização ausentes");
    expect(response.status).toEqual(401);
  });
});
