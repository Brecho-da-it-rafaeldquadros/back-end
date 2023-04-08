import { Request, Response } from "express";
import listProductsService from "../../service/products/listProducts.service";

const listProductsController = async (req: Request, res: Response) => {
  const query = req.query;
  const response = await listProductsService(query);
  return res.status(200).json(response);
};

export default listProductsController;
