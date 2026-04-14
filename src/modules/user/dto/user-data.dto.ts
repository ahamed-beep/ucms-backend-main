import { Expose } from 'class-transformer';

export class UserDataDto {
  @Expose() id: string;
  @Expose() firstName: string;
  @Expose() lastName: string;
  @Expose() emailId: string;
  @Expose() role: string;
  @Expose() isDisabled: boolean;
  @Expose() createdAt: Date;
}