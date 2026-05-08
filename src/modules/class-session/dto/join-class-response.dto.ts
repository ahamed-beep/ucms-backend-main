import { Expose } from 'class-transformer';

export class JoinClassResponseDto {
  @Expose()
  meetingLink: string;

  @Expose()
  alreadyAttended: boolean;
}