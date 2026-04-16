import { Expose, Transform } from 'class-transformer';
import { ApplicationStatus } from '../enums/faculty-application.enum';

export class FacultyApplicationResponseDto {
  @Expose()
  @Transform(({ obj }) => obj?.id ?? obj?._id?.toString())
  id: string;

  @Expose()
  fullName: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  @Transform(({ value }) => value ?? null)
  linkedin: string;

  @Expose()
  highestQualification: string;

  @Expose()
  yearsOfExperience: number;

  @Expose()
  institutionAffiliation: string;

  @Expose()
  currentJobPosition: string;

  @Expose()
  previousExperience: string;

  @Expose()
  coverLetter: string;

  @Expose()
  cvUrl: string;

  @Expose()
  status: ApplicationStatus;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}