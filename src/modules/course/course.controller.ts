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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { multerMemoryOptions, imageFilePipe } from '../cloudinary/multer.config';
import { SerializeResponse } from 'src/common/interceptors/serialize.interceptor';
import { CourseResponseDto } from './dto/course-response.dto';

@SerializeResponse(CourseResponseDto)
@Controller('courses')
export class CoursesController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @UseInterceptors(FileInterceptor('thumbnail', multerMemoryOptions))
  async createCourse(
    @Body() dto: CreateCourseDto,
    @UploadedFile(imageFilePipe(false)) thumbnail?: Express.Multer.File,
  ) {
    return this.courseService.createCourse(
      dto,
      thumbnail?.buffer,
      thumbnail?.originalname,
    );
  }

  @Get()
  async getAllCourses() {
    return this.courseService.getAllCourses();
  }

  @Get(':slug')
  async getCourseBySlug(@Param('slug') slug: string) {
    return this.courseService.getCourseBySlug(slug);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('thumbnail', multerMemoryOptions))
  async updateCourse(
    @Param('id') id: string,
    @Body() dto: UpdateCourseDto,
    @UploadedFile(imageFilePipe(false)) thumbnail?: Express.Multer.File,
  ) {
    return this.courseService.updateCourse(
      id,
      dto,
      thumbnail?.buffer,
      thumbnail?.originalname,
    );
  }

  @Delete(':id')
  async deleteCourse(@Param('id') id: string) {
    return this.courseService.deleteCourse(id);
  }
}