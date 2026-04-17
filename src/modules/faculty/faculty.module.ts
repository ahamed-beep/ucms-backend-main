import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FacultyApplication, FacultyApplicationEntity } from './entities/faculty-application.entity';
import { FacultyApplicationController } from './faculty.controller';
import { FacultyApplicationService } from './faculty.service';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FacultyApplication.name, schema: FacultyApplicationEntity },
    ]),
  ],
  controllers: [FacultyApplicationController],
  providers: [FacultyApplicationService],
})
export class FacultyApplicationModule {}