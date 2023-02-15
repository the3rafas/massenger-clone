import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { PinoLogger } from 'nestjs-pino';
import { DatabaseError } from 'sequelize';
import { IGqlErrorResponse } from '../graphql/graphql-response.type';
import { BaseHttpException } from './base-http-exception';
import { MessageSource } from './errors';
// Catch any error type
@Catch()
export class HttpExceptionFilter implements GqlExceptionFilter {
  private response = {
    code: 500,
    success: false,
    message: 'Something went wrong!'
  };

  constructor(private readonly logger: PinoLogger) {}

  catch(exception: unknown, host: ArgumentsHost): IGqlErrorResponse {
    if (exception instanceof HttpException) {
      const gqlHost = GqlArgumentsHost.create(host);
      const currentGqlInfo = gqlHost.getInfo();
      const currentGqlCtx = gqlHost.getContext();

      let myException = exception as BaseHttpException;

      let params = myException.getParams;
      const messageKey = exception.getResponse().toString();

      let localizedMessage = new MessageSource().getMessage(messageKey, currentGqlCtx.lang, params);
      if (!localizedMessage) localizedMessage = exception.getResponse().toString();

      this.logger.setContext(
        `${HttpExceptionFilter.name}-${
          currentGqlInfo ? currentGqlInfo.fieldName : 'UnKnown GQL Context'
        }`
      );
      let message = exception.getResponse() as any;
      const trace = `Operation body: ${
        currentGqlCtx.req ? JSON.stringify(currentGqlCtx.req.body) : 'None'
      }
        Current user: ${currentGqlCtx.currentUser ? currentGqlCtx.currentUser.id : 'No user'}`;
      if (typeof message === 'object') {
        this.logger.error(
          `Message: ${message.error}`,
          `\n\n\n\n\n\n Stack: ${trace}`,
          '\n\n\n\n\n\n'
        );
        message = `${message.error} - ${JSON.stringify(message.message)}`;
      } else
        this.logger.error(`Message: ${message}`, `\n\n\n\n\n\n Stack: ${trace}`, '\n\n\n\n\n\n');
      this.response.code = exception.getStatus();
      this.response.message = localizedMessage;
      return this.response;
    }

    if (exception instanceof DatabaseError) {
      this.response.code = 500;
      this.response.message = exception.message;
      this.logger.error(
        `Message: ${exception.message}`,
        `\n\n\n\n\n\n Stack: ${exception.stack}`,
        `\n\n\n\n\n\n SQL: ${exception.sql}`,
        '\n\n\n\n\n\n'
      );
      return this.response;
    }

    if (exception instanceof RangeError || (exception as any).name === 'PayloadTooLargeError') {
      this.response.code = 413;
      this.response.message = (exception as any).message;
      this.logger.error(`Message: ${(exception as any).stack}`);
      return this.response;
    }

    if (exception instanceof Error) {
      if (exception.message.includes('path must be absolute')) {
        const httpCtx = host.switchToHttp();
        const response = httpCtx.getResponse();
        return response.end('File does not exist');
      }
      this.response.code = 500;
      this.response.message = 'Something went wrong!';
      this.logger.error(`Message: ${exception.stack}`);
      return this.response;
    }

    this.logger.error('Error', exception);
    this.response.code = 500;
    this.response.message = 'Something went wrong!';
    return this.response;
  }
}
