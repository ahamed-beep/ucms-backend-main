import {
  Controller,
  Post,
  Patch,
  Get,
  Param,
  Body,
  UseGuards,
  HttpException,
  InternalServerErrorException,
  Request,
  Delete,
} from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { EnrollmentResponseDto } from './dto/enrollment-response.dto';
import { SerializeResponse } from 'src/common/interceptors/serialize.interceptor';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';

function rethrowIfHttp(error: unknown): void {
  if (error instanceof HttpException) throw error;
}
@SerializeResponse(EnrollmentResponseDto)
@UseGuards(RolesGuard, ActiveGuard)
@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  @RequireRole('admin')
  @SerializeResponse(EnrollmentResponseDto)
  async enrollStudent(@Body() dto: CreateEnrollmentDto) {
    try {
      return await this.enrollmentService.enrollStudent(dto);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to enroll student');
    }
  }

  @Patch(':id/toggle')
  @RequireRole('admin')
  @SerializeResponse(EnrollmentResponseDto)
  async toggleEnrollment(@Param('id') id: string) {
    try {
      return await this.enrollmentService.toggleEnrollment(id);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to toggle enrollment');
    }
  }

@Get()
@RequireRole('admin')
async getAllEnrollments() {
  try {
    return await this.enrollmentService.getAllEnrollments();
  } catch (error) {
    rethrowIfHttp(error);
    throw new InternalServerErrorException('Failed to fetch enrollments');
  }
}
  @Get('course/:courseId')
  @RequireRole('admin')
  @SerializeResponse(EnrollmentResponseDto)
  async getEnrollmentsByCourse(@Param('courseId') courseId: string) {
    try {
      return await this.enrollmentService.getEnrollmentsByCourse(courseId);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch enrollments');
    }
  }

 @Get('my-courses')
  @RequireRole('student')
  async getMyEnrolledCourses(@Request() req: any) {
    try {
      return await this.enrollmentService.getEnrollmentsByStudent(req.user.userId);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch enrolled courses');
    }
  }

  @Delete(':id')
@RequireRole('admin')
async deleteEnrollment(@Param('id') id: string) {
  try {
    return await this.enrollmentService.deleteEnrollment(id);
  } catch (error) {
    rethrowIfHttp(error);
    throw new InternalServerErrorException('Failed to delete enrollment');
  }
}
}

