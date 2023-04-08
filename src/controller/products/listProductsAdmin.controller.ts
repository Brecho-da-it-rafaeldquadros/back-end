import { Request, Response } from "express";
import listProductsAdminService from "../../service/products/listProductsAdmin.service";

const listProductsAdminController = async (req: Request, res: Response) => {
  const query = req?.query;
  const response = await listProductsAdminService(query);
  return res.status(200).json(response);
};

export default listProductsAdminController;
