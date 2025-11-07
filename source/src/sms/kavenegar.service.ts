import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Kavenegar = require('kavenegar');

@Injectable()
export class KavenegarService {
  private readonly logger = new Logger(KavenegarService.name);
  private api: any;
  private defaultSender?: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('KAVENEGAR_API_KEY');
    this.defaultSender = this.configService.get<string>('KAVENEGAR_SENDER');
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
          
          // Parse Kavenegar error messages
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
}
