import { Controller, Post, Get, Param, UseGuards, Req } from '@nestjs/common';
import { LectureProgressService } from './lecture-progress.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';

@UseGuards(RolesGuard, ActiveGuard)
@Controller('courses/:courseId/progress')
export class LectureProgressController {
  constructor(private readonly progressService: LectureProgressService) {}

@Post('lectures/:lectureId/complete')
@RequireRole('student')
async markComplete(
  @Param('courseId') courseId: string,
  @Param('lectureId') lectureId: string,
  @Req() req: any,
) {
  return this.progressService.markCompleted(req.user.userId, lectureId, courseId);
}

@Get()
@RequireRole('student')
async getProgress(@Param('courseId') courseId: string, @Req() req: any) {
  const completedIds = await this.progressService.getCompletedLectureIds(req.user.userId, courseId);
  return { completedLectureIds: completedIds };
}
}