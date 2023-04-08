import { Request, Response } from "express";
import listProductByIdService from "../../service/products/listProductById.service";

const listProductByIdController = async (req: Request, res: Response) => {
  const productId = req.params.id;
  const response = await listProductByIdService(productId);
  return res.status(200).json(response);
};

export default listProductByIdController;
