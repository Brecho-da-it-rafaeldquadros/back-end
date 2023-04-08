import { Request, Response } from "express";
import listProductsService from "../../service/products/listProducts.service";
import listRecentsProductsService from "../../service/products/listRecentsProducts.service";

const listRecentsProductsController = async (req: Request, res: Response) => {
  const query = req.query;
  const response = await listRecentsProductsService();
  return res.status(200).json(response);
};

export default listRecentsProductsController;
