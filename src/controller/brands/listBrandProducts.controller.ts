import { Request, Response } from "express";
import listBrandProductsService from "../../service/brands/listBrandProducts.service";

const listBrandProductsController = async (req: Request, res: Response) => {
  const brandId = req.params.id;
  const response = await listBrandProductsService(brandId);
  return res.status(200).json(response);
};

export default listBrandProductsController;
