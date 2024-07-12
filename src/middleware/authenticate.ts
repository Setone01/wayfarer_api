import { Request, Response, NextFunction } from "express";
import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import NotAuthenticatedError from "../errors/NotAuthenticatedError";
import { JWT } from "../utilities";
import { findUser } from "../repository/user";
import { User } from "../interfaces";

export const authenticate = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return next(new NotAuthenticatedError("No token provided"));
    }
    const [, token] = authorization.split(" ");

    try {
      if (!token) {
        return next(new NotAuthenticatedError("No token provided"));
      }
      const decoded = JWT.decode(token);

      const user = await findUser(["%" + decoded.id + "%"] as Partial<User>);

      if (!user) {
        return next(new NotAuthenticatedError("Invalid token"));
      }

      res.locals.user = user;
      return next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return next(new NotAuthenticatedError("Token has expired"));
      }

      if (error instanceof NotBeforeError) {
        return next(
          new NotAuthenticatedError("Token has not been created yet")
        );
      }

      if (error instanceof JsonWebTokenError) {
        return next(new NotAuthenticatedError("Invalid token"));
      }

      return next(error);
    }
  };
};
