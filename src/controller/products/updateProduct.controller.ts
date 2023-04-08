import { Request, Response } from "express";
import updateProductService from "../../service/products/updateProduct.service";

const updateProductController = async (req: Request, res: Response) => {
  const productId = req.params.id;
  const data = req.body;
  console.log(data);
  const response = await updateProductService(productId, data);

  return res.status(200).json(response);
};
export default updateProductController;
