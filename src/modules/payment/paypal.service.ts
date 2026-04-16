import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { IPayPalAccessToken, IPayPalCaptureResponse, IPayPalCreateOrderResponse } from './interfaces/Payment.interface';


@Injectable()
export class PaypalService {
  private readonly logger = new Logger(PaypalService.name);
  private readonly baseUrl: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly httpClient: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    const isSandbox = this.configService.get<string>('PAYPAL_MODE') !== 'live';
    this.baseUrl = isSandbox
      ? 'https://api-m.sandbox.paypal.com'
      : 'https://api-m.paypal.com';

    this.clientId = this.configService.getOrThrow<string>('PAYPAL_CLIENT_ID');
    this.clientSecret = this.configService.getOrThrow<string>('PAYPAL_CLIENT_SECRET');

    this.httpClient = axios.create({ baseURL: this.baseUrl });
  }

  private async getAccessToken(): Promise<string> {
    try {
      const credentials = Buffer.from(
        `${this.clientId}:${this.clientSecret}`,
      ).toString('base64');

      const { data } = await this.httpClient.post<IPayPalAccessToken>(
        '/v1/oauth2/token',
        'grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return data.access_token;
   } catch (error) {
const err = error as any;
this.logger.error('PayPal token fetch failed', {
  message: err?.message,
  response: err?.response?.data,
  status: err?.response?.status,
});
  throw new InternalServerErrorException('Payment gateway authentication failed');
}
  }

  async createOrder(
    amount: number,
    currency: string = 'USD',
    referenceId: string,
    returnUrl: string,
    cancelUrl: string,
  ): Promise<IPayPalCreateOrderResponse> {
    const accessToken = await this.getAccessToken();

    try {
      const { data } = await this.httpClient.post<IPayPalCreateOrderResponse>(
        '/v2/checkout/orders',
        {
          intent: 'CAPTURE',
          purchase_units: [
            {
              reference_id: referenceId,
              amount: {
                currency_code: currency.toUpperCase(),
                value: amount.toFixed(2),
              },
            },
          ],
          application_context: {
            return_url: returnUrl,
            cancel_url: cancelUrl,
            brand_name: this.configService.get<string>('APP_NAME', 'MyApp'),
            user_action: 'PAY_NOW',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return data;
    } catch (error) {
 this.logger.error('PayPal order creation failed', (error as any)?.response?.data || error);
      throw new BadRequestException('Failed to create PayPal order');
    }
  }

  async captureOrder(paypalOrderId: string): Promise<IPayPalCaptureResponse> {
    const accessToken = await this.getAccessToken();

    try {
      const { data } = await this.httpClient.post<IPayPalCaptureResponse>(
        `/v2/checkout/orders/${paypalOrderId}/capture`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return data;
    } catch (error) {
     this.logger.error('PayPal capture failed', (error as any)?.response?.data || error);
      throw new BadRequestException('Failed to capture PayPal payment');
    }
  }
}