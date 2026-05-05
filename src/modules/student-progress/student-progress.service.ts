import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Enrollment, EnrollmentDocument } from '../enrollment/entities/enrollment.entity';
import { CourseModule as CourseModuleEntity, CourseModuleDocument } from '../course-module/entities/course-module.entity';
import { Lecture, LectureDocument } from '../lecture/entities/lecture.entity';
import { LectureProgress, LectureProgressDocument } from '../lecture-progress/entities/lecture-progress.entity';
import { LectureQuizCompletion, LectureQuizCompletionDocument } from '../lecture-quiz/entities/lecture-quiz-completion.entity';
import { LectureAssignmentSubmission, LectureAssignmentSubmissionDocument } from '../lecture-assignment/entities/lecture-assignment-submission.entity';
import { LectureAssignment, LectureAssignmentDocument } from '../lecture-assignment/entities/lecture-assignment.entity';
import { LectureQuiz, LectureQuizDocument } from '../lecture-quiz/entities/lecture-quiz.entity';
import { Quiz, QuizDocument } from '../quiz/entities/quiz.entity';
import { AssignmentStatus } from '../lecture-assignment/enums/assignment.enum';
import { IStudentProgressService } from './interfaces/student-progress.service.interface';
import {
  StudentProgressResponseDto,
  CourseProgressItemDto,
  RecentScoreItemDto,
} from './dto/student-progress-response.dto';
import { RecentScoreType } from './enums/progress.enum';

@Injectable()
export class StudentProgressService implements IStudentProgressService {
  constructor(
    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<EnrollmentDocument>,

    @InjectModel(CourseModuleEntity.name)
    private readonly courseModuleModel: Model<CourseModuleDocument>,

    @InjectModel(Lecture.name)
    private readonly lectureModel: Model<LectureDocument>,

    @InjectModel(LectureProgress.name)
    private readonly lectureProgressModel: Model<LectureProgressDocument>,

    @InjectModel(LectureQuizCompletion.name)
    private readonly quizCompletionModel: Model<LectureQuizCompletionDocument>,

    @InjectModel(LectureAssignmentSubmission.name)
    private readonly submissionModel: Model<LectureAssignmentSubmissionDocument>,

    @InjectModel(LectureAssignment.name)
    private readonly assignmentModel: Model<LectureAssignmentDocument>,

    @InjectModel(LectureQuiz.name)
    private readonly lectureQuizModel: Model<LectureQuizDocument>,

    @InjectModel(Quiz.name)
    private readonly quizModel: Model<QuizDocument>,
  ) {}

