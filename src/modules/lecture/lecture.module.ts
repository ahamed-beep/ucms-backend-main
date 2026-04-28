import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Lecture, LectureSchema } from './entities/lecture.entity';
import { LecturesController } from './lecture.controller';
import { LectureService } from './lecture.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lecture.name, schema: LectureSchema }]),
    CloudinaryModule,
  ],
  controllers: [LecturesController],
  providers: [LectureService],
  exports: [LectureService],
})
export class LecturesModule {}