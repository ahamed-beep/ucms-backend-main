import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

interface ClassConstructor {
  new (...args: unknown[]): object;
}

export function SerializeResponse(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> {
    return next.handle().pipe(
      map((response: any) => {
        if (response && typeof response === 'object' && 'data' in response) {
          const serialized = Array.isArray(response.data)
            ? response.data.map((item: unknown) =>
                plainToInstance(this.dto, item, { excludeExtraneousValues: true })
              )
            : plainToInstance(this.dto, response.data, { excludeExtraneousValues: true });

          return { ...response, data: serialized };
        }

        return plainToInstance(this.dto, response, { excludeExtraneousValues: true });
      }),
    );
  }
}