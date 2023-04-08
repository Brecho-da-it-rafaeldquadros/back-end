import { Router } from "express";
import createProductController from "../controller/products/createProduct.controller";
import deleteProductController from "../controller/products/deleteProduct.controler";
import listProductByIdController from "../controller/products/listProductById.controller";
import listProductsController from "../controller/products/listProducts.controller";
import listProductsAdminController from "../controller/products/listProductsAdmin.controller";
import listProductsPreferenceController from "../controller/products/listProductsPreferences.controller";
import listRecentsProductsController from "../controller/products/listRecentsProducts.controller";
import updateImagesProductController from "../controller/products/updateImagesProduct.controller";
import updateProductController from "../controller/products/updateProduct.controller";
import ensureProductExists from "../middlewares/ensureProductExists.middleware";
import ensureIsAdminMiddleware from "../middlewares/isAdmin.middleware";
import validQueryPaginationMiddleware from "../middlewares/pagination.middleware";
import uploadMiddleware from "../middlewares/upload.middleware";
import validDataMiddleware from "../middlewares/validData.middleware";
import validIdParamsMiddleware from "../middlewares/validIdParms.middleware";
import validTokenMiddleware from "../middlewares/validToken.middleware";
import {
  schemaCreateProducts,
  schemaUpdateProducts,
} from "../serializer/products.serializer";

export const productsRouter = Router();

productsRouter.get(
  "/admin",
  validTokenMiddleware({}),
  validQueryPaginationMiddleware,
  ensureIsAdminMiddleware,
  listProductsAdminController
);

productsRouter.get("/recents", listRecentsProductsController);
productsRouter.get(
  "/preferences",
  validTokenMiddleware({}),
  validQueryPaginationMiddleware,
  listProductsPreferenceController
);

productsRouter.post(
  "",
  validTokenMiddleware({}),
  ensureIsAdminMiddleware,
  uploadMiddleware.single("images"),
  validDataMiddleware({
    serializerLevelAll: schemaCreateProducts,
  }),
  createProductController
);

productsRouter.get("", validQueryPaginationMiddleware, listProductsController);
productsRouter.get(
  "/:id",
  validIdParamsMiddleware({
    optionalTwo: true,
  }),
  listProductByIdController
);

productsRouter.delete(
  "/:id",
  validTokenMiddleware({}),
  ensureIsAdminMiddleware,
  ensureProductExists,
  deleteProductController
);
productsRouter.patch(
  "/:id",
  validTokenMiddleware({}),
  validDataMiddleware({
    serializerLevelAll: schemaUpdateProducts,
  }),
  ensureIsAdminMiddleware,
  ensureProductExists,
  updateProductController
);
productsRouter.patch(
  "/:id/images",
  validTokenMiddleware({}),
  ensureIsAdminMiddleware,
  ensureProductExists,
  uploadMiddleware.single("image"),
  updateImagesProductController
);
