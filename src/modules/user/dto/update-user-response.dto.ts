import { Expose, Type } from 'class-transformer';

class UpdatedUserDataDto {
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

  @Expose()
  isDisabled: boolean;
}

export class UpdateUserResponseDto {
  @Expose()
  success: boolean;

  @Expose()
  message: string;

  @Expose()
  @Type(() => UpdatedUserDataDto)
  data: UpdatedUserDataDto;
}