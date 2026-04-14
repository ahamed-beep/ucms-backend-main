import { PartialType } from '@nestjs/mapped-types';
import { CreateServicePageDto } from './create-service-page.dto';

export class UpdateServicePageDto extends PartialType(CreateServicePageDto) {}