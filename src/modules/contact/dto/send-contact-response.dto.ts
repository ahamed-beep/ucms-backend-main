import { Expose, Type } from 'class-transformer';

export class SendContactDataDto {
  @Expose() id: string;
}

export class SendContactResponseDto {
  @Expose() success: boolean;
  @Expose() message: string;
  @Expose() @Type(() => SendContactDataDto) data: SendContactDataDto;
}