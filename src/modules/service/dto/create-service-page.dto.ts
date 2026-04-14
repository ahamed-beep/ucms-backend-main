import {
  IsString,
  IsArray,
  IsNumber,
  IsOptional,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { FAQDto } from './faq.dto';
import {
  JsonTransform,
  NumberTransform,
  BooleanTransform,
} from '../../../common/transformers/form-data.transformers';

export class CreateServicePageDto {
  @IsOptional()
  @IsString()
  iconUrl?: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @JsonTransform()
  @IsArray()
  @IsString({ each: true })
  highlightPoints: string[];

  @IsString()
  overview: string;

  @JsonTransform()
  @IsArray()
  @IsString({ each: true })
  steps: string[];

  @JsonTransform()
  @IsArray()
  @IsString({ each: true })
  requiredDocuments: string[];

  @JsonTransform(FAQDto)
  @IsArray()
  @ValidateNested({ each: true })
  faqs: FAQDto[];

  @NumberTransform()
  @IsNumber()
  price: number;

  @IsOptional()
  @BooleanTransform()
  @IsBoolean()
  isActive?: boolean;
}