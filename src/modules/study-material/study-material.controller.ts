import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Request,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StudyMaterialService } from './study-material.service';
import { CreateStudyMaterialDto } from './dto/create-study-material.dto';
import { UpdateStudyMaterialDto } from './dto/update-study-material.dto';
import { StudyMaterialResponseDto } from './dto/study-material-response.dto';
import { multerMemoryOptions } from '../cloudinary/multer.config';
import { SerializeResponse } from 'src/common/interceptors/serialize.interceptor';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';
import { EnrollmentGuard } from 'src/common/guards/enrollment.guard';

function rethrowIfHttp(error: unknown): void {
  if (error instanceof HttpException) throw error;
}

function getFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

@SerializeResponse(StudyMaterialResponseDto)
@UseGuards(RolesGuard, ActiveGuard)
@Controller('courses/:courseId/study-materials')
export class StudyMaterialController {
  constructor(private readonly studyMaterialService: StudyMaterialService) {}

  @Post()
  @RequireRole('admin')
  @UseInterceptors(FileInterceptor('file', multerMemoryOptions))
  async createStudyMaterial(
    @Param('courseId') courseId: string,
    @Body() dto: CreateStudyMaterialDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      dto.courseId = courseId;
      return await this.studyMaterialService.createStudyMaterial(
        dto,
        file.buffer,
        file.originalname,
        getFileSize(file.size),
      );
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to create study material');
    }
  }

  @Get()
  @RequireRole('admin', 'student')
  async getMaterialsByCourse(@Param('courseId') courseId: string) {
    try {
      return await this.studyMaterialService.getMaterialsByCourse(courseId);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch study materials');
    }
  }

  @Get('by-class/:classSessionId')
  @RequireRole('admin', 'student')
  @UseGuards(EnrollmentGuard)
  async getMaterialsByClassSession(@Param('classSessionId') classSessionId: string) {
    try {
      return await this.studyMaterialService.getMaterialsByClassSession(classSessionId);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch class materials');
    }
  }

  @Get(':id')
  @RequireRole('admin', 'student')
  @UseGuards(EnrollmentGuard)
  async getMaterialById(@Param('id') id: string) {
    try {
      return await this.studyMaterialService.getMaterialById(id);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch study material');
    }
  }

  @Patch(':id')
  @RequireRole('admin')
  @UseInterceptors(FileInterceptor('file', multerMemoryOptions))
  async updateStudyMaterial(
    @Param('id') id: string,
    @Body() dto: UpdateStudyMaterialDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      return await this.studyMaterialService.updateStudyMaterial(
        id,
        dto,
        file?.buffer,
        file?.originalname,
        file ? getFileSize(file.size) : undefined,
      );
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to update study material');
    }
  }

  @Delete(':id')
  @RequireRole('admin')
  async deleteStudyMaterial(@Param('id') id: string) {
    try {
      return await this.studyMaterialService.deleteStudyMaterial(id);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to delete study material');
    }
  }
}