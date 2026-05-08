import { UserDocumentDoc } from '../entities/user-document.entity';
import { UpdateDocumentStatusDto } from '../dto/update-document-status.dto';

export interface IUserDocumentService {
 uploadDocument(userId: string, fileBuffer: Buffer, fileName: string, fileSize: string): Promise<UserDocumentDoc>;
  getMyDocuments(userId: string): Promise<UserDocumentDoc[]>;
  getAllDocuments(): Promise<UserDocumentDoc[]>;
  updateDocumentStatus(id: string, dto: UpdateDocumentStatusDto): Promise<UserDocumentDoc>;
  deleteDocument(id: string, userId: string, role: string): Promise<void>;
  downloadDocument(id: string): Promise<string>;
}