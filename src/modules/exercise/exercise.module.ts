import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Exercise, ExerciseSchema } from './entities/exercise.entity';
import { ExerciseAttempt, ExerciseAttemptSchema } from './entities/exercise-attempt.entity';
import { ExerciseController } from './exercise.controller';
import { ExerciseService } from './exercise.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Exercise.name,        schema: ExerciseSchema },
      { name: ExerciseAttempt.name, schema: ExerciseAttemptSchema },
    ]),
    CloudinaryModule,
  ],
  controllers: [ExerciseController],
  providers: [ExerciseService],
  exports: [ExerciseService],
})
export class ExerciseModule {}