import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const Kavenegar = require('kavenegar');

type VerifyLookupArgs = {
  receptor: string;
  token: string;
  template?: string;
  type?: 'sms';
};

@Injectable()
export class KavenegarService {
  private readonly logger = new Logger(KavenegarService.name);
  private api: any;
  private defaultSender?: string;
  private verifyTemplate?: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('KAVENEGAR_API_KEY');
    this.defaultSender = this.configService.get<string>('KAVENEGAR_SENDER');
    this.verifyTemplate = this.configService.get<string>('KAVENEGAR_VERIFY_TEMPLATE');

    if (!apiKey) {
      this.logger.warn('KAVENEGAR_API_KEY is not set. SMS sending will fail.');
    }

    this.api = Kavenegar.KavenegarApi({ apikey: apiKey });
  }

  async sendSms(receptor: string, message: string, sender?: string): Promise<void> {
    const from = sender || this.defaultSender;

    this.logger.log(`Attempting to send SMS to ${receptor} from ${from}`);

    return new Promise<void>((resolve, reject) => {
      this.api.Send({ receptor, message, sender: from }, (response: any, status: any) => {
        this.logger.log(`Kavenegar response: status=${status}, response=${JSON.stringify(response)}`);

        if (status !== 200) {
          let errorMessage = `Kavenegar send failed with status ${status}`;

          if (response && response.return) {
            errorMessage += ` - ${response.return.message || 'Unknown error'}`;
          }

          this.logger.error(`Kavenegar error: ${errorMessage}`);
          this.logger.error(`Full response: ${JSON.stringify(response)}`);

          return reject(new Error(errorMessage));
        }

        this.logger.log(`SMS sent successfully to ${receptor}`);
        resolve();
      });
    });
  }

  async sendVerificationCode(
    receptor: string,
    token: string,
    options?: Omit<VerifyLookupArgs, 'receptor' | 'token'>,
  ): Promise<void> {
    if (!this.verifyTemplate && !options?.template) {
      throw new BadRequestException('KAVENEGAR_VERIFY_TEMPLATE is not configured.');
    }

    const payload: VerifyLookupArgs = {
      receptor,
      token,
      template: options?.template || this.verifyTemplate,
      type: options?.type,
    };

    this.logger.log(`Sending verification code via Kavenegar lookup to ${receptor}`);

    return new Promise<void>((resolve, reject) => {
      this.api.VerifyLookup(payload, (response: any, status: any) => {
        this.logger.log(`Kavenegar lookup response: status=${status}, response=${JSON.stringify(response)}`);

        if (status !== 200) {
          let errorMessage = `Kavenegar VerifyLookup failed with status ${status}`;

          if (response && response.return) {
            errorMessage += ` - ${response.return.message || 'Unknown error'}`;
          }

          this.logger.error(`Kavenegar VerifyLookup error: ${errorMessage}`);
          this.logger.error(`Full response: ${JSON.stringify(response)}`);

          return reject(new Error(errorMessage));
        }

        resolve();
      });
    });
  }
}
