import { Request, Response } from "express";
import createProductService from "../../service/products/createProduct.service";
import uploadImage from "../../util/api/uploadImages";
import "dotenv/config";
import { calculatePorcent } from "../../util/calculatePorcent.util";
import uploadOneImage from "../../util/api/uploadOneImage";

const createProductController = async (req: Request, res: Response) => {
  console.log(req.file);
  const images = await uploadOneImage(req.file);

  const prices = await calculatePorcent(
    req.body.priceSeller,
    req.body.percentageService
  );
  const productData = { ...req.body, ...prices };
  const response = await createProductService(
    productData,
    req.token.id,
    images
  );
  return res.status(201).json(response);
};

export default createProductController;
