import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CourseModuleService } from './course-module.service';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import { UpdateCourseModuleDto } from './dto/update-course-module.dto';
import { CourseModuleResponseDto } from './dto/course-module-response.dto';
import { SerializeResponse } from 'src/common/interceptors/serialize.interceptor';

@SerializeResponse(CourseModuleResponseDto)
@Controller('courses/:courseId/modules')
export class CourseModuleController {
  constructor(private readonly courseModuleService: CourseModuleService) {}

  @Post()
  async createModule(
    @Param('courseId') courseId: string,
    @Body() dto: CreateCourseModuleDto,
  ) {
    return this.courseModuleService.createModule(courseId, dto);
  }

  @Get()
  async getModulesByCourse(@Param('courseId') courseId: string) {
    return this.courseModuleService.getModulesByCourse(courseId);
  }

  @Get(':id')
  async getModuleById(@Param('id') id: string) {
    return this.courseModuleService.getModuleById(id);
  }

  @Patch(':id')
  async updateModule(
    @Param('id') id: string,
    @Body() dto: UpdateCourseModuleDto,
  ) {
    return this.courseModuleService.updateModule(id, dto);
  }

  @Delete(':id')
  async deleteModule(@Param('id') id: string) {
    return this.courseModuleService.deleteModule(id);
  }
}