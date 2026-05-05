import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { getDatabaseConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { ServicePageModule } from './modules/service/service-page.module';
import { ServicePageController } from './modules/service/service-page.controller';
import { RolesGuard } from './common/guards/roles.guard';
import { ActiveGuard } from './common/guards/active.guard';
import { PaymentModule } from './modules/payment/payment.module';
import { PaypalService } from './modules/payment/paypal.service';
import { ContactModule } from './modules/contact/contact.module';
import { GalleryModule } from './modules/gallery/gallery.module';
import { ConsultationModule } from './modules/consultation/consultation.module';
import { FacultyApplicationModule } from './modules/faculty/faculty.module';
import { EventModule } from './modules/event/event.module';
import { RegistrationModule } from './modules/registration/registration.module';
import { AdmissionModule } from './modules/admission/admission.module';
import { InquiryModule } from './modules/inquiry/inquiry.module';
import { MailModule } from './modules/mail/mail.module';
import { DestinationModule } from './modules/destination/destination.module';
import { TestimonialsModule } from './modules/testimonials/testimonials.module';
import { VideoTestimonialsModule } from './modules/video-testimonials/video-testimonials.module';
import { BlogModule } from './modules/blog/blog.module';
import { QuizModule } from './modules/quiz/quiz.module';
import { VideoLibraryModule } from './modules/video-library/video-library.module';
import { IeltsResourceModule } from './modules/ielts-resource/ielts-resource.module';
import { UpcomingClassModule } from './modules/upcoming-class/upcoming-class.module';
import { CoursesModule } from './modules/course/course.module';
import { CourseModuleNestModule } from './modules/course-module/course-module.module';
import { LecturesModule } from './modules/lecture/lecture.module';
import { ResourcesModule } from './modules/resource/resource.module';
import { MaterialsModule } from './modules/material/material.module';
import { ExercisesModule } from './modules/exercise/exercise.module';
import { LectureProgressModule } from './modules/lecture-progress/lecture-progress.module';
import { InstructorModule } from './modules/instructor/instructor.module';
import { EnrollmentModule } from './modules/enrollment/enrollment.module';
import { LectureQuizModule } from './modules/lecture-quiz/lecture-quiz.module';
import { LectureAssignmentModule } from './modules/lecture-assignment/lecture-assignment.module';
import { StudentProgressModule } from './modules/student-progress/student-progress.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    UserModule,
    AuthModule,
    ServicePageModule,
    CloudinaryModule,
    PaymentModule,
    ContactModule,
    GalleryModule,
    ConsultationModule,
    FacultyApplicationModule,
    EventModule,
    RegistrationModule,
    AdmissionModule,
    InquiryModule,
    MailModule,
    DestinationModule,
    TestimonialsModule,
    VideoTestimonialsModule,
    BlogModule,
    QuizModule,
    VideoLibraryModule,
    IeltsResourceModule,
    UpcomingClassModule,
    CoursesModule,
    CourseModuleNestModule,
    LecturesModule,
    ResourcesModule,
    MaterialsModule,
    ExercisesModule,
    LectureProgressModule,
    InstructorModule,
    EnrollmentModule,
    LectureQuizModule,
    LectureAssignmentModule,
    StudentProgressModule,
  ],
  controllers: [AppController, ServicePageController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: ActiveGuard },
    PaypalService,
  ],
})
export class AppModule {}