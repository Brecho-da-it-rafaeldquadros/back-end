import { Request, Response } from "express";
import updateImageBrandService from "../../service/brands/updateImageBrand.service";
const updateImagesBrandController = async (req: Request, res: Response) => {
  const brandId = req.params.id;
  const response = await updateImageBrandService(brandId, req.file);

  return res.status(200).json(response);
};
export default updateImagesBrandController;
