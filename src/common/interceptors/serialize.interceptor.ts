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
        if (Array.isArray(response)) {
          return response.map((item) => this.transformDoc(item));
        }

        if (response && typeof response === 'object' && Array.isArray(response.data)) {
          return {
            ...response,
            data: response.data.map((item: any) => this.transformDoc(item)),
          };
        }

        if (response && typeof response === 'object' && 'data' in response) {
          return {
            ...response,
            data: response.data ? this.transformDoc(response.data) : response.data,
          };
        }

        return this.transformDoc(response);
      }),
    );
  }

  private toPlainObject(doc: any): any {
    if (!doc || typeof doc !== 'object') return doc;
    if (typeof doc.toObject === 'function') {
      const plain = doc.toObject({ virtuals: true });
      if (plain._id) plain._id = plain._id.toString();
      return plain;
    }
    return doc;
  }

  private transformDoc(doc: any): any {
    return plainToInstance(this.dto, this.toPlainObject(doc));
  }
}