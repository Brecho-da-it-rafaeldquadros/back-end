import { Router } from "express";
import createCategoriesController from "../controller/categories/createCategory.controller";
import deleteCategoryController from "../controller/categories/deleteCategory.controller";
import listCategoriesController from "../controller/categories/listCategories.controller";
import listCategoryProductsController from "../controller/categories/listCategoryProducts.controller";
import updateCategoryController from "../controller/categories/updateCategory.controller";
import ensureCategoryExists from "../middlewares/ensureCategoryExists.middleware";
import ensureIsAdminMiddleware from "../middlewares/isAdmin.middleware";
import validTokenMiddleware from "../middlewares/validToken.middleware";

export const categoriesRouter = Router();

categoriesRouter.post(
  "",
  validTokenMiddleware({}),
  ensureIsAdminMiddleware,
  createCategoriesController
);
categoriesRouter.get("", listCategoriesController);
categoriesRouter.get(
  "/:id/products",
  ensureCategoryExists,
  listCategoryProductsController
);
categoriesRouter.delete(
  "/:id",
  validTokenMiddleware({}),
  ensureIsAdminMiddleware,
  ensureCategoryExists,
  deleteCategoryController
);
categoriesRouter.patch(
  "/:id",
  validTokenMiddleware({}),
  ensureIsAdminMiddleware,
  ensureCategoryExists,
  updateCategoryController
);
