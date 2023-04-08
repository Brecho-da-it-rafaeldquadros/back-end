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
import {
  mockedCreatePreferenceForProductList,
  mockedProduct,
  mockedProductWithoutBrand,
  mockedProductWithoutCategory,
} from "../mocks/products.mocks";
import { mockedCreatePreference } from "../mocks/preference.mocks";

describe("/products", () => {
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

  test("POST /products - must be able to create a products", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const createBrand = await request(app)
      .post("/brands")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({ name: "brand Test" });
    const createCategory = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedCreateCategory);

    const categories = await request(app).get("/categories");
    const brands = await request(app).get("/brands");
    mockedProduct.category = categories.body.categories[0].id;
    mockedProduct.brand = brands.body.brands[0].id;
    const response = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedProduct);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Produto criada com sucesso");
    expect(response.body).toHaveProperty("product");
    expect(response.body.product).toHaveProperty("createdAt");
    expect(response.body.product).toHaveProperty("updatedAt");
    expect(response.body.product).toHaveProperty("id");
    expect(response.body.product).toHaveProperty("name");
    expect(response.body.product).toHaveProperty("description");
    expect(response.body.product).toHaveProperty("color");
    expect(response.body.product).toHaveProperty("size");
    expect(response.body.product).toHaveProperty("launchTime");
    expect(response.body.product).toHaveProperty("priceAll");
    expect(response.body.product).toHaveProperty("priceSeller");
    expect(response.body.product).toHaveProperty("priceService");
    expect(response.body.product).toHaveProperty("percentageService");
    expect(response.body.product).toHaveProperty("isSale");
    expect(response.body.product).toHaveProperty("salePrice");
    expect(response.body.product).toHaveProperty("status");
    expect(response.body.product).toHaveProperty("image_1");
    expect(response.body.product).toHaveProperty("image_2");
    expect(response.body.product).toHaveProperty("image_3");
    expect(response.body.product).toHaveProperty("brand");
    expect(response.body.product.brand).toHaveProperty("id");
    expect(response.body.product.brand).toHaveProperty("name");
    expect(response.body.product.brand).toHaveProperty("sizeTable");
    expect(response.body.product).toHaveProperty("category");
    expect(response.body.product.category).toHaveProperty("id");
    expect(response.body.product.category).toHaveProperty("name");
    expect(response.body.product).toHaveProperty("cart");
    expect(response.body.product).toHaveProperty("order");
    expect(response.status).toEqual(201);
  });

  test("POST /products - It should not be possible to create a product without a category", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const createBrand = await request(app)
      .post("/brands")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({ name: "brand Test" });

    const categories = await request(app).get("/categories");
    const brands = await request(app).get("/brands");
    mockedProductWithoutCategory.brand = brands.body.brands[0].id;
    const response = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedProductWithoutCategory);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message[0]).toEqual("Deve conter o campo category");
    expect(response.status).toEqual(400);
  });

  test("POST /products - It should not be possible to create a product without a category", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);

    const categories = await request(app).get("/categories");
    mockedProductWithoutBrand.category = categories.body.categories[0].id;

    const response = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedProductWithoutCategory);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message[0]).toEqual("Deve conter o campo category");
    expect(response.status).toEqual(400);
  });

  test("POST /products - It should not be possible to create a product without a name", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);

    const categories = await request(app).get("/categories");
    const brands = await request(app).get("/brands");
    mockedProduct.category = categories.body.categories[0].id;
    mockedProduct.brand = brands.body.brands[0].id;
    const { name, ...product } = mockedProduct;
    const response = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(product);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message[0]).toEqual("Deve conter o nome do produto");
    expect(response.status).toEqual(400);
  });

  test("POST /products - It should not be possible to create a product without a description", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);

    const categories = await request(app).get("/categories");
    const brands = await request(app).get("/brands");
    mockedProduct.category = categories.body.categories[0].id;
    mockedProduct.brand = brands.body.brands[0].id;
    const { description, ...product } = mockedProduct;
    const response = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(product);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message[0]).toEqual("Deve conter o campo description");
    expect(response.status).toEqual(400);
  });

  test("POST /products - It should not be possible to create a product without a color", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);

    const categories = await request(app).get("/categories");
    const brands = await request(app).get("/brands");
    mockedProduct.category = categories.body.categories[0].id;
    mockedProduct.brand = brands.body.brands[0].id;
    const { color, ...product } = mockedProduct;
    const response = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(product);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message[0]).toEqual("Deve conter o campo color");
    expect(response.status).toEqual(400);
  });

  test("POST /products - It should not be possible to create a product without a launchTime", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);

    const categories = await request(app).get("/categories");
    const brands = await request(app).get("/brands");
    mockedProduct.category = categories.body.categories[0].id;
    mockedProduct.brand = brands.body.brands[0].id;
    const { launchTime, ...product } = mockedProduct;
    const response = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(product);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message[0]).toEqual("Deve conter o campo launchTime");
    expect(response.status).toEqual(400);
  });

  test("POST /products - It should not be possible to create a product without a priceSeller", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);

    const categories = await request(app).get("/categories");
    const brands = await request(app).get("/brands");
    mockedProduct.category = categories.body.categories[0].id;
    mockedProduct.brand = brands.body.brands[0].id;
    const { priceSeller, ...product } = mockedProduct;
    const response = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(product);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message[0]).toEqual("Deve conter o campo priceSeller");
    expect(response.status).toEqual(400);
  });

  test("POST /products - should not be able to create product not being admin", async () => {
    const userLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelTreeFirst);
    const response = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`)
      .send(mockedCreateCategoryWithoutAuthorization);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Deve ser um administrador");
    expect(response.status).toEqual(401);
  });

  test("POST /products - should not be able to create a product with invalid token", async () => {
    const response = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${"asuhuashuhsauhsauh"}`)
      .send(mockedProduct);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Token invalido");
    expect(response.status).toBe(401);
  });

  test("POST /products - should not be able to create a product without authorization", async () => {
    const response = await request(app).post("/products").send(mockedProduct);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Cabeçalhos de autorização ausentes");
    expect(response.status).toBe(401);
  });

  test("GET /products - must be able to list products", async () => {
    const response = await request(app).get("/products");

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Produtos listados com sucesso");
    expect(response.body).toHaveProperty("nextPage");
    expect(response.body).toHaveProperty("currentPage");
    expect(response.body).toHaveProperty("previousPage");
    expect(response.body).toHaveProperty("amountPage");
    expect(response.body).toHaveProperty("howManyFetched");
    expect(response.body).toHaveProperty("result");
    expect(response.body.result[0]).toHaveProperty("createdAt");
    expect(response.body.result[0]).toHaveProperty("updatedAt");
    expect(response.body.result[0]).toHaveProperty("id");
    expect(response.body.result[0]).toHaveProperty("name");
    expect(response.body.result[0]).toHaveProperty("description");
    expect(response.body.result[0]).toHaveProperty("color");
    expect(response.body.result[0]).toHaveProperty("size");
    expect(response.body.result[0]).toHaveProperty("launchTime");
    expect(response.body.result[0]).toHaveProperty("priceAll");
    expect(response.body.result[0]).toHaveProperty("priceSeller");
    expect(response.body.result[0]).toHaveProperty("priceService");
    expect(response.body.result[0]).toHaveProperty("percentageService");
    expect(response.body.result[0]).toHaveProperty("isSale");
    expect(response.body.result[0]).toHaveProperty("salePrice");
    expect(response.body.result[0]).toHaveProperty("status");
    expect(response.body.result[0]).toHaveProperty("image_1");
    expect(response.body.result[0]).toHaveProperty("image_2");
    expect(response.body.result[0]).toHaveProperty("image_3");
    expect(response.body.result[0]).toHaveProperty("brand");
    expect(response.body.result[0].brand).toHaveProperty("id");
    expect(response.body.result[0].brand).toHaveProperty("name");
    expect(response.body.result[0].brand).toHaveProperty("sizeTable");
    expect(response.body.result[0]).toHaveProperty("category");
    expect(response.body.result[0].category).toHaveProperty("id");
    expect(response.body.result[0].category).toHaveProperty("name");
    expect(response.body.result[0]).toHaveProperty("cart");
    expect(response.body.result[0]).toHaveProperty("order");
    expect(response.status).toEqual(200);
  });

  test("GET /products/preferences - must be able to list products with preferences", async () => {
    const userLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelTreeFirst);
    const categories = await request(app).get("/categories");
    const brand = await request(app).get("/brands");
    mockedCreatePreferenceForProductList.category =
      categories.body.categories[0].name;
    mockedCreatePreferenceForProductList.brand = brand.body.brands[0].name;
    const preference = await request(app)
      .post("/preference")
      .send(mockedCreatePreferenceForProductList)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);

    const response = await request(app)
      .get("/products/preferences")
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual(
      "Produtos preferidos listados com sucesso"
    );
    expect(response.body).toHaveProperty("nextPage");
    expect(response.body).toHaveProperty("currentPage");
    expect(response.body).toHaveProperty("previousPage");
    expect(response.body).toHaveProperty("amountPage");
    expect(response.body).toHaveProperty("howManyFetched");
    expect(response.body).toHaveProperty("result");
    expect(response.body.result[0]).toHaveProperty("createdAt");
    expect(response.body.result[0]).toHaveProperty("updatedAt");
    expect(response.body.result[0]).toHaveProperty("id");
    expect(response.body.result[0]).toHaveProperty("name");
    expect(response.body.result[0]).toHaveProperty("description");
    expect(response.body.result[0]).toHaveProperty("color");
    expect(response.body.result[0].color).toEqual("Red");
    expect(response.body.result[0]).toHaveProperty("size");
    expect(response.body.result[0].size).toEqual("P");
    expect(response.body.result[0]).toHaveProperty("launchTime");
    expect(response.body.result[0]).toHaveProperty("priceAll");
    expect(response.body.result[0]).toHaveProperty("priceSeller");
    expect(response.body.result[0]).toHaveProperty("priceService");
    expect(response.body.result[0]).toHaveProperty("percentageService");
    expect(response.body.result[0]).toHaveProperty("isSale");
    expect(response.body.result[0]).toHaveProperty("salePrice");
    expect(response.body.result[0]).toHaveProperty("status");
    expect(response.body.result[0]).toHaveProperty("image_1");
    expect(response.body.result[0]).toHaveProperty("image_2");
    expect(response.body.result[0]).toHaveProperty("image_3");
    expect(response.body.result[0]).toHaveProperty("brand");
    expect(response.body.result[0].brand).toHaveProperty("id");
    expect(response.body.result[0].brand).toHaveProperty("name");
    expect(response.body.result[0].brand).toHaveProperty("sizeTable");
    expect(response.body.result[0]).toHaveProperty("category");
    expect(response.body.result[0].category).toHaveProperty("id");
    expect(response.body.result[0].category).toHaveProperty("name");
    expect(response.body.result[0]).toHaveProperty("cart");
    expect(response.body.result[0]).toHaveProperty("order");
    expect(response.status).toEqual(200);
  });

  test("GET /products/preferences - should not be able to list products preferences with a invalid token", async () => {
    const response = await request(app)
      .get("/products/preferences")
      .set("Authorization", `Bearer ${"asdasduhsaudhasdu"}`);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Token invalido");

    expect(response.status).toEqual(401);
  });

  test("GET /products/preferences - should not be able to list products without authorization", async () => {
    const response = await request(app).get("/products/preferences");

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Cabeçalhos de autorização ausentes");

    expect(response.status).toEqual(401);
  });

  test("GET /products/admin - should not be able to list products without authorization", async () => {
    const response = await request(app).get("/products/admin");

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Cabeçalhos de autorização ausentes");

    expect(response.status).toEqual(401);
  });

  test("GET /products/admin - must be able to list products admin", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);

    const response = await request(app)
      .get("/products/admin")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Produtos listados com sucesso");
    expect(response.body).toHaveProperty("products");
    expect(response.body.products[0]).toHaveProperty("createdAt");
    expect(response.body.products[0]).toHaveProperty("updatedAt");
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
    expect(response.body.products[0].brand).toHaveProperty("id");
    expect(response.body.products[0].brand).toHaveProperty("name");
    expect(response.body.products[0].brand).toHaveProperty("sizeTable");
    expect(response.body.products[0]).toHaveProperty("category");
    expect(response.body.products[0].category).toHaveProperty("id");
    expect(response.body.products[0].category).toHaveProperty("name");
    expect(response.body.products[0]).toHaveProperty("cart");
    expect(response.body.products[0]).toHaveProperty("order");
    expect(response.status).toEqual(200);
  });

  test("GET /products/admin - should not be able to list products not being admin", async () => {
    const userLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelTreeFirst);

    const response = await request(app)
      .get("/products/admin")
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Deve ser um administrador");

    expect(response.status).toEqual(401);
  });

  test("GET /products/admin - should not be able to list products with a invalid token", async () => {
    const response = await request(app)
      .get("/products/admin")
      .set("Authorization", `Bearer ${"asdasduhsaudhasdu"}`);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Token invalido");

    expect(response.status).toEqual(401);
  });

  test("GET /products/admin - should not be able to list products without authorization", async () => {
    const response = await request(app).get("/products/admin");

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Cabeçalhos de autorização ausentes");

    expect(response.status).toEqual(401);
  });

  test("DELETE /products/:id - should not be able to delete product not being admin", async () => {
    const userLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelTreeFirst);
    const productForDelete = await request(app).get("/products");

    const response = await request(app)
      .delete(`/products/${productForDelete.body.result[0].id}`)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Deve ser um administrador");
    expect(response.status).toEqual(401);
  });

  test("DELETE /products/:id - should not be able to delete product with invalid token", async () => {
    const userLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelTreeFirst);
    const productForDelete = await request(app).get("/products");

    const response = await request(app)
      .delete(`/products/${productForDelete.body.result[0].id}`)
      .set("Authorization", `Bearer ${"sadsadasdsads"}`);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Token invalido");
    expect(response.status).toEqual(401);
  });

  test("DELETE /products/:id - should not be able to delete product with invalid id", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const productForDelete = await request(app).get("/products");

    const response = await request(app)
      .delete(`/products/${"sdsadasd"}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Invalid id");
    expect(response.status).toEqual(404);
  });

  test("DELETE /products/:id - should not be able to delete product with product dont exist", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);

    const response = await request(app)
      .delete(`/products/${"ac302d14-345e-4f23-9e0f-b43d4e3d75da"}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Este produto não existe");
    expect(response.status).toEqual(404);
  });

  test("DELETE /products/:id - should not be able to delete product without authorization", async () => {
    const productForDelete = await request(app).get("/products");

    const response = await request(app).delete(
      `/products/${productForDelete.body.result[0].id}`
    );

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Cabeçalhos de autorização ausentes");
    expect(response.status).toEqual(401);
  });

  test("DELETE /products/:id - must be able to delete a products", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const productForDelete = await request(app).get("/products");

    const response = await request(app)
      .delete(`/products/${productForDelete.body.result[0].id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual(
      "O produto foi deletado com sucesso!"
    );
    expect(response.status).toEqual(200);
  });

  test("PATCH /product/:id - must be able to update product name", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const categories = await request(app).get("/categories");
    const brands = await request(app).get("/brands");
    mockedProduct.category = categories.body.categories[0].id;
    mockedProduct.brand = brands.body.brands[0].id;
    const product = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedProduct);

    const response = await request(app)
      .patch(`/products/${product.body.product.id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({ name: "Nome atualizado" });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Produto atualizado com sucesso");
    expect(response.body.updatedProduct.name).toEqual("Nome atualizado");
    expect(response.status).toEqual(200);
  });

  test("PATCH /product/:id - must be able to update product description", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const product = await request(app).get("/products");

    const response = await request(app)
      .patch(`/products/${product.body.result[0].id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({ description: "Descrição atualizada" });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Produto atualizado com sucesso");
    expect(response.body.updatedProduct.description).toEqual(
      "Descrição atualizada"
    );
    expect(response.status).toEqual(200);
  });

  test("PATCH /product/:id - must be able to update product color", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const product = await request(app).get("/products");

    const response = await request(app)
      .patch(`/products/${product.body.result[0].id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({ color: "Cor atualizada" });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Produto atualizado com sucesso");
    expect(response.body.updatedProduct.color).toEqual("Cor atualizada");
    expect(response.status).toEqual(200);
  });

  test("PATCH /product/:id - must be able to update the product price and receive automatic tolls (price < 300)", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const product = await request(app).get("/products");

    const response = await request(app)
      .patch(`/products/${product.body.result[0].id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({ priceSeller: 100 });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Produto atualizado com sucesso");
    expect(response.body.updatedProduct.priceSeller).toEqual(100);
    expect(response.body.updatedProduct.priceAll).toEqual(125);
    expect(response.body.updatedProduct.priceService).toEqual(25);
    expect(response.body.updatedProduct.percentageService).toEqual(25);
    expect(response.status).toEqual(200);
  });

  test("PATCH /product/:id - must be able to update the product price and receive automatic tolls (price > 300)", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const product = await request(app).get("/products");

    const response = await request(app)
      .patch(`/products/${product.body.result[0].id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({ priceSeller: 500 });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Produto atualizado com sucesso");
    expect(response.body.updatedProduct.priceSeller).toEqual(500);
    expect(response.body.updatedProduct.priceAll).toEqual(600);
    expect(response.body.updatedProduct.priceService).toEqual(100);
    expect(response.body.updatedProduct.percentageService).toEqual(20);
    expect(response.status).toEqual(200);
  });

  test("PATCH /product/:id - must be able to update the product price and receive automatic tolls (price > 1000)", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const product = await request(app).get("/products");

    const response = await request(app)
      .patch(`/products/${product.body.result[0].id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({ priceSeller: 1100 });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Produto atualizado com sucesso");
    expect(response.body.updatedProduct.priceSeller).toEqual(1100);
    expect(response.body.updatedProduct.priceAll).toEqual(1298);
    expect(response.body.updatedProduct.priceService).toEqual(198);
    expect(response.body.updatedProduct.percentageService).toEqual(18);
    expect(response.status).toEqual(200);
  });

  test("PATCH /product/:id - must be able to update the product price and porcentage service receive automatic price seller ", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const product = await request(app).get("/products");

    const response = await request(app)
      .patch(`/products/${product.body.result[0].id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({ priceSeller: 1000, percentageService: 50 });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Produto atualizado com sucesso");
    expect(response.body.updatedProduct.priceSeller).toEqual(1000);
    expect(response.body.updatedProduct.priceAll).toEqual(1500);
    expect(response.body.updatedProduct.priceService).toEqual(500);
    expect(response.body.updatedProduct.percentageService).toEqual(50);
    expect(response.status).toEqual(200);
  });

  test("PATCH /product/:id - must be able to update product size", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const product = await request(app).get("/products");

    const response = await request(app)
      .patch(`/products/${product.body.result[0].id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({ size: "Tamanho atualizado" });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Produto atualizado com sucesso");
    expect(response.body.updatedProduct.size).toEqual("Tamanho atualizado");
    expect(response.status).toEqual(200);
  });

  test("PATCH /product/:id - must be able to update product category", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const product = await request(app).get("/products");
    const category = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({ name: "Categoria atualizada" });

    const response = await request(app)
      .patch(`/products/${product.body.result[0].id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({ category: `${category.body.category.id}` });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Produto atualizado com sucesso");
    expect(response.body.updatedProduct.category.name).toEqual(
      "Categoria atualizada"
    );
    expect(response.status).toEqual(200);
  });

  test("PATCH /product/:id - must be able to update product brand", async () => {
    const adminLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelOneDefault);
    const product = await request(app).get("/products");
    const brand = await request(app)
      .post("/brands")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({ name: "Marca atualizada" });

    const response = await request(app)
      .patch(`/products/${product.body.result[0].id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({ brand: `${brand.body.brand.id}` });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Produto atualizado com sucesso");
    expect(response.body.updatedProduct.brand.name).toEqual("Marca atualizada");
    expect(response.status).toEqual(200);
  });

  test("PATCH /product/:id -  should not be able to update product name not being admin", async () => {
    const userLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelTreeFirst);
    const product = await request(app).get("/products");

    const response = await request(app)
      .patch(`/products/${product.body.result[0].id}`)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`)
      .send({ name: "Nome atualizado" });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Deve ser um administrador");
    expect(response.status).toEqual(401);
  });

  test("PATCH /product/:id -  should not be able to update product description not being admin", async () => {
    const userLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelTreeFirst);
    const product = await request(app).get("/products");

    const response = await request(app)
      .patch(`/products/${product.body.result[0].id}`)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`)
      .send({ description: "Descrição atualizado" });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Deve ser um administrador");
    expect(response.status).toEqual(401);
  });

  test("PATCH /product/:id -  should not be able to update product color not being admin", async () => {
    const userLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelTreeFirst);
    const product = await request(app).get("/products");

    const response = await request(app)
      .patch(`/products/${product.body.result[0].id}`)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`)
      .send({ color: "Descrição atualizado" });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Deve ser um administrador");
    expect(response.status).toEqual(401);
  });

  test("PATCH /product/:id -  should not be able to update product priceSeller without authorization", async () => {
    const userLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelTreeFirst);
    const product = await request(app).get("/products");

    const response = await request(app)
      .patch(`/products/${product.body.result[0].id}`)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`)
      .send({ priceSeller: 100 });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Deve ser um administrador");
    expect(response.status).toEqual(401);
  });

  test("PATCH /product/:id -  should not be able to update product size not being admin", async () => {
    const userLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelTreeFirst);
    const product = await request(app).get("/products");

    const response = await request(app)
      .patch(`/products/${product.body.result[0].id}`)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`)
      .send({ size: "Descrição atualizado" });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Deve ser um administrador");
    expect(response.status).toEqual(401);
  });

  test("PATCH /product/:id -  should not be able to update product category not being admin", async () => {
    const userLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelTreeFirst);
    const product = await request(app).get("/products");
    const category = await request(app).get("/categories");

    const response = await request(app)
      .patch(`/products/${product.body.result[0].id}`)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`)
      .send({ category: `${category.body.categories[0].id}` });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Deve ser um administrador");
    expect(response.status).toEqual(401);
  });

  test("PATCH /product/:id -  should not be able to update product brand not being admin", async () => {
    const userLoginResponse = await request(app)
      .post("/session")
      .send(mockedSessionLevelTreeFirst);
    const product = await request(app).get("/products");
    const brand = await request(app).get("/brands");

    const response = await request(app)
      .patch(`/products/${product.body.result[0].id}`)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`)
      .send({ brand: `${brand.body.brands[0].id}` });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Deve ser um administrador");
    expect(response.status).toEqual(401);
  });

  test("PATCH /product/:id -  should not be able to update product name without authorization", async () => {
    const product = await request(app).get("/products");

    const response = await request(app)
      .patch(`/products/${product.body.result[0].id}`)
      .send({ name: `Not possible` });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Cabeçalhos de autorização ausentes");
    expect(response.status).toEqual(401);
  });

  test("PATCH /product/:id -  should not be able to update product description without authorization", async () => {
    const product = await request(app).get("/products");

    const response = await request(app)
      .patch(`/products/${product.body.result[0].id}`)
      .send({ description: `Not possible` });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Cabeçalhos de autorização ausentes");
    expect(response.status).toEqual(401);
  });

  test("PATCH /product/:id -  should not be able to update product color without authorization", async () => {
    const product = await request(app).get("/products");

    const response = await request(app)
      .patch(`/products/${product.body.result[0].id}`)
      .send({ color: `Not possible` });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Cabeçalhos de autorização ausentes");
    expect(response.status).toEqual(401);
  });

  test("PATCH /product/:id -  should not be able to update product priceSeller without authorization", async () => {
    const product = await request(app).get("/products");

    const response = await request(app)
      .patch(`/products/${product.body.result[0].id}`)
      .send({ priceSeller: `Not possible` });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Cabeçalhos de autorização ausentes");
    expect(response.status).toEqual(401);
  });

  test("PATCH /product/:id -  should not be able to update product size without authorization", async () => {
    const product = await request(app).get("/products");

    const response = await request(app)
      .patch(`/products/${product.body.result[0].id}`)
      .send({ size: `Not possible` });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Cabeçalhos de autorização ausentes");
    expect(response.status).toEqual(401);
  });

  test("PATCH /product/:id -  should not be able to update product category without authorization", async () => {
    const product = await request(app).get("/products");

    const response = await request(app)
      .patch(`/products/${product.body.result[0].id}`)
      .send({ category: `Not possible` });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Cabeçalhos de autorização ausentes");
    expect(response.status).toEqual(401);
  });

  test("PATCH /product/:id -  should not be able to update product brand without authorization", async () => {
    const product = await request(app).get("/products");

    const response = await request(app)
      .patch(`/products/${product.body.result[0].id}`)
      .send({ brand: `Not possible` });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Cabeçalhos de autorização ausentes");
    expect(response.status).toEqual(401);
  });
});
