import { Expose, Type } from 'class-transformer';

export class MarkReadResponseDto {
  @Expose() success: boolean;
  @Expose() message: string;
  @Expose() @Type(() => Object) data: { id: string; isRead: boolean; status: string; readAt: Date };
}