import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudyMaterial, StudyMaterialSchema } from './entities/study-material.entity';
import { StudyMaterialController } from './study-material.controller';
import { StudyMaterialService } from './study-material.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { EnrollmentModule } from '../enrollment/enrollment.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: StudyMaterial.name, schema: StudyMaterialSchema }]),
    CloudinaryModule,
    EnrollmentModule,
  ],
  controllers: [StudyMaterialController],
  providers: [StudyMaterialService],
  exports: [StudyMaterialService],
})
export class StudyMaterialModule {}