  async getStudentProgress(userId: string): Promise<StudentProgressResponseDto> {
    try {
     

      const enrollments = await this.enrollmentModel
        .find({ studentId: userId, isActive: true })
        .populate('courseId')
        .lean();


      if (!enrollments.length) {
        return this.buildEmptyResponse();
      }

      const courseIdStrings = enrollments.map((e) => {
        const raw = (e.courseId as any)?._id ?? e.courseId;
        return raw.toString();
      });

      const courseObjectIds = courseIdStrings.map((id) => new Types.ObjectId(id));


      const userObjectId = new Types.ObjectId(userId);

      const sampleModule = await this.courseModuleModel.findOne({}).lean();

      const [modules, completedProgress, quizCompletions, gradedSubmissions] = await Promise.all([
        this.courseModuleModel
          .find({ courseId: { $in: [...courseObjectIds, ...courseIdStrings] } })
          .lean(),
        this.lectureProgressModel
          .find({ userId: userObjectId, completed: true })
          .lean(),
        this.quizCompletionModel
          .find({ userId: userObjectId })
          .populate('lectureQuizId')
          .lean(),
        this.submissionModel
          .find({
            userId: userObjectId,
            status: AssignmentStatus.GRADED,
            grade: { $ne: null },
          })
          .populate('lectureAssignmentId')
          .lean(),
      ]);

    

      const completedLectureIds = new Set(
        completedProgress.map((p) => p.lectureId.toString()),
      );

      const moduleObjectIds = modules.map((m) => m._id as Types.ObjectId);
      const moduleStringIds = modules.map((m) => (m._id as Types.ObjectId).toString());

      const sampleLecture = await this.lectureModel.findOne({}).lean();

      const lectures = await this.lectureModel
        .find({ courseModuleId: { $in: [...moduleObjectIds, ...moduleStringIds] } })
        .lean();


      const lecturesByModule = new Map<string, typeof lectures>();
      for (const lecture of lectures) {
        const moduleId = lecture.courseModuleId.toString();
        if (!lecturesByModule.has(moduleId)) lecturesByModule.set(moduleId, []);
        lecturesByModule.get(moduleId)!.push(lecture);
      }

      const modulesByCourse = new Map<string, typeof modules>();
      for (const module of modules) {
        const courseId = module.courseId.toString();
        if (!modulesByCourse.has(courseId)) modulesByCourse.set(courseId, []);
        modulesByCourse.get(courseId)!.push(module);
      }

      const quizCompletionMap = new Map<string, number>();
      for (const qc of quizCompletions) {
        const lectureQuiz = qc.lectureQuizId as any;
        if (lectureQuiz?.lectureId) {
          const key = lectureQuiz.lectureId.toString();
          if (!quizCompletionMap.has(key)) quizCompletionMap.set(key, 0);
        }
        quizCompletionMap.set(
          (qc.lectureQuizId as any)?._id?.toString() ?? '',
          qc.scorePercent,
        );
      }

      const assignmentSubmissionMap = new Map<string, number>();
      for (const sub of gradedSubmissions) {
        const assignment = sub.lectureAssignmentId as any;
        if (assignment?._id) {
          assignmentSubmissionMap.set(assignment._id.toString(), sub.grade ?? 0);
        }
      }

      const lectureObjectIds = lectures.map((l) => l._id as Types.ObjectId);

      const lectureQuizzesByLecture = await this.lectureQuizModel
        .find({ lectureId: { $in: lectureObjectIds } })
        .lean();

      const assignmentsByLecture = await this.assignmentModel
        .find({ lectureId: { $in: lectureObjectIds } })
        .lean();

      const lectureQuizMap = new Map<string, typeof lectureQuizzesByLecture>();
      for (const lq of lectureQuizzesByLecture) {
        const key = lq.lectureId.toString();
        if (!lectureQuizMap.has(key)) lectureQuizMap.set(key, []);
        lectureQuizMap.get(key)!.push(lq);
      }

      const assignmentMap = new Map<string, typeof assignmentsByLecture>();
      for (const a of assignmentsByLecture) {
        const key = a.lectureId.toString();
        if (!assignmentMap.has(key)) assignmentMap.set(key, []);
        assignmentMap.get(key)!.push(a);
      }

      const courseProgressList: CourseProgressItemDto[] = [];
      let totalModulesCompleted = 0;
      const allQuizScores: number[] = [];
      const allAssignmentScores: number[] = [];

      for (const enrollment of enrollments) {
        const course = enrollment.courseId as any;
        const courseId = course?._id?.toString() ?? enrollment.courseId.toString();
        const courseTitle = course?.title ?? 'Unknown Course';

        const courseModules = modulesByCourse.get(courseId) ?? [];
        const totalModules = courseModules.length;

        let modulesCompleted = 0;
        const courseQuizScores: number[] = [];
        const courseAssignmentScores: number[] = [];

        for (const module of courseModules) {
          const moduleId = (module._id as Types.ObjectId).toString();
          const moduleLectures = lecturesByModule.get(moduleId) ?? [];
          const allLecturesDone = moduleLectures.every((l) =>
            completedLectureIds.has((l._id as Types.ObjectId).toString()),
          );
          if (allLecturesDone && moduleLectures.length > 0) {
            modulesCompleted++;
            totalModulesCompleted++;
          }

          for (const lecture of moduleLectures) {
            const lectureId = (lecture._id as Types.ObjectId).toString();

            const quizzes = lectureQuizMap.get(lectureId) ?? [];
            for (const lq of quizzes) {
              const lqId = (lq._id as Types.ObjectId).toString();
              const completion = quizCompletions.find(
                (qc) => qc.lectureQuizId?.toString() === lqId,
              );
              if (completion) {
                courseQuizScores.push(completion.scorePercent);
                allQuizScores.push(completion.scorePercent);
              }
            }

            const assignments = assignmentMap.get(lectureId) ?? [];
            for (const a of assignments) {
              const aId = (a._id as Types.ObjectId).toString();
              const grade = assignmentSubmissionMap.get(aId);
              if (grade !== undefined) {
                courseAssignmentScores.push(grade);
                allAssignmentScores.push(grade);
              }
            }
          }
        }

        const totalLectures = courseModules.reduce(
          (acc, m) => acc + (lecturesByModule.get((m._id as Types.ObjectId).toString()) ?? []).length,
          0,
        );

        const completedLectures = courseModules.reduce((acc, m) => {
          const mLectures = lecturesByModule.get((m._id as Types.ObjectId).toString()) ?? [];
          return acc + mLectures.filter((l) => completedLectureIds.has((l._id as Types.ObjectId).toString())).length;
        }, 0);

        const progress = totalLectures > 0
          ? Math.round((completedLectures / totalLectures) * 100)
          : 0;

        const quizAvg = courseQuizScores.length > 0
          ? Math.round(courseQuizScores.reduce((a, b) => a + b, 0) / courseQuizScores.length)
          : 0;

        const assignmentAvg = courseAssignmentScores.length > 0
          ? Math.round(courseAssignmentScores.reduce((a, b) => a + b, 0) / courseAssignmentScores.length)
          : 0;

        courseProgressList.push({
          courseId,
          title: courseTitle,
          progress,
          modulesCompleted,
          totalModules,
          quizAvg,
          assignmentAvg,
        });
      }

      const allScores = [...allQuizScores, ...allAssignmentScores];
      const overallAverage = allScores.length > 0
        ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
        : 0;

      const totalModules = modules.length;
      const courseCompletionPercent = totalModules > 0
        ? Math.round((totalModulesCompleted / totalModules) * 100)
        : 0;

      const recentScores = await this.buildRecentScores(userId, quizCompletions, gradedSubmissions);

      return {
        overallAverage,
        courseCompletionPercent,
        modulesCompleted: totalModulesCompleted,
        courses: courseProgressList,
        recentScores,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch student progress');
    }
  }

  private async buildRecentScores(
    userId: string,
    quizCompletions: any[],
    gradedSubmissions: any[],
  ): Promise<RecentScoreItemDto[]> {
    try {
      const lectureQuizIds = quizCompletions
        .map((qc) => qc.lectureQuizId?._id ?? qc.lectureQuizId)
        .filter(Boolean);

      const lectureQuizDocs = await this.lectureQuizModel
        .find({ _id: { $in: lectureQuizIds } })
        .lean();

      const quizIds = lectureQuizDocs.map((lq) => lq.quizId);
      const quizDocs = await this.quizModel
        .find({ _id: { $in: quizIds } })
        .select('title')
        .lean();

      const quizTitleMap = new Map<string, string>(
        quizDocs.map((q) => [(q._id as Types.ObjectId).toString(), q.title]),
      );

      const lectureQuizToQuizMap = new Map<string, string>(
        lectureQuizDocs.map((lq) => [
          (lq._id as Types.ObjectId).toString(),
          lq.quizId.toString(),
        ]),
      );

      const quizScores: RecentScoreItemDto[] = quizCompletions.map((qc) => {
        const lqId = (qc.lectureQuizId?._id ?? qc.lectureQuizId)?.toString() ?? '';
        const quizId = lectureQuizToQuizMap.get(lqId) ?? '';
        const title = quizTitleMap.get(quizId) ?? 'Quiz';

        return {
          type: RecentScoreType.QUIZ,
          title,
          date: (qc as any).createdAt?.toISOString?.() ?? '',
          score: qc.scorePercent,
        };
      });

      const assignmentScores: RecentScoreItemDto[] = gradedSubmissions
        .filter((sub) => (sub.lectureAssignmentId as any)?.title)
        .map((sub) => ({
          type: RecentScoreType.ASSIGNMENT,
          title: (sub.lectureAssignmentId as any).title,
          date: (sub as any).updatedAt?.toISOString?.() ?? '',
          score: sub.grade ?? 0,
        }));

      return [...quizScores, ...assignmentScores]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);
    } catch {
      return [];
    }
  }

  private buildEmptyResponse(): StudentProgressResponseDto {
    return {
      overallAverage: 0,
      courseCompletionPercent: 0,
      modulesCompleted: 0,
      courses: [],
      recentScores: [],
    };
  }
}