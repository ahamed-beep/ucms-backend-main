import { Expose, Type } from 'class-transformer';

class UserDataDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  role: string;
}

export class LoginResponseDto {
  @Expose()
  success: boolean;

  @Expose()
  status?: number;

  @Expose()
  message: string;

  @Expose()
  token?: string;

  @Expose()
  @Type(() => UserDataDto)
  data?: UserDataDto;
}