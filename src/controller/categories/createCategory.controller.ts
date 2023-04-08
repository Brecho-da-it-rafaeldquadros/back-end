import { Request, Response } from "express";
import createCategoriesService from "../../service/categories/createCategories.service";

const createCategoriesController = async (req: Request, res: Response) => {
  const data = req.body;
  const resData = await createCategoriesService(data);
  return res.status(201).json(resData);
};

export default createCategoriesController;
