import { NextFunction, Request, Response } from "express";

const ensureIsAdminMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (request.token.authorizationLevel == 1) {
    return next();
  } else {
    return response.status(401).json({ message: "Deve ser um administrador" });
  }
};

export default ensureIsAdminMiddleware;
