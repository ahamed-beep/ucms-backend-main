import { PartialType } from '@nestjs/mapped-types';
import { CreateLectureAssignmentDto } from './create-lecture-assignment.dto';

export class UpdateLectureAssignmentDto extends PartialType(CreateLectureAssignmentDto) {}