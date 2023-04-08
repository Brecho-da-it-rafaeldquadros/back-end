import { Request, Response, NextFunction } from "express";
import AppError from "../error/appError";
import Repository from "../util/repository.util";

const ensureCategoryExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.params.id.length < 36) {
    throw new AppError("Invalid id", 404);
  }

  const category = await Repository.categories.findOneBy({
    id: req.params.id,
  });

  if (!category) {
    throw new AppError("Category dont exists", 404);
  }

  return next();
};

export default ensureCategoryExists;
