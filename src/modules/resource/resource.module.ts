import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Resource, ResourceSchema } from './entities/resource.entity';
import { ResourcesController } from './resource.controller';
import { ResourceService } from './resource.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Enrollment, EnrollmentSchema } from '../enrollment/entities/enrollment.entity';
import { CourseModule, CourseModuleSchema } from '../course-module/entities/course-module.entity';
import { ModuleEnrollmentGuard } from 'src/common/guards/module-enrollment.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Resource.name, schema: ResourceSchema },
      { name: Enrollment.name, schema: EnrollmentSchema },
      { name: CourseModule.name, schema: CourseModuleSchema },
    ]),
    CloudinaryModule,
  ],
  controllers: [ResourcesController],
  providers: [ResourceService, ModuleEnrollmentGuard],
  exports: [ResourceService],
})
export class ResourcesModule {}