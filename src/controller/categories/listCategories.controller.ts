import { Request, Response } from "express";
import listCategoriesService from "../../service/categories/listCategories.service";

const listCategoriesController = async (req: Request, res: Response) => {
  const resData = await listCategoriesService();
  return res.status(200).json(resData);
};

export default listCategoriesController;
