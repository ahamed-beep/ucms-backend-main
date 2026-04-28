import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { CourseModuleService } from './course-module.service';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import { UpdateCourseModuleDto } from './dto/update-course-module.dto';
import { CourseModuleResponseDto } from './dto/course-module-response.dto';
import { SerializeResponse } from 'src/common/interceptors/serialize.interceptor';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';

function rethrowIfHttp(error: unknown): void {
  if (error instanceof HttpException) throw error;
}

@SerializeResponse(CourseModuleResponseDto)
@UseGuards(RolesGuard, ActiveGuard)
@Controller('courses/:courseId/modules')
export class CourseModuleController {
  constructor(private readonly courseModuleService: CourseModuleService) {}

  @Post()
     @RequireRole('admin')
  async createModule(
    @Param('courseId') courseId: string,
    @Body() dto: CreateCourseModuleDto,
  ) {
    try {
      return await this.courseModuleService.createModule(courseId, dto);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to create module');
    }
  }

  @Get()
     @RequireRole('admin','student')
  async getModulesByCourse(@Param('courseId') courseId: string) {
    try {
      return await this.courseModuleService.getModulesByCourse(courseId);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch modules');
    }
  }

  @Get(':id')
   @RequireRole('admin','student')
  async getModuleById(@Param('id') id: string) {
    try {
      return await this.courseModuleService.getModuleById(id);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch module');
    }
  }

  @Patch(':id')
     @RequireRole('admin')
  async updateModule(
    @Param('id') id: string,
    @Body() dto: UpdateCourseModuleDto,
  ) {
    try {
      return await this.courseModuleService.updateModule(id, dto);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to update module');
    }
  }

  @Delete(':id')
     @RequireRole('admin')
  async deleteModule(@Param('id') id: string) {
    try {
      return await this.courseModuleService.deleteModule(id);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to delete module');
    }
  }
}