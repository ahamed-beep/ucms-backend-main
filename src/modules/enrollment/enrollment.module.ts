import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Enrollment, EnrollmentSchema } from './entities/enrollment.entity';
import { EnrollmentController } from './enrollment.controller';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentGuard } from 'src/common/guards/enrollment.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Enrollment.name, schema: EnrollmentSchema }]),
  ],
  controllers: [EnrollmentController],
  providers: [EnrollmentService, EnrollmentGuard],
  exports: [
    EnrollmentService,
    EnrollmentGuard,
    MongooseModule,
  ],
})
export class EnrollmentModule {}