import { Request, Response } from "express";
import updateCategoryService from "../../service/categories/updateCategory.service";

const updateCategoryController = async (req: Request, res: Response) => {
  const categoryId = req.params.id;
  const data = req.body;
  const response = await updateCategoryService(categoryId, data);

  return res.status(200).json(response);
};
export default updateCategoryController;
