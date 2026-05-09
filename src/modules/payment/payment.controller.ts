import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { PaymentService } from './payment.service';
import { Public } from 'src/common/decorators/public.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';
import { CreatePaymentOrderDto } from './dto/Createpaymentorder.dto';
import { ICreatePaymentOrderResponse } from './interfaces/Payment.interface';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { RequestUser } from 'src/common/interfaces/jwt-payload.interface';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly configService: ConfigService,
  ) {}

  // ─── PUBLIC ROUTES ────────────────────────────────────────────────────────

  @Public()
  @Post('create-order')
  @HttpCode(HttpStatus.CREATED)
  async createOrder(
    @Body() dto: CreatePaymentOrderDto,
  ): Promise<ICreatePaymentOrderResponse> {
    try {
      return await this.paymentService.createOrder(dto);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to create payment order');
    }
  }

  @Public()
  @Get('capture')
  async capturePayment(
    @Query('paymentId') paymentId: string,
    @Query('token') paypalOrderId: string,
    @Res() res: Response,
  ) {
    const frontendUrl = this.configService.get<string>('APP_URL');
    try {
      await this.paymentService.capturePayment(paymentId, paypalOrderId);
      return res.redirect(`${frontendUrl}/payment-success?paymentId=${paymentId}`);
    } catch (error: any) {
      return res.redirect(`${frontendUrl}/payment-failed?paymentId=${paymentId}`);
    }
  }

  @Public()
  @Get('cancel')
  async cancelPayment(
    @Query('paymentId') paymentId: string,
    @Res() res: Response,
  ) {
    const frontendUrl = this.configService.get<string>('APP_URL');
    try {
      await this.paymentService.cancelPayment(paymentId);
    } catch (_) {}
    return res.redirect(`${frontendUrl}/payment-cancelled?paymentId=${paymentId}`);
  }


  @Get('my-payments')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('student')
  async getMyPayments(@CurrentUser() user: RequestUser) {
    try {
      const payments = await this.paymentService.findByCustomerEmail(user.email);

      return {
        success: true,
        total: payments.length,
        totalSpent: payments.reduce((sum, p) => sum + p.amount, 0),
        data: payments.map((p) => ({
          id: p._id.toString(),
          orderId: `ORD-${p._id.toString().slice(-6).toUpperCase()}`,
          serviceTitle: p.serviceTitle,
          date: p.createdAt
            ? new Date(p.createdAt).toLocaleDateString('en-PK')
            : 'N/A',
          amount: p.amount,
          currency: p.currency,
          method: p.method,
          status: p.status,
          paypalOrderId: p.paypalOrderId ?? null,
          paypalCaptureId: p.paypalCaptureId ?? null,
          customer: p.customer,
        })),
      };
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to fetch payments');
    }
  }

  // ─── ADMIN ROUTES ─────────────────────────────────────────────────────────

  @Get()
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  async findAll() {
    try {
      const payments = await this.paymentService.findAll();
      return { success: true, data: payments };
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to fetch payments');
    }
  }

  @Get('service/:servicePageId')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  async findByService(@Param('servicePageId') servicePageId: string) {
    try {
      const payments = await this.paymentService.findByServicePage(servicePageId);
      return { success: true, data: payments };
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to fetch payments');
    }
  }

  // ─── DYNAMIC :id ROUTES (hamesha sabse neeche) ───────────────────────────

  @Public()
  @Get(':id/status')
  async getPaymentStatus(@Param('id') id: string) {
    try {
      const payment = await this.paymentService.findById(id);
      return {
        success: true,
        data: {
          status: payment.status,
          amount: payment.amount,
          currency: payment.currency,
          serviceTitle: payment.serviceTitle,
          customer: payment.customer,
        },
      };
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to fetch payment status');
    }
  }

  @Get(':id')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  async findOne(@Param('id') id: string) {
    try {
      const payment = await this.paymentService.findById(id);
      return { success: true, data: payment };
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to fetch payment');
    }
  }
}