import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFiles,
  UseInterceptors,
  InternalServerErrorException,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { LectureService } from './lecture.service';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { LectureResponseDto } from './dto/lecture-response.dto';
import { multerMemoryOptions } from '../cloudinary/multer.config';
import { SerializeResponse } from 'src/common/interceptors/serialize.interceptor';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';
import { ModuleEnrollmentGuard } from 'src/common/guards/module-enrollment.guard';

function rethrowIfHttp(error: unknown): void {
  if (error instanceof HttpException) throw error;
}

@SerializeResponse(LectureResponseDto)
@UseGuards(RolesGuard, ActiveGuard)
@Controller('modules/:moduleId/lectures')
export class LecturesController {
  constructor(private readonly lectureService: LectureService) {}

  @Post()
  @RequireRole('admin')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'video', maxCount: 1 },
        { name: 'doc', maxCount: 1 },
      ],
      multerMemoryOptions,
    ),
  )
  async createLecture(
    @Param('moduleId') moduleId: string,
    @Body() dto: CreateLectureDto,
    @UploadedFiles()
    files?: { video?: Express.Multer.File[]; doc?: Express.Multer.File[] },
  ) {
    try {
      return await this.lectureService.createLecture(
        moduleId,
        dto,
        files?.video?.[0]?.buffer,
        files?.video?.[0]?.originalname,
        files?.doc?.[0]?.buffer,
        files?.doc?.[0]?.originalname,
      );
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to create lecture');
    }
  }

  @Get()
  @RequireRole('admin', 'student')
  @UseGuards(ModuleEnrollmentGuard)
  async getLecturesByModule(@Param('moduleId') moduleId: string) {
    try {
      return await this.lectureService.getLecturesByModule(moduleId);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch lectures');
    }
  }

  @Get(':id')
  @RequireRole('admin', 'student')
  @UseGuards(ModuleEnrollmentGuard)
  async getLectureById(@Param('id') id: string) {
    try {
      return await this.lectureService.getLectureById(id);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch lecture');
    }
  }

  @Patch(':id')
  @RequireRole('admin')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'video', maxCount: 1 },
        { name: 'doc', maxCount: 1 },
      ],
      multerMemoryOptions,
    ),
  )
  async updateLecture(
    @Param('id') id: string,
    @Body() dto: UpdateLectureDto,
    @UploadedFiles()
    files?: { video?: Express.Multer.File[]; doc?: Express.Multer.File[] },
  ) {
    try {
      return await this.lectureService.updateLecture(
        id,
        dto,
        files?.video?.[0]?.buffer,
        files?.video?.[0]?.originalname,
        files?.doc?.[0]?.buffer,
        files?.doc?.[0]?.originalname,
      );
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to update lecture');
    }
  }

  @Delete(':id')
  @RequireRole('admin')
  async deleteLecture(@Param('id') id: string) {
    try {
      return await this.lectureService.deleteLecture(id);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to delete lecture');
    }
  }
}