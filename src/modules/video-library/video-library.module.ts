import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoLibraryController } from './video-library.controller';
import { VideoLibraryService } from './video-library.service';
import { VideoLibrary, VideoLibrarySchema } from './entities/video-library.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VideoLibrary.name, schema: VideoLibrarySchema },
    ]),
  ],
  controllers: [VideoLibraryController],
  providers: [VideoLibraryService],
})
export class VideoLibraryModule {}