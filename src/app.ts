import "reflect-metadata";
import "express-async-errors";

import cors from "cors";

import express from "express";

import handleErrorMiddleware from "./middlewares/handleError.middleware";
import { sessionRouter, usersRouter } from "./routes/users.routes";
import { categoriesRouter } from "./routes/categories.routes";
import { ordersRouter } from "./routes/orders.routes";
import { productsRouter } from "./routes/products.routes";
import { cartRouter } from "./routes/bag.routes";
import { preferenceRouter } from "./routes/preferences.routes";
import { bankDataRouter } from "./routes/bankData.routes";
import { addressRouter } from "./routes/address.routes";
import { brandsRouter } from "./routes/brands.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/session", sessionRouter);
app.use("/users", usersRouter);
app.use("/address", addressRouter);
app.use("/bankData", bankDataRouter);
app.use("/preference", preferenceRouter);

app.use("/categories", categoriesRouter);
app.use("/orders", ordersRouter);
app.use("/products", productsRouter);
app.use("/bag", cartRouter);
app.use("/brands", brandsRouter);
app.use(handleErrorMiddleware);

export default app;
