import HttpStatus from "http-status-codes";

import ErrorHandler from "./ErrorHandler";

export class ConflictError extends ErrorHandler {
  protected error_name = "conflict";
  protected httpCode = HttpStatus.CONFLICT;

  constructor(
    message: string = "The request could not be completed due to a conflict with the current state",
    data: any= null
  ) {
    super(message, undefined, data);
    Error.captureStackTrace(this, this.constructor);
  }
}
