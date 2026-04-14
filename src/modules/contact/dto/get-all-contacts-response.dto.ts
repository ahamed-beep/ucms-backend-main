import { Expose, Type } from 'class-transformer';
import { ContactDataDto } from './contact-data.dto';

export class GetAllContactsResponseDto {
  @Expose() success: boolean;
  @Expose() message: string;
  @Expose() total: number;
  @Expose() unreadCount: number;
  @Expose() @Type(() => ContactDataDto) data: ContactDataDto[];
}