import { Request, Response } from "express";
import updateImageProductService from "../../service/products/updateImagesProduct.service";

const updateImagesProductController = async (req: Request, res: Response) => {
  const productId = req.params.id;
  const query = req.query;
  const response = await updateImageProductService(productId, req.file, query);

  return res.status(200).json(response);
};
export default updateImagesProductController;
