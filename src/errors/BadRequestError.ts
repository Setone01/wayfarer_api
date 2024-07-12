import HttpStatus from "http-status-codes";

import ErrorHandler from "./ErrorHandler";

export class BadRequestError extends ErrorHandler {
  protected error_name: string = "bad request";
  protected httpCode: number = HttpStatus.BAD_REQUEST;

  public constructor(
    message: string = "Request data is invalid",
    data: any = null
  ) {
    super(message, undefined, data);
    Error.captureStackTrace(this, this.constructor);
  }
    
}
