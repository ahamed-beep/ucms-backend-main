import { ApplicationDocument } from '../entities/application.entity';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { UpdateApplicationDto } from '../dto/update-application.dto';
import { UpdateApplicationStatusDto } from '../dto/update-application-status.dto';

export interface IApplicationService {
  createApplication(dto: CreateApplicationDto): Promise<ApplicationDocument>;
  getAllApplications(): Promise<ApplicationDocument[]>;
  getMyApplications(userId: string): Promise<ApplicationDocument[]>;
  getApplicationById(id: string): Promise<ApplicationDocument>;
  updateApplication(id: string, dto: UpdateApplicationDto): Promise<ApplicationDocument>;
  updateApplicationStatus(id: string, dto: UpdateApplicationStatusDto): Promise<ApplicationDocument>;
  deleteApplication(id: string): Promise<void>;
}