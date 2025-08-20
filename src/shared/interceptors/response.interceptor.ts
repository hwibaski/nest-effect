import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ApiResponse,
  isErrorResponse,
  PaginatedApiResponse,
} from 'src/shared/response';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: ApiResponse | PaginatedApiResponse<any>) => {
        const response = context.switchToHttp().getResponse<Response>();

        // ErrorResponse인 경우 해당 statusCode로 HTTP 상태 설정
        if (isErrorResponse(data)) {
          response.status(data.statusCode);
        } else {
          // SuccessResponse인 경우 해당 statusCode로 HTTP 상태 설정
          response.status(data.statusCode);
        }

        return data;
      }),
    );
  }
}
