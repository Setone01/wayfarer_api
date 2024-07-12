import { Request, Response, NextFunction } from "express";
import NotAuthenticatedError from "../errors/NotAuthenticatedError";
import { User } from "src/interfaces";

export const authoriseAdmin = () => {
  return async (req: Request, res: Response<User>, next: NextFunction) => {
    const role = res.locals.user;
    if (role.role !== "admin") {
      return next(new NotAuthenticatedError("Admin access required!"));
    }
    next();
  };
};
