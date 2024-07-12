import HttpStatus from "http-status-codes";

import ErrorHandler from "./ErrorHandler";

export default class NotAuthenticatedError extends ErrorHandler {
  protected error_name = "not authenticated";
  protected httpCode = HttpStatus.UNAUTHORIZED;

  public constructor(
    message: string = "Request not authenticated",
    data: any = null
  ) {
    super(message, undefined, data);
    Error.captureStackTrace(this, this.constructor);
  }
}
