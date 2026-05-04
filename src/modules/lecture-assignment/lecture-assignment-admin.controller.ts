import {
  Controller,
  Post,
  Patch,
  Delete,
  Get,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  HttpCode,
  HttpStatus,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LectureAssignmentService } from './lecture-assignment.service';
import { CreateLectureAssignmentDto } from './dto/create-lecture-assignment.dto';
import { UpdateLectureAssignmentDto } from './dto/update-lecture-assignment.dto';
import { GradeSubmissionDto } from './dto/grade-submission.dto';
import { LectureAssignmentResponseDto } from './dto/lecture-assignment-response.dto';
import { SerializeResponse } from 'src/common/interceptors/serialize.interceptor';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';
import { multerMemoryOptions } from '../cloudinary/multer.config';
import { LectureAssignmentSubmissionResponseDto } from './dto/lecture-assignment-submission-response.dto';

function rethrowIfHttp(error: unknown): void {
  if (error instanceof HttpException) throw error;
}

@UseGuards(RolesGuard, ActiveGuard)
@RequireRole('admin')
@Controller('lectures/:lectureId/assignments')
export class LectureAssignmentAdminController {
  constructor(private readonly assignmentService: LectureAssignmentService) {}

  @Post()
  @SerializeResponse(LectureAssignmentResponseDto)
  async createAssignment(
    @Param('lectureId') lectureId: string,
    @Body() dto: CreateLectureAssignmentDto,
  ) {
    try {
      return await this.assignmentService.createAssignment(lectureId, dto);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to create assignment');
    }
  }

  @Patch(':assignmentId')
  @SerializeResponse(LectureAssignmentResponseDto)
  async updateAssignment(
    @Param('assignmentId') assignmentId: string,
    @Body() dto: UpdateLectureAssignmentDto,
  ) {
    try {
      return await this.assignmentService.updateAssignment(assignmentId, dto);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to update assignment');
    }
  }

  @Delete(':assignmentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAssignment(@Param('assignmentId') assignmentId: string) {
    try {
      return await this.assignmentService.deleteAssignment(assignmentId);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to delete assignment');
    }
  }

  @Get()
  @SerializeResponse(LectureAssignmentResponseDto)
  async getAssignmentsAdmin(@Param('lectureId') lectureId: string) {
    try {
      return await this.assignmentService.getAssignmentsForLectureAdmin(lectureId);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch assignments');
    }
  }

  @Get(':assignmentId/submissions')
  @SerializeResponse(LectureAssignmentSubmissionResponseDto)
  async getSubmissions(@Param('assignmentId') assignmentId: string) {
    try {
      return await this.assignmentService.getSubmissionsForAssignment(assignmentId);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch submissions');
    }
  }

  @Patch(':assignmentId/submissions/:userId/grade')
  @SerializeResponse(LectureAssignmentSubmissionResponseDto)
  async gradeSubmission(
    @Param('assignmentId') assignmentId: string,
    @Param('userId') userId: string,
    @Body() dto: GradeSubmissionDto,
  ) {
    try {
      return await this.assignmentService.gradeSubmission(assignmentId, userId, dto);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to grade submission');
    }
  }
}