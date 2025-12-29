import { HttpException, HttpStatus } from '@nestjs/common';
import { ERROR_MESSAGES, ErrorMessage } from '../errors.constants';

export class BusinessException extends HttpException {
  constructor(
    errorKey: keyof typeof ERROR_MESSAGES,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    details?: any,
  ) {
    const error = ERROR_MESSAGES[errorKey];
    
    super(
      {
        code: error.code,
        messageEn: error.en,
        messageFa: error.fa,
        details,
      },
      statusCode,
    );
  }
}

export class ValidationException extends BusinessException {
  constructor(details?: any) {
    super('VALIDATION_ERROR', HttpStatus.BAD_REQUEST, details);
  }
}

export class NotFoundException extends BusinessException {
  constructor(resource: 'USER' | 'PRODUCT' | 'CATEGORY' | 'ORDER' | 'CART_ITEM' | 'REVIEW') {
    super(`${resource}_NOT_FOUND` as keyof typeof ERROR_MESSAGES, HttpStatus.NOT_FOUND);
  }
}

export class DuplicateException extends BusinessException {
  constructor(resource: string) {
    const key = `${resource}_DUPLICATE` as keyof typeof ERROR_MESSAGES;
    super(key, HttpStatus.CONFLICT);
  }
}

export class UnauthorizedException extends BusinessException {
  constructor(errorKey: keyof typeof ERROR_MESSAGES = 'UNAUTHORIZED') {
    super(errorKey, HttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenException extends BusinessException {
  constructor(errorKey: keyof typeof ERROR_MESSAGES = 'FORBIDDEN') {
    super(errorKey, HttpStatus.FORBIDDEN);
  }
}
