import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Application, ApplicationSchema } from './entities/application.entity';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Application.name, schema: ApplicationSchema }]),
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [ApplicationService, MongooseModule],
})
export class ApplicationModule {}