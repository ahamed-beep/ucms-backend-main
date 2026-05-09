import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Exercise, ExerciseDocument } from './entities/exercise.entity';
import { ExerciseAttempt, ExerciseAttemptDocument } from './entities/exercise-attempt.entity';

import { ExerciseType, AttemptStatus } from './enums/exercise.enum';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateExerciseDto, ReviewAttemptDto, SubmitAttemptDto, UpdateExerciseDto } from './dto/exercise.dto';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectModel(Exercise.name)
    private readonly exerciseModel: Model<ExerciseDocument>,

    @InjectModel(ExerciseAttempt.name)
    private readonly attemptModel: Model<ExerciseAttemptDocument>,

    private readonly cloudinaryService: CloudinaryService,
  ) {}


  async createExercise(
    courseId: string,
    dto: CreateExerciseDto,
    audioBuffer?: Buffer,
    audioName?: string,
  ): Promise<ExerciseDocument> {
    try {
      const exercise = new this.exerciseModel({ ...dto, courseId });

      if (dto.type === ExerciseType.LISTENING) {
        if (!audioBuffer || !audioName) {
          throw new BadRequestException('Audio file is required for listening exercise');
        }
        const uploaded = await this.cloudinaryService.uploadVideo(
          audioBuffer,
          audioName,
          'courses/exercises/audio',
        );
        exercise.audioUrl = uploaded.secureUrl;
        exercise.audioPublicId = uploaded.publicId;
      }

      return await exercise.save();
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Failed to create exercise');
    }
  }

  async getExercisesByCourse(courseId: string): Promise<ExerciseDocument[]> {
    try {
      return await this.exerciseModel.find({ courseId }).select('-correctOption');
    } catch {
      throw new InternalServerErrorException('Failed to fetch exercises');
    }
  }

  async getExerciseById(id: string): Promise<ExerciseDocument> {
    try {
      const exercise = await this.exerciseModel.findById(id).select('-correctOption');
      if (!exercise) throw new NotFoundException('Exercise not found');
      return exercise;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch exercise');
    }
  }

  async updateExercise(
    id: string,
    dto: UpdateExerciseDto,
    audioBuffer?: Buffer,
    audioName?: string,
  ): Promise<ExerciseDocument> {
    try {
      const exercise = await this.exerciseModel.findById(id);
      if (!exercise) throw new NotFoundException('Exercise not found');

      if (audioBuffer && audioName) {
        if (exercise.audioPublicId) {
          await this.cloudinaryService.deleteFile(exercise.audioPublicId, 'video');
        }
        const uploaded = await this.cloudinaryService.uploadVideo(
          audioBuffer,
          audioName,
          'courses/exercises/audio',
        );
        exercise.audioUrl = uploaded.secureUrl;
        exercise.audioPublicId = uploaded.publicId;
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
      if (!exercise) throw new NotFoundException('Exercise not found');

      if (exercise.audioPublicId) {
        await this.cloudinaryService.deleteFile(exercise.audioPublicId, 'video');
      }

      await exercise.deleteOne();
      await this.attemptModel.deleteMany({ exerciseId: id });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete exercise');
    }
  }


  async submitAttempt(
    exerciseId: string,
    studentId: string,
    dto: SubmitAttemptDto,
  ): Promise<ExerciseAttemptDocument> {
    try {
      const exercise = await this.exerciseModel.findById(exerciseId);
      if (!exercise) throw new NotFoundException('Exercise not found');

      this.validateSubmission(exercise, dto);

      let isCorrect: boolean | undefined;

      if (
        exercise.type === ExerciseType.READING ||
        exercise.type === ExerciseType.SPEAKING
      ) {
        isCorrect = dto.selectedOption === exercise.correctOption;
      }

      if (exercise.type === ExerciseType.LISTENING) {
        isCorrect =
          dto.transcriptText?.trim().toLowerCase() ===
          exercise.title?.trim().toLowerCase();
      }

      const attempt = new this.attemptModel({
        exerciseId: new Types.ObjectId(exerciseId),
        studentId:  new Types.ObjectId(studentId),
        ...dto,
        isCorrect,
        status: AttemptStatus.PENDING,
      });

      return await attempt.save();
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Failed to submit attempt');
    }
  }

  async getMyAttempts(
    exerciseId: string,
    studentId: string,
  ): Promise<ExerciseAttemptDocument[]> {
    try {
      return await this.attemptModel
        .find({ exerciseId, studentId })
        .sort({ createdAt: -1 });
    } catch {
      throw new InternalServerErrorException('Failed to fetch attempts');
    }
  }


  async getAttemptsByExercise(exerciseId: string): Promise<ExerciseAttemptDocument[]> {
    try {
      return await this.attemptModel
        .find({ exerciseId })
        .populate('studentId', 'firstName lastName emailId')
        .sort({ createdAt: -1 });
    } catch {
      throw new InternalServerErrorException('Failed to fetch attempts');
    }
  }

  async reviewWritingAttempt(
    attemptId: string,
    dto: ReviewAttemptDto,
  ): Promise<ExerciseAttemptDocument> {
    try {
      const attempt = await this.attemptModel.findById(attemptId);
      if (!attempt) throw new NotFoundException('Attempt not found');

      attempt.adminFeedback = dto.adminFeedback;
      attempt.status = AttemptStatus.REVIEWED;
      return await attempt.save();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to review attempt');
    }
  }


  private validateSubmission(exercise: ExerciseDocument, dto: SubmitAttemptDto): void {
    if (exercise.type === ExerciseType.WRITING && !dto.essayText?.trim()) {
      throw new BadRequestException('Essay text is required for writing exercise');
    }
    if (
      (exercise.type === ExerciseType.READING || exercise.type === ExerciseType.SPEAKING) &&
      !dto.selectedOption
    ) {
      throw new BadRequestException('Selected option is required');
    }
    if (exercise.type === ExerciseType.LISTENING && !dto.transcriptText?.trim()) {
      throw new BadRequestException('Transcript text is required for listening exercise');
    }
  }
}