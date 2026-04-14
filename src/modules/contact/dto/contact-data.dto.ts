import { Expose, Transform } from 'class-transformer';

export class ContactDataDto {
  @Expose()
   @Transform(({ obj }) => obj.id ?? obj._id?.toString())
  id: string;

  @Expose() fullName: string;
  @Expose() email: string;
  @Expose() phone: string;
  @Expose() subject: string;
  @Expose() message: string;
  @Expose() status: string;
  @Expose() isRead: boolean;
  @Expose() readAt: Date | null;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
}