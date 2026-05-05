import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LectureQuiz, LectureQuizSchema } from './entities/lecture-quiz.entity';
import { LectureQuizCompletion, LectureQuizCompletionSchema } from './entities/lecture-quiz-completion.entity';
import { Quiz, QuizSchema } from '../quiz/entities/quiz.entity';
import { Lecture, LectureSchema } from '../lecture/entities/lecture.entity';
import { CourseModule, CourseModuleSchema } from '../course-module/entities/course-module.entity';
import { LectureProgress, LectureProgressSchema } from '../lecture-progress/entities/lecture-progress.entity';
import { Enrollment, EnrollmentSchema } from '../enrollment/entities/enrollment.entity';
import { LectureQuizService } from './lecture-quiz.service';
import { LectureQuizController } from './lecture-quiz.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LectureQuiz.name, schema: LectureQuizSchema },
      { name: LectureQuizCompletion.name, schema: LectureQuizCompletionSchema },
      { name: Quiz.name, schema: QuizSchema },
      { name: Lecture.name, schema: LectureSchema },
      { name: CourseModule.name, schema: CourseModuleSchema },
      { name: LectureProgress.name, schema: LectureProgressSchema },
      { name: Enrollment.name, schema: EnrollmentSchema },
    ]),
  ],
  controllers: [LectureQuizController],
  providers: [LectureQuizService],
})
export class LectureQuizModule {}