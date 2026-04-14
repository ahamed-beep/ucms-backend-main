import { Expose, Type } from 'class-transformer';

export class UnreadCountDataDto {
  @Expose() unreadCount: number;
}

export class UnreadCountResponseDto {
  @Expose() success: boolean;
  @Expose() message: string;
  @Expose() @Type(() => UnreadCountDataDto) data: UnreadCountDataDto;
}