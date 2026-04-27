import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Exercise, ExerciseDocument } from './entities/exercise.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { IExerciseService } from './interfaces/exercise.service.interface';

@Injectable()
export class ExerciseService implements IExerciseService {
  constructor(
    @InjectModel(Exercise.name)
    private readonly exerciseModel: Model<ExerciseDocument>,
  ) {}

  async createExercise(courseId: string, dto: CreateExerciseDto): Promise<ExerciseDocument> {
    try {
      const exercise = new this.exerciseModel({ ...dto, courseId });
      return await exercise.save();
    } catch {
      throw new InternalServerErrorException('Failed to create exercise');
    }
  }

  async getExercisesByCourse(courseId: string): Promise<ExerciseDocument[]> {
    try {
      return await this.exerciseModel.find({ courseId });
    } catch {
      throw new InternalServerErrorException('Failed to fetch exercises');
    }
  }

  async getExerciseById(id: string): Promise<ExerciseDocument> {
    try {
      const exercise = await this.exerciseModel.findById(id);
      if (!exercise) {
        throw new NotFoundException(`Exercise with id "${id}" not found`);
      }
      return exercise;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch exercise');
    }
  }

  async updateExercise(id: string, dto: UpdateExerciseDto): Promise<ExerciseDocument> {
    try {
      const exercise = await this.exerciseModel.findById(id);
      if (!exercise) {
        throw new NotFoundException(`Exercise with id "${id}" not found`);
      }
      Object.assign(exercise, dto);
      return await exercise.save();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update exercise');
    }
  }

  async deleteExercise(id: string): Promise<void> {
    try {
      const exercise = await this.exerciseModel.findById(id);
      if (!exercise) {
        throw new NotFoundException(`Exercise with id "${id}" not found`);
      }
      await exercise.deleteOne();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete exercise');
    }
  }
}