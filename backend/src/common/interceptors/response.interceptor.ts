import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseDto } from '../dto/api-response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponseDto<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponseDto<T>> {
    const request = context.switchToHttp().getRequest();
    const path = request.originalUrl;
    const timestamp = new Date().toISOString();

    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && 'success' in data) {
          return {
            ...data,
            timestamp: data.timestamp || timestamp,
            path: data.path || path,
          };
        }

        if (data && typeof data === 'object' && 'access_token' in data) {
          return data as any;
        }

        if (data && typeof data === 'object' && 'deleted' in data && data.deleted === true) {
          return {
            success: true,
            message: 'حذف با موفقیت انجام شد',
            messageEn: 'Deleted successfully',
            messageFa: 'حذف با موفقیت انجام شد',
            timestamp,
            path,
          };
        }

        if (data && typeof data === 'object' && 'data' in data && 'total' in data) {
          return {
            success: true,
            data: data.data,
            total: data.total,
            page: data.page || 1,
            limit: data.limit || 10,
            timestamp,
            path,
          };
        }

        if (Array.isArray(data)) {
          return {
            success: true,
            data,
            timestamp,
            path,
          };
        }
        return {
          success: true,
          data,
          timestamp,
          path,
        };
      }),
    );
  }
}