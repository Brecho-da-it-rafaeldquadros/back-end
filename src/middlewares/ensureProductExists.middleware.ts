import { Request, Response, NextFunction } from "express";
import AppError from "../error/appError";
import Repository from "../util/repository.util";

const ensureProductExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.params.id.length < 36) {
    throw new AppError("Invalid id", 404);
  }

  const product = await Repository.product.findOneBy({
    id: req.params.id,
  });

  if (!product) {
    throw new AppError("Este produto não existe", 404);
  }

  return next();
};

export default ensureProductExists;
