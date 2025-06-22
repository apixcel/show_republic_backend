import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus,} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        error: false,
        data,
        timestamp: new Date().toISOString(),
      })),
      catchError((error) => {
        // Transform the error
        const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || 'An unexpected error occurred';

        return throwError(() => new HttpException(message, status));
      })
    );
  }
}
