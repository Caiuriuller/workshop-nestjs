import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const elapsed = Date.now() - start;
          this.logger.log(`${method} ${url} - ${elapsed}ms`);
        },
        error: () => {
          const elapsed = Date.now() - start;
          this.logger.log(`${method} ${url} - ${elapsed}ms`);
        },
      }),
    );
  }
}
