import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AboutUsResource, AboutUsResourceSchema } from './entities/about-us-resource.entity';
import { AboutUsResourceService } from './about-us-resource.service';
import { AboutUsResourceController } from './about-us-resource.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AboutUsResource.name, schema: AboutUsResourceSchema },
    ]),
  ],
  controllers: [AboutUsResourceController],
  providers: [AboutUsResourceService],
})
export class AboutUsResourceModule {}