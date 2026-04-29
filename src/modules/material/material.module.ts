import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Material, MaterialSchema } from './entities/material.entity';
import { MaterialsController } from './material.controller';
import { MaterialService } from './material.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { EnrollmentModule } from '../enrollment/enrollment.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Material.name, schema: MaterialSchema }]),
    CloudinaryModule,
    EnrollmentModule,
  ],
  controllers: [MaterialsController],
  providers: [MaterialService],
  exports: [MaterialService],
})
export class MaterialsModule {}