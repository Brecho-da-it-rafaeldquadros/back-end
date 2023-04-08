import AppDataSource from "../../data-source";
import request from "supertest";
import app from "../../app";
import {
  mockedSessionLevelOneDefault,
  mockedSessionLevelTreeFirst,
} from "../mocks/user.mocks";
import {
  mockedCreateCategory,
  mockedCreateCategoryForDelete,
  mockedCreateCategoryWithoutAuthorization,
} from "../mocks/categories.mocks";
import { DataSource } from "typeorm";
import { initializationUserDefault } from "../../util/initialization.util";
import Repository from "../../util/repository.util";
import { mockedProduct } from "../mocks/products.mocks";

describe("/categories", () => {
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

  test("POST /categories - must be able to create a categories", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const response = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedCreateCategory);

    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("category");
    expect(response.body.category).toHaveProperty("id");
    expect(response.body.category).toHaveProperty("name");
    expect(response.body.category.name).toEqual("first category");
    expect(response.body.message).toEqual("Categoria criada com sucesso");
    expect(response.status).toEqual(201);
  });

  test("POST /categories - should not be able to create category not being admin", async () => {
    const userLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelTreeFirst);
    const response = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`)
      .send(mockedCreateCategoryWithoutAuthorization);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Deve ser um administrador");
    expect(response.status).toEqual(401);
  });

  test("POST /categories - should not be able to create a category that already exists", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const response = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedCreateCategory);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Categoria já existe");
    expect(response.status).toBe(409);
  });

  test("POST /categories - should not be able to create a category with invalid token", async () => {
    const response = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${"asuhuashuhsauhsauh"}`)
      .send(mockedCreateCategory);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Token invalido");
    expect(response.status).toBe(401);
  });

  test("POST /categories - should not be able to create a category without authorization", async () => {
    const response = await request(app)
      .post("/categories")
      .send(mockedCreateCategory);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Cabeçalhos de autorização ausentes");
    expect(response.status).toBe(401);
  });

  test("GET /categories - must be able to list categories", async () => {
    const response = await request(app).get("/categories");

    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("categories");
    expect(response.body.categories[0]).toHaveProperty("id");
    expect(response.body.categories[0]).toHaveProperty("name");
    expect(response.body.categories[0].name).toEqual("first category");
    expect(response.body.message).toEqual("Categorias listadas com sucesso");
    expect(response.status).toEqual(200);
  });

  test("GET /categories/:id/products - must be able to list category with products", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const createBrand = await request(app)
      .post("/brands")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({ name: "brand Test" });

    const categories = await request(app).get("/categories");
    const brands = await request(app).get("/brands");
    mockedProduct.category = categories.body.categories[0].id;
    mockedProduct.brand = brands.body.brands[0].id;
    const product = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedProduct);

    const response = await request(app).get(
      `/categories/${categories.body.categories[0].id}/products`
    );

    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("products");
    expect(response.body.products[0]).toHaveProperty("id");
    expect(response.body.products[0]).toHaveProperty("name");
    expect(response.body.products[0]).toHaveProperty("description");
    expect(response.body.products[0]).toHaveProperty("color");
    expect(response.body.products[0]).toHaveProperty("size");
    expect(response.body.products[0]).toHaveProperty("launchTime");
    expect(response.body.products[0]).toHaveProperty("priceAll");
    expect(response.body.products[0]).toHaveProperty("priceSeller");
    expect(response.body.products[0]).toHaveProperty("priceService");
    expect(response.body.products[0]).toHaveProperty("percentageService");
    expect(response.body.products[0]).toHaveProperty("isSale");
    expect(response.body.products[0]).toHaveProperty("salePrice");
    expect(response.body.products[0]).toHaveProperty("status");
    expect(response.body.products[0]).toHaveProperty("image_1");
    expect(response.body.products[0]).toHaveProperty("image_2");
    expect(response.body.products[0]).toHaveProperty("image_3");
    expect(response.body.products[0]).toHaveProperty("brand");
    expect(response.body.products[0]).toHaveProperty("category");
    expect(response.body.products[0]).toHaveProperty("cart");
    expect(response.body.products[0]).toHaveProperty("order");
    expect(response.status).toEqual(200);
  });

  test("DELETE /categories/:id - must be able to delete a categories", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const categoryForDelete = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedCreateCategoryForDelete);

    const response = await request(app)
      .delete(`/categories/${categoryForDelete.body.category.id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual(
      "A categoria foi deletada com sucesso!"
    );
    expect(response.status).toEqual(200);
  });

  test("DELETE /categories/:id - should not be able to delete categories not being admin", async () => {
    const userLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelTreeFirst);
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const categoryForDelete = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedCreateCategoryForDelete);

    const response = await request(app)
      .delete(`/categories/${categoryForDelete.body.category.id}`)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Deve ser um administrador");
    expect(response.status).toEqual(401);
  });

  test("DELETE /categories/:id - should not be able to delete categories with invalid id", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);

    const response = await request(app)
      .delete(`/categories/sauhsuahasusahusahuh`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Invalid id");
    expect(response.status).toEqual(404);
  });

  test("DELETE /categories/:id - should not be able to delete categories with invalid token", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const categoryForDelete = await request(app)
      .get("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const response = await request(app)
      .delete(`/categories/${categoryForDelete.body.categories[1].id}`)
      .set("Authorization", `Bearer ${"asdasdasdasddasdadsa"}`);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Token invalido");
    expect(response.status).toEqual(401);
  });

  test("DELETE /categories/:id - should not be able to delete categories without authorization", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const categoryForDelete = await request(app)
      .get("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const response = await request(app).delete(
      `/categories/${categoryForDelete.body.categories[1].id}`
    );

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Cabeçalhos de autorização ausentes");
    expect(response.status).toEqual(401);
  });

  test("PATCH /categories/:id - must be able to update category", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const categoryForUpdate = await request(app)
      .get("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const response = await request(app)
      .patch(`/categories/${categoryForUpdate.body.categories[1].id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({ name: "categoria atualizada" });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Categoria atualizada com sucesso");
    expect(response.body.updatedCategory).toHaveProperty("id");
    expect(response.body.updatedCategory).toHaveProperty("name");
    expect(response.body.updatedCategory.name).toEqual("categoria atualizada");
    expect(response.status).toEqual(200);
  });

  test("PATCH /categories/:id - should not be able to update id field", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const categoryForUpdate = await request(app)
      .get("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const response = await request(app)
      .patch(`/categories/${categoryForUpdate.body.categories[1].id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({ id: "isnotpossible", name: "categoria atualizada" });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual(
      "Não é possivel atualizar o campo id"
    );
    expect(response.status).toEqual(400);
  });

  test("PATCH /categories/:id - should not be able to update categories not being admin", async () => {
    const userLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelTreeFirst);
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const categoryForUpdate = await request(app)
      .get("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const response = await request(app)
      .patch(`/categories/${categoryForUpdate.body.categories[1].id}`)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`)
      .send({ name: "categoria atualizada" });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Deve ser um administrador");
    expect(response.status).toEqual(401);
  });

  test("PATCH /categories/:id - should not be able to update categories with invalid id", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);

    const response = await request(app)
      .patch(`/categories/sadjasuhdaiushdiuash`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({ name: "categoria atualizada" });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Invalid id");
    expect(response.status).toEqual(404);
  });

  test("PATCH /categories/:id - should not be able to update categories with invalid token", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const categoryForUpdate = await request(app)
      .get("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const response = await request(app)
      .patch(`/categories/${categoryForUpdate.body.categories[1].id}`)
      .set("Authorization", `Bearer ${"asdasdadasdas"}`)
      .send({ name: "categoria atualizada" });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Token invalido");
    expect(response.status).toEqual(401);
  });

  test("PATCH /categories/:id - should not be able to update categories without authorization", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const categoryForUpdate = await request(app)
      .get("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const response = await request(app)
      .patch(`/categories/${categoryForUpdate.body.categories[1].id}`)
      .send({ name: "categoria atualizada" });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Cabeçalhos de autorização ausentes");
    expect(response.status).toEqual(401);
  });
});
