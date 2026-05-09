import { CreateExerciseDto, UpdateExerciseDto } from '../dto/exercise.dto';
import { ExerciseDocument } from '../entities/exercise.entity';


export interface IExerciseService {
  createExercise(courseId: string, dto: CreateExerciseDto): Promise<ExerciseDocument>;
  getExercisesByCourse(courseId: string): Promise<ExerciseDocument[]>;
  getExerciseById(id: string): Promise<ExerciseDocument>;
  updateExercise(id: string, dto: UpdateExerciseDto): Promise<ExerciseDocument>;
  deleteExercise(id: string): Promise<void>;
}