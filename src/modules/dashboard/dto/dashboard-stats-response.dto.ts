import { Expose } from 'class-transformer';

export class DashboardStatsResponseDto {
  @Expose() totalApplications: number;
  @Expose() upcomingClasses: number;
  @Expose() documentsUploaded: number;
  @Expose() totalNotifications: number;
  @Expose() recentApplications: any[];
  @Expose() upcomingClassList: any[];
}