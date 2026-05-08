import { IsEnum } from 'class-validator';
import { DocumentStatus } from '../enums/document-status.enum';

export class UpdateDocumentStatusDto {
  @IsEnum(DocumentStatus)
  status: DocumentStatus;
}