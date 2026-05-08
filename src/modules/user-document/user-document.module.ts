import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDocument, UserDocumentSchema } from './entities/user-document.entity';
import { UserDocumentController } from './user-document.controller';
import { UserDocumentService } from './user-document.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserDocument.name, schema: UserDocumentSchema }]),
    CloudinaryModule,
  ],
  controllers: [UserDocumentController],
  providers: [UserDocumentService],
exports: [UserDocumentService, MongooseModule], 
})
export class UserDocumentModule {}