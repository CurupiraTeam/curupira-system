import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { get } from 'lodash';
import { ApiResponse } from 'src/models/interfaces/api-response.interface';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = get(
      exception,
      'response.message',
      get(exception, 'message', 'Falha no Servidor'),
    );

    const responseBody: ApiResponse<null> = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: 'Error',
      error: message,
    };

    response.status(status).json(responseBody);
  }
}
