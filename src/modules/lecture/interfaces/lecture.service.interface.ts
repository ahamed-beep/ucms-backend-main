import { LectureDocument } from '../entities/lecture.entity';
import { CreateLectureDto } from '../dto/create-lecture.dto';
import { UpdateLectureDto } from '../dto/update-lecture.dto';

export interface ILectureService {
  createLecture(
    moduleId: string,
    dto: CreateLectureDto,
    videoBuffer?: Buffer,
    videoName?: string,
    docBuffer?: Buffer,
    docName?: string,
  ): Promise<LectureDocument>;

  getLecturesByModule(moduleId: string): Promise<LectureDocument[]>;
  getLectureById(id: string): Promise<LectureDocument>;

  updateLecture(
    id: string,
    dto: UpdateLectureDto,
    videoBuffer?: Buffer,
    videoName?: string,
    docBuffer?: Buffer,
    docName?: string,
  ): Promise<LectureDocument>;

  deleteLecture(id: string): Promise<void>;
}