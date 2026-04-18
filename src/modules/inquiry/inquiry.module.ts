import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Inquiry, InquirySchema } from './entities/inquiry.entity';
import { InquiryService } from './inquiry.service';
import { InquiryController } from './inquiry.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Inquiry.name, schema: InquirySchema },
    ]),
  ],
  controllers: [InquiryController],
  providers: [InquiryService],
  exports: [InquiryService],
})
export class InquiryModule {}