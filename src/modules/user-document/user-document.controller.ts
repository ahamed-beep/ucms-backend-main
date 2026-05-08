import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDocumentService } from './user-document.service';
import { CreateUserDocumentDto } from './dto/create-user-document.dto';
import { UpdateDocumentStatusDto } from './dto/update-document-status.dto';
import { UserDocumentResponseDto } from './dto/user-document-response.dto';
import { SerializeResponse } from 'src/common/interceptors/serialize.interceptor';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';
import { multerMemoryOptions } from '../cloudinary/multer.config';

function rethrowIfHttp(error: unknown): void {
  if (error instanceof HttpException) throw error;
}

function getFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

@SerializeResponse(UserDocumentResponseDto)
@UseGuards(RolesGuard, ActiveGuard)
@Controller('user-documents')
export class UserDocumentController {
  constructor(private readonly userDocumentService: UserDocumentService) {}

 @Post()
@RequireRole('student')
@UseInterceptors(FileInterceptor('file', multerMemoryOptions))
async uploadDocument(
  @Request() req: any,
  @UploadedFile() file: Express.Multer.File,
) {
  try {
    return await this.userDocumentService.uploadDocument(
      req.user.userId,
      file.buffer,
      file.originalname,
      getFileSize(file.size),
    );
  } catch (error) {
    rethrowIfHttp(error);
    throw new InternalServerErrorException('Failed to upload document');
  }
}

  @Get('my-documents')
  @RequireRole('student')
  async getMyDocuments(@Request() req: any) {
    try {
      return await this.userDocumentService.getMyDocuments(req.user.userId);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch documents');
    }
  }

  @Get('download/:id')
  @RequireRole('admin', 'student')
  async downloadDocument(@Param('id') id: string) {
    try {
      return await this.userDocumentService.downloadDocument(id);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to download document');
    }
  }

  @Get()
  @RequireRole('admin')
  async getAllDocuments() {
    try {
      return await this.userDocumentService.getAllDocuments();
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch documents');
    }
  }

  @Patch(':id/status')
  @RequireRole('admin')
  async updateDocumentStatus(
    @Param('id') id: string,
    @Body() dto: UpdateDocumentStatusDto,
  ) {
    try {
      return await this.userDocumentService.updateDocumentStatus(id, dto);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to update status');
    }
  }

  @Delete(':id')
  @RequireRole('admin', 'student')
  async deleteDocument(@Param('id') id: string, @Request() req: any) {
    try {
      return await this.userDocumentService.deleteDocument(id, req.user.userId, req.user.role);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to delete document');
    }
  }
}