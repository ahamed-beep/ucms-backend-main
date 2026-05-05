import {
  Controller,
  Get,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LectureAssignmentService } from './lecture-assignment.service';
import { LectureAssignmentResponseDto } from './dto/lecture-assignment-response.dto';
import { SerializeResponse } from 'src/common/interceptors/serialize.interceptor';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ModuleEnrollmentGuard } from 'src/common/guards/module-enrollment.guard';
import { multerMemoryOptions } from '../cloudinary/multer.config';
import { LectureAssignmentSubmissionResponseDto } from './dto/lecture-assignment-submission-response.dto';

function rethrowIfHttp(error: unknown): void {
  if (error instanceof HttpException) throw error;
}

@UseGuards(RolesGuard, ActiveGuard)
@RequireRole('student')
@UseGuards(ModuleEnrollmentGuard)
@Controller('lectures/:lectureId/assignments')
export class LectureAssignmentStudentController {
  constructor(private readonly assignmentService: LectureAssignmentService) {}

  @Get('student')
  @SerializeResponse(LectureAssignmentResponseDto)
  async getAssignments(
    @Param('lectureId') lectureId: string,
    @CurrentUser() user: any,
  ) {
    try {
      return await this.assignmentService.getAssignmentsForLecture(lectureId, user.userId);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch assignments');
    }
  }

  @Post(':assignmentId/submit')
  @UseInterceptors(FileInterceptor('file', multerMemoryOptions))
  @SerializeResponse(LectureAssignmentSubmissionResponseDto)
  async submitAssignment(
    @Param('assignmentId') assignmentId: string,
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      return await this.assignmentService.submitAssignment(
        assignmentId,
        user.userId,
        file.buffer,
        file.originalname,
      );
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to submit assignment');
    }
  }
}