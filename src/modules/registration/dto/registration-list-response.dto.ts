import { Expose, Type } from 'class-transformer';
import { RegistrationResponseDto } from './registration-response.dto';

export class RegistrationListResponseDto {
  @Expose()
  @Type(() => RegistrationResponseDto)
  data: RegistrationResponseDto[];

  @Expose()
  total: number;

  @Expose()
  page: number;

  @Expose()
  limit: number;
}