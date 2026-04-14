import { Expose, Type } from 'class-transformer';

class CreatedUserDataDto {
  @Expose()
  id: string;
}

export class CreateUserResponseDto {
  @Expose()
  success: boolean;

  @Expose()
  message: string;

  @Expose()
  @Type(() => CreatedUserDataDto)  
  data: CreatedUserDataDto;
}