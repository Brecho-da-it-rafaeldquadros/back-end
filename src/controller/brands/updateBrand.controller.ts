import { Request, Response } from "express";
import updateBrandService from "../../service/brands/updateBrand.service";

const updateBrandController = async (req: Request, res: Response) => {
  const brandId = req.params.id;
  const data = req.body;
  const response = await updateBrandService(brandId, data);

  return res.status(200).json(response);
};
export default updateBrandController;
