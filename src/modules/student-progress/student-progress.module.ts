import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Enrollment, EnrollmentSchema } from '../enrollment/entities/enrollment.entity';
import { CourseModule as CourseModuleEntity, CourseModuleSchema } from '../course-module/entities/course-module.entity';
import { Lecture, LectureSchema } from '../lecture/entities/lecture.entity';
import { LectureProgress, LectureProgressSchema } from '../lecture-progress/entities/lecture-progress.entity';
import { LectureQuizCompletion, LectureQuizCompletionSchema } from '../lecture-quiz/entities/lecture-quiz-completion.entity';
import { LectureAssignmentSubmission, LectureAssignmentSubmissionSchema } from '../lecture-assignment/entities/lecture-assignment-submission.entity';
import { LectureAssignment, LectureAssignmentSchema } from '../lecture-assignment/entities/lecture-assignment.entity';
import { LectureQuiz, LectureQuizSchema } from '../lecture-quiz/entities/lecture-quiz.entity';
import { Quiz, QuizSchema } from '../quiz/entities/quiz.entity';
import { StudentProgressService } from './student-progress.service';
import { StudentProgressController } from './student-progress.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Enrollment.name, schema: EnrollmentSchema },
      { name: CourseModuleEntity.name, schema: CourseModuleSchema },
      { name: Lecture.name, schema: LectureSchema },
      { name: LectureProgress.name, schema: LectureProgressSchema },
      { name: LectureQuizCompletion.name, schema: LectureQuizCompletionSchema },
      { name: LectureAssignmentSubmission.name, schema: LectureAssignmentSubmissionSchema },
      { name: LectureAssignment.name, schema: LectureAssignmentSchema },
      { name: LectureQuiz.name, schema: LectureQuizSchema },
      { name: Quiz.name, schema: QuizSchema },
    ]),
  ],
  controllers: [StudentProgressController],
  providers: [StudentProgressService],
})
export class StudentProgressModule {}