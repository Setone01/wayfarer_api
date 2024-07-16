import { Request, Response, NextFunction } from "express";
import NotAuthenticatedError from "../errors/NotAuthenticatedError";
import { User } from  "../interfaces"

export const authUser = () => {
  return async (req: Request, res: Response<User>, next: NextFunction) => {
    const role = res.locals.user;
    if (role.role !== "user") {
      return next(new NotAuthenticatedError("User access required!"));
    }
    next();
  };
};
