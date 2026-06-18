import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { PaypalService } from './paypal.service';
import {
  ICapturePaymentResponse,
  ICreatePaymentOrderResponse,
  IPayPalCaptureResponse,
  IPayPalCreateOrderResponse,
} from './interfaces/Payment.interface';
import { ServicePageService } from '../service/service-page.service';
import { CreatePaymentOrderDto } from './dto/Createpaymentorder.dto';
import { PaymentMethod, PaymentStatus } from './constant/payment.enum';
import { Payment, PaymentDocument } from './entities/payment.entity';
import { MailService } from './mail.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
    private readonly paypalService: PaypalService,
    private readonly servicePageService: ServicePageService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService, 
  ) {}

  async createOrder(dto: CreatePaymentOrderDto): Promise<ICreatePaymentOrderResponse> {
    const servicePage = await this.servicePageService.findById(dto.servicePageId);
    if (!servicePage.isActive) {
      throw new BadRequestException('This service is currently not available');
    }

    const amount: number = servicePage.price;
    const currency: string = dto.currency?.toUpperCase() ?? 'USD';

    let payment: PaymentDocument;
    try {
      payment = await this.paymentModel.create({
        servicePageId: new Types.ObjectId(dto.servicePageId),
        serviceTitle: servicePage.title,
        amount,
        currency,
        status: PaymentStatus.PENDING,
        method: PaymentMethod.PAYPAL,
        customer: dto.customer,
      });
    } catch (error) {
      this.logger.error('Failed to save payment record', error);
      throw new InternalServerErrorException('Failed to initiate payment');
    }

const backendUrl = this.configService.getOrThrow<string>('BACKEND_URL');
const returnUrl = `${backendUrl}/payments/capture?paymentId=${payment._id}`;
const cancelUrl = `${backendUrl}/payments/cancel?paymentId=${payment._id}`;

    const paypalOrder: IPayPalCreateOrderResponse = await this.paypalService.createOrder(
      amount,
      currency,
      payment._id.toString(),
      returnUrl,
      cancelUrl,
    );

    payment.paypalOrderId = paypalOrder.id;
    await payment.save();

    const approvalUrl = paypalOrder.links.find((l) => l.rel === 'approve')?.href;
    if (!approvalUrl) {
      throw new InternalServerErrorException('PayPal approval URL not found');
    }

    this.logger.log(`Payment order created: ${payment._id} | PayPal: ${paypalOrder.id}`);

    return {
      success: true,
      paypalOrderId: paypalOrder.id,
      approvalUrl,
      paymentId: payment._id.toString(),
    };
  }

  async capturePayment(
    paymentId: string,
    paypalOrderId: string,
  ): Promise<ICapturePaymentResponse> {
    const payment = await this.findById(paymentId);

    if (payment.status === PaymentStatus.COMPLETED) {
      return this.buildCaptureResponse(payment);
    }

    if (payment.paypalOrderId !== paypalOrderId) {
      throw new BadRequestException('PayPal order ID mismatch');
    }

    const captureResult: IPayPalCaptureResponse = await this.paypalService.captureOrder(
      paypalOrderId,
    );

    const captureStatus = captureResult.status;
    const capture = captureResult.purchase_units?.[0]?.payments?.captures?.[0];

    if (captureStatus === 'COMPLETED' && capture?.status === 'COMPLETED') {
      payment.status = PaymentStatus.COMPLETED;
      payment.paypalCaptureId = capture.id;
      await payment.save();
      this.logger.log(`Payment completed: ${paymentId}`);

      const emailData = {
        paymentId:       payment._id.toString(),
        serviceTitle:    payment.serviceTitle,
        amount:          payment.amount,
        currency:        payment.currency,
        paypalOrderId:   payment.paypalOrderId,
        paypalCaptureId: capture.id,
customerName: [payment.customer?.firstName, payment.customer?.lastName].filter(Boolean).join(' ') || 'Customer',
        customerEmail:   payment.customer?.email ?? '',
        customerPhone:   payment.customer?.phone ?? '',
        paymentDate:     new Date().toLocaleString('en-PK', {
          dateStyle: 'long',
          timeStyle: 'short',
          timeZone: 'Asia/Karachi',
        }),
      };

      Promise.allSettled([
        this.mailService.sendPaymentSuccessToUser(emailData),
        this.mailService.sendPaymentSuccessToAdmin(emailData),
      ]).then((results) => {
        results.forEach((result, i) => {
          if (result.status === 'rejected') {
            this.logger.warn(
              `Email ${i === 0 ? 'to user' : 'to admin'} failed: ${result.reason}`,
            );
          }
        });
      });

    } else {
      payment.status = PaymentStatus.FAILED;
      await payment.save();
      this.logger.warn(`Payment failed: ${paymentId} | PayPal status: ${captureStatus}`);
      throw new BadRequestException('Payment capture was not successful');
    }

    return this.buildCaptureResponse(payment);
  }



  async cancelPayment(paymentId: string): Promise<{ success: boolean; message: string }> {
    const payment = await this.findById(paymentId);

    if (payment.status === PaymentStatus.PENDING) {
      payment.status = PaymentStatus.CANCELLED;
      await payment.save();
      this.logger.log(`Payment cancelled: ${paymentId}`);
    }

    return { success: true, message: 'Payment cancelled' };
  }

  async findAll(): Promise<PaymentDocument[]> {
    try {
      return await this.paymentModel
        .find()
        .populate('servicePageId', 'title slug')
        .sort({ createdAt: -1 });
    } catch (error) {
      this.logger.error('Failed to fetch payments', error);
      throw new InternalServerErrorException('Failed to fetch payments');
    }
  }

  async findById(id: string): Promise<PaymentDocument> {
    try {
      const payment = await this.paymentModel.findById(id);
      if (!payment) throw new NotFoundException('Payment not found');
      return payment;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to fetch payment: ${id}`, error);
      throw new InternalServerErrorException('Failed to fetch payment');
    }
  }

  async findByServicePage(servicePageId: string): Promise<PaymentDocument[]> {
    try {
      const objectId = new Types.ObjectId(servicePageId);
      return await this.paymentModel
        .find({ servicePageId: objectId })
        .sort({ createdAt: -1 });
    } catch (error) {
      this.logger.error(`Failed to fetch payments for service: ${servicePageId}`, error);
      throw new InternalServerErrorException('Failed to fetch payments');
    }
  }

  private buildCaptureResponse(payment: PaymentDocument): ICapturePaymentResponse {
    return {
      success: true,
      paymentId: payment._id.toString(),
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      serviceTitle: payment.serviceTitle,
      customer: payment.customer,
    };
  }

    async findByCustomerEmail(email: string): Promise<PaymentDocument[]> {
  try {
    return await this.paymentModel
      .find({
        'customer.email': email.toLowerCase().trim(),
        status: PaymentStatus.COMPLETED,
      })
      .sort({ createdAt: -1 });
  } catch (error) {
    this.logger.error(`Failed to fetch payments for email: ${email}`, error);
    throw new InternalServerErrorException('Failed to fetch payments');
  }
}
}