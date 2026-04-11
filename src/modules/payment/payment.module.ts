import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaypalService } from './paypal.service';
import { ServicePageModule } from '../service/service-page.module';
import { Payment, PaymentSchema } from './entities/payment.entity';

@Global() 
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
    ]),
    ServicePageModule, 
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaypalService],
  exports: [PaymentService, PaypalService], 
})
export class PaymentModule {}