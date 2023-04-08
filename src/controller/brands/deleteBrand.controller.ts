import { Request, Response } from "express";
import deleteBrandService from "../../service/brands/deleteBrand.service";

const deleteBrandController = async (req: Request, res: Response) => {
  const brandId = req.params.id;

  const response = await deleteBrandService(brandId);

  return res.status(200).send(response);
};

export default deleteBrandController;
