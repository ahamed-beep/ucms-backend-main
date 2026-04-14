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

export function SerializeResponse(dto: ClassConstructor, dataDto?: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto, dataDto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor, private dataDto?: ClassConstructor) {}

  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> {
    return next.handle().pipe(
      map((response: any) => {
        const plain = this.toPlain(response);

        // Direct array
        if (Array.isArray(plain)) {
          const itemDto = this.dataDto ?? this.dto;
          return plain.map((item) =>
            plainToInstance(itemDto, item, {
              excludeExtraneousValues: true,
              enableImplicitConversion: true,
            }),
          );
        }

        // Wrapper object with data array
        if (plain && typeof plain === 'object' && Array.isArray(plain.data)) {
          const itemDto = this.dataDto ?? this.dto;
          return {
            ...plain,
            data: plain.data.map((item: any) =>
              plainToInstance(itemDto, item, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true,
              }),
            ),
          };
        }

        // Wrapper object with single data object
        if (plain && typeof plain === 'object' && 'data' in plain) {
          return plainToInstance(this.dto, plain, {
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
          });
        }

        // Single object
        return plainToInstance(this.dto, plain, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      }),
    );
  }

  private toPlain(doc: any): any {
    if (!doc || typeof doc !== 'object') return doc;
    if (doc instanceof Date) return doc;
    if (typeof doc.toObject === 'function') return this.toPlain(doc.toObject({ virtuals: true }));
    if (Array.isArray(doc)) return doc.map((item) => this.toPlain(item));

    const result: any = {};
    if (doc._id) result.id = doc._id.toString();

    for (const key of Object.keys(doc)) {
      if (key === '__v' || key === '_id') continue;
      const val = doc[key];
      result[key] = val instanceof Date ? val : this.toPlain(val);
    }

    return result;
  }
}