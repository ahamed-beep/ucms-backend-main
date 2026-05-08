import { SupportDocument } from '../entities/support.entity';
import { CreateSupportDto } from '../dto/create-support.dto';
import { UpdateSupportStatusDto } from '../dto/update-support-status.dto';

export interface ISupportService {
  create(dto: CreateSupportDto): Promise<SupportDocument>;
  findAll(): Promise<SupportDocument[]>;
  findById(id: string): Promise<SupportDocument>;
  updateStatus(id: string, dto: UpdateSupportStatusDto): Promise<SupportDocument>;
  delete(id: string): Promise<void>;
}