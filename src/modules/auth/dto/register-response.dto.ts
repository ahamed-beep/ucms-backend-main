import { Expose } from 'class-transformer';

export class RegisterResponseDto {
  @Expose()
  success: boolean;

  @Expose()
  message: string;

  @Expose()
  userId?: string;
}