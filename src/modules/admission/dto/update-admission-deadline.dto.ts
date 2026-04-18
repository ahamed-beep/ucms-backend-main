import { PartialType } from '@nestjs/mapped-types';
import { CreateAdmissionDeadlineDto } from './create-admission-deadline.dto';

export class UpdateAdmissionDeadlineDto extends PartialType(CreateAdmissionDeadlineDto) {}