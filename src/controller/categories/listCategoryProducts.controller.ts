import { Request, Response } from "express";
import listCategoryProductsService from "../../service/categories/listCategoryProducts.service";

const listCategoryProductsController = async (req: Request, res: Response) => {
  const CategoryId = req.params.id;
  const response = await listCategoryProductsService(CategoryId);
  return res.status(200).json(response);
};

export default listCategoryProductsController;
