import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicePage, ServicePageSchema } from './entities/service-page.entity';
import { ServicePageService } from './service-page.service';
import { ServicePageController } from './service-page.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServicePage.name, schema: ServicePageSchema },
    ]),
  ],
  controllers: [ServicePageController],
  providers: [ServicePageService],
  exports: [ServicePageService],
})
export class ServicePageModule {}