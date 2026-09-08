import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CareerResource, CareerResourceSchema } from './entities/career-resource.entity';
import { CareerResourceService } from './career-resource.service';
import { CareerResourceController } from './career-resource.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CareerResource.name, schema: CareerResourceSchema },
    ]),
  ],
  controllers: [CareerResourceController],
  providers: [CareerResourceService],
})
export class CareerResourceModule {}