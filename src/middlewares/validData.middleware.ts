import { Request, Response, NextFunction } from "express";
import { boolean, Schema, ValidationError } from "yup";
import AppError from "../error/appError";

interface IvalidDataMiddleware {
  serializerLevelAll: Schema<any>;
  serializerLevelOne?: Schema<any>;
}

const validDataMiddleware =
  ({ serializerLevelAll, serializerLevelOne }: IvalidDataMiddleware) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const token = req?.token;

    const filterData = Object.entries(data).filter((property) => property[1] || typeof property[1] === "boolean" || property[1] === 0 )

    if(filterData.length === 0){
      throw new AppError("Deve enviar algo", 404)
    }

    const validData = Object.fromEntries(filterData);

    const serializer =
      token?.authorizationLevel === 1 && serializerLevelOne
        ? serializerLevelOne
        : serializerLevelAll;

    try {
      const resData = await serializer.validate(validData, {
        stripUnknown: true,
        abortEarly: false,
      });

      req.body = resData;

      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new AppError(error.errors as any, 400);
      }
    }
  };

export default validDataMiddleware;
