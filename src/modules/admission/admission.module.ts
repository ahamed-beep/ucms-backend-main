import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdmissionDeadline, AdmissionDeadlineSchema } from './entities/admission-deadline.entity';
import { AdmissionDeadlineService } from './admission.service';
import { AdmissionDeadlineController } from './admission.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AdmissionDeadline.name, schema: AdmissionDeadlineSchema },
    ]),
  ],
  controllers: [AdmissionDeadlineController],
  providers: [AdmissionDeadlineService],
  exports: [AdmissionDeadlineService],
})
export class AdmissionModule {}