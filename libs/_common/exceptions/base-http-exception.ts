import { HttpException } from '@nestjs/common';
import { ErrorCodeEnum } from './error-code.enum';

export class BaseHttpException extends HttpException {
  private params;
  private logMessage;

  constructor(errorCode: ErrorCodeEnum, params?, logMessage?) {
    super(ErrorCodeEnum[errorCode], errorCode);
    this.params = params;
    this.logMessage = logMessage;
  }
  getParams() {
    return this.params;
  }
  getMessage() {
    return this.logMessage;
  }
}

 

  