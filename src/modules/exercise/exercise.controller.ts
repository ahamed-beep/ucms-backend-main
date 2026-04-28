import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  InternalServerErrorException,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ExerciseResponseDto } from './dto/exercise-response.dto';
import { SerializeResponse } from 'src/common/interceptors/serialize.interceptor';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';

function rethrowIfHttp(error: unknown): void {
  if (error instanceof HttpException) throw error;
}

@SerializeResponse(ExerciseResponseDto)
@UseGuards(RolesGuard, ActiveGuard)
@Controller('courses/:courseId/exercises')
export class ExercisesController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Post()
  @RequireRole('admin')
  async createExercise(
    @Param('courseId') courseId: string,
    @Body() dto: CreateExerciseDto,
  ) {
    try {
      return await this.exerciseService.createExercise(courseId, dto);
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
  async updateExercise(
    @Param('id') id: string,
    @Body() dto: UpdateExerciseDto,
  ) {
    try {
      return await this.exerciseService.updateExercise(id, dto);
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
}