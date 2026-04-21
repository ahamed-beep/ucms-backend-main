import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  VideoTestimonial,
  VideoTestimonialSchema,
} from './entities/video-testimonial.entity';
import { VideoTestimonialsService } from './video-testimonials.service';
import { VideoTestimonialsController } from './video-testimonials.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VideoTestimonial.name, schema: VideoTestimonialSchema },
    ]),
  ],
  controllers: [VideoTestimonialsController],
  providers: [VideoTestimonialsService],
})
export class VideoTestimonialsModule {}