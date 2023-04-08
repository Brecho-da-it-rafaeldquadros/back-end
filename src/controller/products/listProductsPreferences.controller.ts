import { Request, Response } from "express";
import listProductsPreferencesService from "../../service/products/listProductPreferences.service";
import listProductsService from "../../service/products/listProducts.service";

const listProductsPreferenceController = async (
  req: Request,
  res: Response
) => {
  const query = req.query;
  const userId = req.token.id;
  const response = await listProductsPreferencesService(query, userId);
  return res.status(200).json(response);
};

export default listProductsPreferenceController;
