// src/modules/user/dto/toggle-user-status-response.dto.ts
import { Expose, Type } from 'class-transformer';

class ToggleStatusDataDto {
  @Expose()
  id: string;

  @Expose()
  isDisabled: boolean;
}

export class ToggleUserStatusResponseDto {
  @Expose()
  success: boolean;

  @Expose()
  message: string;

  @Expose()
  @Type(() => ToggleStatusDataDto)
  data: ToggleStatusDataDto;
}