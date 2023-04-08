import { Request, Response, NextFunction } from "express";
import AppError from "../error/appError";
import Repository from "../util/repository.util";

const ensureBrandExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.params.id.length !== 36) {
    throw new AppError("Invalid id", 404);
  }

  const brand = await Repository.brand.findOneBy({
    id: req.params.id,
  });

  if (!brand) {
    throw new AppError("Brand dont exists", 404);
  }

  return next();
};

export default ensureBrandExists;
