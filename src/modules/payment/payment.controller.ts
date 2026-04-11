import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Redirect,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Public } from 'src/common/decorators/public.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';
import { CreatePaymentOrderDto } from './dto/Createpaymentorder.dto';
import { ICapturePaymentResponse, ICreatePaymentOrderResponse } from './interfaces/Payment.interface';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Public()
  @Post('create-order')
  @HttpCode(HttpStatus.CREATED)
  async createOrder(
    @Body() dto: CreatePaymentOrderDto,
  ): Promise<ICreatePaymentOrderResponse> {
    try {
      return await this.paymentService.createOrder(dto);
    } catch (error) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to create payment order');
    }
  }

  @Public()
  @Get('capture')
  async capturePayment(
    @Query('paymentId') paymentId: string,
    @Query('token') paypalOrderId: string, 
  ): Promise<ICapturePaymentResponse> {
    try {
      return await this.paymentService.capturePayment(paymentId, paypalOrderId);
    } catch (error) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to capture payment');
    }
  }

  @Public()
  @Get('cancel')
  async cancelPayment(
    @Query('paymentId') paymentId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      return await this.paymentService.cancelPayment(paymentId);
    } catch (error) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to cancel payment');
    }
  }

  @Get()
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  async findAll() {
    try {
      const payments = await this.paymentService.findAll();
      return { success: true, data: payments };
    } catch (error) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to fetch payments');
    }
  }

  @Get(':id')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  async findOne(@Param('id') id: string) {
    try {
      const payment = await this.paymentService.findById(id);
      return { success: true, data: payment };
    } catch (error) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to fetch payment');
    }
  }

  @Get('service/:servicePageId')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  async findByService(@Param('servicePageId') servicePageId: string) {
    try {
      const payments = await this.paymentService.findByServicePage(servicePageId);
      return { success: true, data: payments };
    } catch (error) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to fetch payments');
    }
  }
}