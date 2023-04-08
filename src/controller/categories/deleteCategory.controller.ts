import { Request, Response } from "express";
import deleteCategoryService from "../../service/categories/deleteCategory.service";

const deleteCategoryController = async (req: Request, res: Response) => {
  const categoryId = req.params.id;

  const response = await deleteCategoryService(categoryId);

  return res.status(200).send(response);
};

export default deleteCategoryController;
