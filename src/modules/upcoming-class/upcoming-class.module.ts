import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UpcomingClass, UpcomingClassSchema } from './entities/upcoming-class.entity';
import { UpcomingClassService } from './upcoming-class.service';
import { UpcomingClassController } from './upcoming-class.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UpcomingClass.name, schema: UpcomingClassSchema },
    ]),
  ],
  controllers: [UpcomingClassController],
  providers: [UpcomingClassService],
})
export class UpcomingClassModule {}