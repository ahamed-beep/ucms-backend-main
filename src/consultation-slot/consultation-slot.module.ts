import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ConsultationSlot,
  ConsultationSlotSchema,
} from './entities/consultation-slot.entity';
import { ConsultationSlotController } from './consultation-slot.controller';
import { ConsultationSlotService } from './consultation-slot.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ConsultationSlot.name, schema: ConsultationSlotSchema },
    ]),
  ],
  controllers: [ConsultationSlotController],
  providers: [ConsultationSlotService],
  exports: [ConsultationSlotService],
})
export class ConsultationSlotModule {}