import { AdmissionDeadlineDocument } from '../entities/admission-deadline.entity';

export interface IAdmissionDeadlineResponse {
  success: boolean;
  data: AdmissionDeadlineDocument | AdmissionDeadlineDocument[];
}

export interface IDeleteResponse {
  success: boolean;
  message: string;
}