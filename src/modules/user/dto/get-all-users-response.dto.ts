import { Expose, Type } from 'class-transformer';

export class UserItemDto {
  @Expose()
  _id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  emailId: string;

  @Expose()
  role: string;

  @Expose()
  isDisabled: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

export class GetAllUsersResponseDto {
  @Expose()
  success: boolean;

  @Expose()
  message: string;

  @Expose()
  total: number;

  @Expose()
  @Type(() => UserItemDto)
  data: UserItemDto[];
}