import { Expose } from 'class-transformer';

export class StudentSummaryDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  emailId: string;

  @Expose()
  role: string;
}