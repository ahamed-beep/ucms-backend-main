import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Resource, ResourceSchema } from './entities/resource.entity';
import { ResourcesController } from './resource.controller';
import { ResourceService } from './resource.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Resource.name, schema: ResourceSchema }]),
    CloudinaryModule,
  ],
  controllers: [ResourcesController],
  providers: [ResourceService],
  exports: [ResourceService],
})
export class ResourcesModule {}