import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import variables from "../variables";
import { BadRequestError } from "../errors";

dotenv.config();

export class JWT {
  private static secret: any =
    variables.auth.jwtSecret || process.env.JWT_SECRET;

  public static encode<T>(
    payload: Partial<T>,
    options?: Partial<jwt.SignOptions>
  ): string {
    const token = jwt.sign(payload, this.secret, {
      expiresIn: "5d",
      ...options,
    });
    return token;
  }

  public static decode(token: string): jwt.JwtPayload {
    if (!token) {
      throw new BadRequestError("No token provided");
    }

    const decoded = jwt.verify(token, this.secret);
    return decoded as jwt.JwtPayload;
  }
}