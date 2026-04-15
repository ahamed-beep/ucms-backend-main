import { Expose, Type } from 'class-transformer';

export function ApiResponseDto<T>(DataDto: new (...args: any[]) => T) {
  class ApiResponseDtoClass {
    @Expose()
    message: string;

    @Expose()
    @Type(() => DataDto)
    data: T;
  }
  return ApiResponseDtoClass;
}