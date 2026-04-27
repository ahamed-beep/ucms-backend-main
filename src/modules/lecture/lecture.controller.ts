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
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { LectureService } from './lecture.service';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { LectureResponseDto } from './dto/lecture-response.dto';
import { multerMemoryOptions } from '../cloudinary/multer.config';
import { SerializeResponse } from 'src/common/interceptors/serialize.interceptor';

@SerializeResponse(LectureResponseDto)
@Controller('modules/:moduleId/lectures')
export class LecturesController {
  constructor(private readonly lectureService: LectureService) {}

  @Post()
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
    return this.lectureService.createLecture(
      moduleId,
      dto,
      files?.video?.[0]?.buffer,
      files?.video?.[0]?.originalname,
      files?.doc?.[0]?.buffer,
      files?.doc?.[0]?.originalname,
    );
  }

  @Get()
  async getLecturesByModule(@Param('moduleId') moduleId: string) {
    return this.lectureService.getLecturesByModule(moduleId);
  }

  @Get(':id')
  async getLectureById(@Param('id') id: string) {
    return this.lectureService.getLectureById(id);
  }

  @Patch(':id')
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
    return this.lectureService.updateLecture(
      id,
      dto,
      files?.video?.[0]?.buffer,
      files?.video?.[0]?.originalname,
      files?.doc?.[0]?.buffer,
      files?.doc?.[0]?.originalname,
    );
  }

  @Delete(':id')
  async deleteLecture(@Param('id') id: string) {
    return this.lectureService.deleteLecture(id);
  }
}