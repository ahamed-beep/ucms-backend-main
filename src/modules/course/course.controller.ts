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
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { multerMemoryOptions, imageFilePipe } from '../cloudinary/multer.config';
import { SerializeResponse } from 'src/common/interceptors/serialize.interceptor';
import { CourseResponseDto } from './dto/course-response.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';

@SerializeResponse(CourseResponseDto)
@UseGuards(RolesGuard, ActiveGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
@RequireRole('admin')
@UseInterceptors(FileInterceptor('thumbnail', multerMemoryOptions))
async createCourse(
  @Body() dto: CreateCourseDto,
  @UploadedFile(imageFilePipe(false)) thumbnail?: Express.Multer.File,
) {
  Logger.log('createCourse dto:', dto);           
  Logger.log('thumbnail:', thumbnail?.originalname); 
  return this.courseService.createCourse(
    dto,
    thumbnail?.buffer,
    thumbnail?.originalname,
  );
}

  @Get()
    @RequireRole('student','admin')
  async getAllCourses() {
    return this.courseService.getAllCourses();
  }

  @Get(':id')
    @RequireRole('student','admin')
  @UseGuards(RolesGuard, ActiveGuard)
    @RequireRole('student')
  async getCourseById(@Param('id') id: string) {
    return this.courseService.getCourseById(id);
  }

  @Patch(':id')
    @RequireRole('admin')
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
    @RequireRole('admin')
  async deleteCourse(@Param('id') id: string) {
    return this.courseService.deleteCourse(id);
  }
}