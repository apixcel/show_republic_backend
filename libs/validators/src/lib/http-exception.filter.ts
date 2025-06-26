import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException & { data?: any }, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message || 'Internal server error';
    const timestamp = new Date().toISOString();
    const path = request.url;
    const data = exception.data;

    response.status(status).json({
      statusCode: status,
      data,
      error: true,
      message,
      timestamp,
      path,
    });
  }
}
