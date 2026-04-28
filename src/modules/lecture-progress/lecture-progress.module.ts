import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LectureProgress, LectureProgressSchema } from './entities/lecture-progress.entity';
import { LectureProgressController } from './lecture-progress.controller';
import { LectureProgressService } from './lecture-progress.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: LectureProgress.name, schema: LectureProgressSchema }])],
  controllers: [LectureProgressController],
  providers: [LectureProgressService],
  exports: [LectureProgressService],
})
export class LectureProgressModule {}