import { Request, Response } from "express";
import deleteProductService from "../../service/products/deleteProduct.service";

const deleteProductController = async (req: Request, res: Response) => {
  const brandId = req.params.id;

  const response = await deleteProductService(brandId);

  return res.status(200).send(response);
};

export default deleteProductController;
