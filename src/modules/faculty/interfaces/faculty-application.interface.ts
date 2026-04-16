import { ApplicationStatus } from '../enums/faculty-application.enum';

export interface IFacultyApplication {
  fullName: string;
  email: string;
  phone: string;
  linkedin?: string;
  highestQualification: string;
  yearsOfExperience: number;
  institutionAffiliation: string;
  currentJobPosition: string;
  previousExperience: string;
  coverLetter: string;
  cvUrl: string;
  cvPublicId: string;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEmailPayload {
  to: string;
  subject: string;
  html: string;
}