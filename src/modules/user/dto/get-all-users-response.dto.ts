import { Expose, Type } from 'class-transformer';
import { UserDataDto } from './user-data.dto';

export class GetAllUsersResponseDto {
  @Expose() success: boolean;
  @Expose() message: string;
  @Expose() total: number;

  @Expose()
  @Type(() => UserDataDto)
  data: UserDataDto[];
}