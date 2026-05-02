import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  UseGuards,
  InternalServerErrorException,
  HttpException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LectureQuizService } from './lecture-quiz.service';
import { AttachQuizDto } from './dto/attach-quiz.dto';
import { SubmitLectureQuizDto } from './dto/submit-lecture-quiz.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SerializeResponse } from 'src/common/interceptors/serialize.interceptor';
import { LectureQuizItemResponseDto } from './dto/lecture-quiz-response.dto';
import { ModuleEnrollmentGuard } from 'src/common/guards/module-enrollment.guard';

function rethrowIfHttp(error: unknown): void {
  if (error instanceof HttpException) throw error;
}

@UseGuards(RolesGuard, ActiveGuard)
@Controller('lectures/:lectureId/quizzes')
export class LectureQuizController {
  constructor(private readonly lectureQuizService: LectureQuizService) {}

  @Post()
  @RequireRole('admin')
  @SerializeResponse(LectureQuizItemResponseDto)
  async attachQuiz(
    @Param('lectureId') lectureId: string,
    @Body() dto: AttachQuizDto,
  ) {
    try {
      return await this.lectureQuizService.attachQuiz(lectureId, dto);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to attach quiz');
    }
  }

  @Delete(':quizId')
  @RequireRole('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async detachQuiz(
    @Param('lectureId') lectureId: string,
    @Param('quizId') quizId: string,
  ) {
    try {
      return await this.lectureQuizService.detachQuiz(lectureId, quizId);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to detach quiz');
    }
  }

  @Get('admin')
  @RequireRole('admin')
  @SerializeResponse(LectureQuizItemResponseDto)
  async getQuizzesAdmin(@Param('lectureId') lectureId: string) {
    try {
      return await this.lectureQuizService.getQuizzesForLectureAdmin(lectureId);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch quizzes');
    }
  }

@Get()
@RequireRole('student')
@UseGuards(ModuleEnrollmentGuard)
@SerializeResponse(LectureQuizItemResponseDto)
async getQuizzes(
  @Param('lectureId') lectureId: string,
  @CurrentUser() user: any,
) {
  return await this.lectureQuizService.getQuizzesForLecture(lectureId, user.userId);
}

 @Post(':quizId/submit')
@RequireRole('student')
@UseGuards(ModuleEnrollmentGuard)
async submitQuiz(
  @Param('lectureId') lectureId: string,
  @Param('quizId') quizId: string,
  @CurrentUser() user: any,
  @Body() dto: SubmitLectureQuizDto,
) {
  return await this.lectureQuizService.submitLectureQuiz(lectureId, quizId, user.userId, dto);
}
}