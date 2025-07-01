import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { RpcException } from '@nestjs/microservices';

// * This exception filter will ====>
//* 1. Catch all unhandled errors globally.
//* 2. Respond with appropriate HTTP status codes.
//* 3. Return user-friendly error messages.
//* 4. Log detailed error information for developers.
//* 5. Handle errors for both HTTP and microservice (RPC) contexts.



@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const contextType = host.getType();

        if (contextType === 'http') {
            this.handleHttpException(exception, host);
            // rpc =>  remote procedure call
        } else if (contextType === 'rpc') {
            this.handleRpcException(exception, host);
        }
    }

    private handleHttpException(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let error = 'InternalServerError';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                message = (exceptionResponse as any).message || exception.message;
                error = (exceptionResponse as any).error || exception.name;
            } else {
                message = exceptionResponse as string;
                error = exception.name;
            }
        } else if (exception instanceof Error) {
            message = exception.message;
            error = exception.name;

            // Handle specific database errors (MikroORM)
            if (exception.name === 'ValidationError') {
                status = HttpStatus.BAD_REQUEST;
                error = 'ValidationError';
            } else if (exception.name === 'NotFoundError') {
                status = HttpStatus.NOT_FOUND;
                error = 'NotFoundError';
            } else if (exception.name === 'UniqueConstraintViolationException') {
                status = HttpStatus.CONFLICT;
                error = 'ConflictError';
                message = 'Resource already exists';
            }
        }

        // Log the error
        this.logger.error(
            `HTTP Exception: ${error} - ${message}`,
            {
                method: request.method,
                url: request.url,
                statusCode: status,
                userAgent: request.get('User-Agent'),
                ip: request.ip,
                stack: exception instanceof Error ? exception.stack : undefined,
            },
        );

        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            error,
            message: Array.isArray(message) ? message : [message],
            ...(process.env.NODE_ENV === 'development' && exception instanceof Error && {
                stack: exception.stack,
            }),
        };

        response.status(status).json(errorResponse);
    }
    // This code handles RPC(Remote Procedure Call) errors in a NestJS microservice environment, NATS
    private handleRpcException(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToRpc();

        let error = 'InternalServerError';
        let message = 'Internal server error';

        if (exception instanceof RpcException) {
            const rpcError = exception.getError();
            if (typeof rpcError === 'object' && rpcError !== null) {
                message = (rpcError as any).message || 'RPC Error';
                error = (rpcError as any).error || 'RpcError';
            } else {
                message = rpcError as string;
            }
        } else if (exception instanceof Error) {
            message = exception.message;
            error = exception.name;
        }

        // Log the RPC error
        this.logger.error(
            `RPC Exception: ${error} - ${message}`,
            {
                pattern: ctx.getContext().pattern,
                data: ctx.getData(),
                stack: exception instanceof Error ? exception.stack : undefined,
            },
        );

        // For microservices, throw RpcException
        throw new RpcException({
            error,
            message,
            timestamp: new Date().toISOString(),
            service: process.env.SERVICE_NAME || 'unknown-service',
        });
    }
}