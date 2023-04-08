import { Router } from "express";
import createBrandController from "../controller/brands/createBrands.controller";
import deleteBrandController from "../controller/brands/deleteBrand.controller";
import listBrandProductsController from "../controller/brands/listBrandProducts.controller";
import listBrandsController from "../controller/brands/listBrands.controller";
import updateBrandController from "../controller/brands/updateBrand.controller";
import updateImagesBrandController from "../controller/brands/updateImageBrand.controller";
import ensureBrandExists from "../middlewares/ensureBrandExist.middleware";
import ensureIsAdminMiddleware from "../middlewares/isAdmin.middleware";
import uploadMiddleware from "../middlewares/upload.middleware";
import validTokenMiddleware from "../middlewares/validToken.middleware";

export const brandsRouter = Router();

brandsRouter.post(
  "",
  validTokenMiddleware({}),
  ensureIsAdminMiddleware,
  uploadMiddleware.single("sizeTable"),
  createBrandController
);
brandsRouter.get("", listBrandsController);
brandsRouter.get(
  "/:id/products",
  ensureBrandExists,
  listBrandProductsController
);
brandsRouter.delete(
  "/:id",
  validTokenMiddleware({}),
  ensureIsAdminMiddleware,
  ensureBrandExists,
  deleteBrandController
);
brandsRouter.patch(
  "/:id",
  validTokenMiddleware({}),
  ensureIsAdminMiddleware,
  ensureBrandExists,
  updateBrandController
);
brandsRouter.patch(
  "/:id/images",
  validTokenMiddleware({}),
  ensureIsAdminMiddleware,
  uploadMiddleware.single("sizeTable"),
  updateImagesBrandController
);
