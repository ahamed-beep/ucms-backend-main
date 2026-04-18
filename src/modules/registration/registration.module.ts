import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';
import { RegistrationEntity, RegistrationSchema } from './entities/registration.entity';
import { EventModule } from '../event/event.module';
import { MailService } from './mail.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RegistrationEntity.name, schema: RegistrationSchema },
    ]),
    EventModule,
  ],
  controllers: [RegistrationController],
  providers: [RegistrationService , MailService],
  exports: [RegistrationService],
})
export class RegistrationModule {}