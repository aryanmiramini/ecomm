import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { getErrorByMessage, ERROR_MESSAGES } from './errors.constants';

type NormalizedError = {
  statusCode: number;
  code?: string;
  messageEn: string;
  messageFa: string;
  details?: unknown;
  timestamp?: string;
  path?: string;
};

function getPreferredLang(req: Request): 'fa' | 'en' {
  const raw = String(req.headers['accept-language'] || '').toLowerCase();
  return raw.includes('fa') ? 'fa' : 'en';
}

function coerceMessage(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    const parts = value.map((v) => (typeof v === 'string' ? v : '')).filter(Boolean);
    return parts.length ? parts.join('، ') : undefined;
  }
  return undefined;
}

function normalizeException(exception: unknown, req: Request): NormalizedError {
  const timestamp = new Date().toISOString();
  const path = req.originalUrl;

  if (exception instanceof HttpException) {
    const statusCode = exception.getStatus();
    const response = exception.getResponse() as any;

    const responseMessage =
      coerceMessage(response?.messageFa) ||
      coerceMessage(response?.messageEn) ||
      coerceMessage(response?.message) ||
      coerceMessage((exception as any)?.message);

    const messageEn =
      coerceMessage(response?.messageEn) ||
      (typeof responseMessage === 'string' ? responseMessage : 'Request failed');

    const errorDef = getErrorByMessage(messageEn);
    
    const messageFa = coerceMessage(response?.messageFa) || errorDef?.fa || 'خطا در انجام درخواست';
    const code = response?.code || errorDef?.code || `ERROR_${statusCode}`;

    return {
      statusCode,
      code,
      messageEn: errorDef?.en || messageEn,
      messageFa,
      details: response?.details,
      timestamp,
      path,
    };
  }

  return {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    code: ERROR_MESSAGES.INTERNAL_ERROR.code,
    messageEn: ERROR_MESSAGES.INTERNAL_ERROR.en,
    messageFa: ERROR_MESSAGES.INTERNAL_ERROR.fa,
    timestamp,
    path,
  };
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const normalized = normalizeException(exception, req);
    const lang = getPreferredLang(req);

    if (normalized.statusCode >= 500) {
      this.logger.error(
        `${normalized.code}: ${normalized.messageEn}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    const message = lang === 'fa' ? normalized.messageFa : normalized.messageEn;

    res.status(normalized.statusCode).json({
      success: false,
      statusCode: normalized.statusCode,
      code: normalized.code,
      message,
      messageFa: normalized.messageFa,
      messageEn: normalized.messageEn,
      details: normalized.details,
      path: normalized.path,
      timestamp: normalized.timestamp,
    });
  }
}


