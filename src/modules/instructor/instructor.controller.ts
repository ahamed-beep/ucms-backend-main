import { Controller, Get, Post, Patch, Delete, Param, Body, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InstructorService } from './instructor.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { multerMemoryOptions, imageFilePipe } from '../cloudinary/multer.config';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';

@UseGuards(RolesGuard, ActiveGuard)
@Controller('courses/:courseId/instructor')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  @Post()
  @RequireRole('admin')
  @UseInterceptors(FileInterceptor('avatar', multerMemoryOptions))
  async create(
    @Param('courseId') courseId: string,
    @Body() dto: CreateInstructorDto,
    @UploadedFile(imageFilePipe(false)) avatar?: Express.Multer.File,
  ) {
    return this.instructorService.create(courseId, dto, avatar?.buffer, avatar?.originalname);
  }

  @Get()
  @RequireRole('admin', 'student')
  async findByCourse(@Param('courseId') courseId: string) {
    return this.instructorService.findByCourse(courseId);
  }

  @Patch()
  @RequireRole('admin')
  @UseInterceptors(FileInterceptor('avatar', multerMemoryOptions))
  async update(
    @Param('courseId') courseId: string,
    @Body() dto: Partial<CreateInstructorDto>,
    @UploadedFile(imageFilePipe(false)) avatar?: Express.Multer.File,
  ) {
    return this.instructorService.updateByCourse(courseId, dto, avatar?.buffer, avatar?.originalname);
  }

  @Delete()
  @RequireRole('admin')
  async delete(@Param('courseId') courseId: string) {
    return this.instructorService.deleteByCourse(courseId);
  }
}