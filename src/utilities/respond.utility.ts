import { Response } from "express";
import HttpStatus from "http-status-codes";
import { JWT } from "./jwt.utility";

export const respond = <T>(
  res: Response,
  payload: T,
  statusCode: number = HttpStatus.OK,
  errors: unknown = null,
  token: string | null = null
  // meta: Record<string, unknown> = {}
): Response => {
  const isError = statusCode >= 400;
  const status = isError ? "error" : "success";
  const payloadKey = isError ? "message" : "data";

  const response = {
    status,
    [payloadKey]: payload,
    ...(isError && errors ? { data: "error" } : {}),
    ...(token ? { token } : {}),
  };
  return res.status(statusCode).json(response);
};

export default respond;
