import { Request, Response } from "express";
import listBrandsService from "../../service/brands/listBrands.service";

const listBrandsController = async (req: Request, res: Response) => {
  const resData = await listBrandsService();
  return res.status(200).json(resData);
};

export default listBrandsController;
