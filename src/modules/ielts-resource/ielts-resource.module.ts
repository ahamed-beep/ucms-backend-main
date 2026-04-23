import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IeltsResource, IeltsResourceSchema } from './entities/ielts-resource.entity';
import { IeltsResourceService } from './ielts-resource.service';
import { IeltsResourceController } from './ielts-resource.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IeltsResource.name, schema: IeltsResourceSchema },
    ]),
  ],
  controllers: [IeltsResourceController],
  providers: [IeltsResourceService],
})
export class IeltsResourceModule {}