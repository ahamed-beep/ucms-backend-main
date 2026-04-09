// app.module.ts
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
import { ServicePageService } from './modules/service/service-page.service';
import { RolesGuard } from './common/guards/roles.guard';
import { ActiveGuard } from './common/guards/active.guard';

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
  ],
  controllers: [AppController, ServicePageController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  { provide: APP_GUARD, useClass: RolesGuard },   
  { provide: APP_GUARD, useClass: ActiveGuard },
  ],
})
export class AppModule {}