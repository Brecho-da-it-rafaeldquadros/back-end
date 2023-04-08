import { Request, Response } from "express";
import createBrandService from "../../service/brands/createBrands.service";
import uploadOneImage from "../../util/api/uploadOneImage";

const createBrandController = async (req: Request, res: Response) => {
  const sizeTable = await uploadOneImage(req.file);
  const data = { ...req.body, sizeTable };
  const resData = await createBrandService(data);
  return res.status(201).json(resData);
};

export default createBrandController;
