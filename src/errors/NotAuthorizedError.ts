import HttpStatus from "http-status-codes";

import ErrorHandler from "./ErrorHandler";

export default class NotAuthorizedError extends ErrorHandler {
  protected error_name = "not authorized";
  protected httpCode = HttpStatus.FORBIDDEN;

  public constructor(
    message: string = "Request not authorized",
    data: any = null
  ) {
    super(message, undefined, data);
    Error.captureStackTrace(this, this.constructor);
  }
}
