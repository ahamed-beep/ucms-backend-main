import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Exercise, ExerciseSchema } from './entities/exercise.entity';
import { ExercisesController } from './exercise.controller';
import { ExerciseService } from './exercise.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Exercise.name, schema: ExerciseSchema }])],
  controllers: [ExercisesController],
  providers: [ExerciseService],
  exports: [ExerciseService],
})
export class ExercisesModule {}