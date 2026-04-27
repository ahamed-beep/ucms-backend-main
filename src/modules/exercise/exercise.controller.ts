import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ExerciseResponseDto } from './dto/exercise-response.dto';
import { SerializeResponse } from 'src/common/interceptors/serialize.interceptor';

@SerializeResponse(ExerciseResponseDto)
@Controller('courses/:courseId/exercises')
export class ExercisesController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Post()
  async createExercise(
    @Param('courseId') courseId: string,
    @Body() dto: CreateExerciseDto,
  ) {
    return this.exerciseService.createExercise(courseId, dto);
  }

  @Get()
  async getExercisesByCourse(@Param('courseId') courseId: string) {
    return this.exerciseService.getExercisesByCourse(courseId);
  }

  @Get(':id')
  async getExerciseById(@Param('id') id: string) {
    return this.exerciseService.getExerciseById(id);
  }

  @Patch(':id')
  async updateExercise(
    @Param('id') id: string,
    @Body() dto: UpdateExerciseDto,
  ) {
    return this.exerciseService.updateExercise(id, dto);
  }

  @Delete(':id')
  async deleteExercise(@Param('id') id: string) {
    return this.exerciseService.deleteExercise(id);
  }
}