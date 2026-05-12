import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Support, SupportSchema } from './entities/support.entity';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';
import { EnrollmentModule } from '../enrollment/enrollment.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Support.name, schema: SupportSchema }]),
    EnrollmentModule,
  ],
  controllers: [SupportController],
  providers: [SupportService],
  exports: [SupportService],
})
export class SupportModule {}