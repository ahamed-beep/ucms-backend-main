import { QuizDifficulty, QuizStatus, QuizType } from '../enums/quiz.enum';

export interface IQuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface IQuiz {
  id: string;
  title: string;
  description?: string;
  category: string;
  difficulty: QuizDifficulty;
  status: QuizStatus;
  quizType: QuizType;
  timeLimitMinutes: number;
  questions: IQuizQuestion[];
  totalQuestions: number;
  attempts: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuizResult {
  quizId: string;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  scorePercent: number;
  timeTakenSeconds?: number;
}

export interface IQuizListItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  difficulty: QuizDifficulty;
  status: QuizStatus;
  quizType: QuizType;
  timeLimitMinutes: number;
  totalQuestions: number;
  attempts: number;
}

export interface IPaginatedQuizzes {
  data: IQuizListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}