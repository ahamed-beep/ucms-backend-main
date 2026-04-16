import { IsEnum } from 'class-validator';
import { ApplicationStatus } from '../enums/faculty-application.enum';

export class UpdateFacultyStatusDto {
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;
}