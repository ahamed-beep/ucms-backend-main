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
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExerciseService } from './exercise.service';
import { multerMemoryOptions } from '../cloudinary/multer.config';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { RequestUser } from 'src/common/interfaces/jwt-payload.interface';
import { CreateExerciseDto, ReviewAttemptDto, SubmitAttemptDto, UpdateExerciseDto } from './dto/exercise.dto';

function rethrowIfHttp(error: unknown): void {
  if (error instanceof HttpException) throw error;
}

@UseGuards(RolesGuard, ActiveGuard)
@Controller('courses/:courseId/exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}


  @Post()
  @RequireRole('admin')
  @UseInterceptors(FileInterceptor('audio', multerMemoryOptions))
  async createExercise(
    @Param('courseId') courseId: string,
    @Body() dto: CreateExerciseDto,
    @UploadedFile() audio?: Express.Multer.File,
  ) {
    try {
      return await this.exerciseService.createExercise(
        courseId,
        dto,
        audio?.buffer,
        audio?.originalname,
      );
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to create exercise');
    }
  }

  @Get()
  @RequireRole('admin', 'student')
  async getExercisesByCourse(@Param('courseId') courseId: string) {
    try {
      return await this.exerciseService.getExercisesByCourse(courseId);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch exercises');
    }
  }

  @Get(':id')
  @RequireRole('admin', 'student')
  async getExerciseById(@Param('id') id: string) {
    try {
      return await this.exerciseService.getExerciseById(id);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch exercise');
    }
  }

  @Patch(':id')
  @RequireRole('admin')
  @UseInterceptors(FileInterceptor('audio', multerMemoryOptions))
  async updateExercise(
    @Param('id') id: string,
    @Body() dto: UpdateExerciseDto,
    @UploadedFile() audio?: Express.Multer.File,
  ) {
    try {
      return await this.exerciseService.updateExercise(
        id,
        dto,
        audio?.buffer,
        audio?.originalname,
      );
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to update exercise');
    }
  }

  @Delete(':id')
  @RequireRole('admin')
  async deleteExercise(@Param('id') id: string) {
    try {
      return await this.exerciseService.deleteExercise(id);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to delete exercise');
    }
  }


  @Get(':id/attempts')
  @RequireRole('admin')
  async getAttemptsByExercise(@Param('id') id: string) {
    try {
      return await this.exerciseService.getAttemptsByExercise(id);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch attempts');
    }
  }

  @Patch('attempts/:attemptId/review')
  @RequireRole('admin')
  async reviewWritingAttempt(
    @Param('attemptId') attemptId: string,
    @Body() dto: ReviewAttemptDto,
  ) {
    try {
      return await this.exerciseService.reviewWritingAttempt(attemptId, dto);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to review attempt');
    }
  }


  @Post(':id/submit')
  @RequireRole('student')
  async submitAttempt(
    @Param('id') exerciseId: string,
    @CurrentUser() user: RequestUser,
    @Body() dto: SubmitAttemptDto,
  ) {
    try {
      return await this.exerciseService.submitAttempt(exerciseId, user.userId, dto);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to submit attempt');
    }
  }

  @Get(':id/my-attempts')
  @RequireRole('student')
  async getMyAttempts(
    @Param('id') exerciseId: string,
    @CurrentUser() user: RequestUser,
  ) {
    try {
      return await this.exerciseService.getMyAttempts(exerciseId, user.userId);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch attempts');
    }
  }
}