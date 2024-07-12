import httpStatus from "http-status-codes";

import ErrorHandler from "./ErrorHandler";

export class ResourceNotFoundError extends ErrorHandler {
  protected error_name = "not found";
  protected httpCode = httpStatus.NOT_FOUND;

  public constructor(message: string = "Resource not found", data: any = null) {
    super(message, undefined, data);
  }
}
