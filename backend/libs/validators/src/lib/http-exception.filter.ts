import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const error = exception.name || 'Error';
    const message = exception.message || 'Internal server error';
    const timestamp = new Date().toISOString();
    const path = request.url;

    response.status(status).json({
      statusCode: status,
      error: true,
      message,
      timestamp,
      path,
    });
  }
}
