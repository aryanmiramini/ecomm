export interface ErrorMessage {
  code: string;
  en: string;
  fa: string;
}

export const ERROR_MESSAGES: Record<string, ErrorMessage> = {
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    en: 'Unauthorized access',
    fa: 'دسترسی غیرمجاز است',
  },
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    en: 'Invalid credentials',
    fa: 'نام کاربری یا رمز عبور اشتباه است',
  },
  ACCOUNT_INACTIVE: {
    code: 'ACCOUNT_INACTIVE',
    en: 'Account is inactive',
    fa: 'حساب کاربری غیرفعال است',
  },
  SESSION_EXPIRED: {
    code: 'SESSION_EXPIRED',
    en: 'Session has expired',
    fa: 'نشست شما منقضی شده است',
  },
  
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    en: 'Validation failed',
    fa: 'اعتبارسنجی ناموفق بود',
  },
  REQUIRED_FIELD: {
    code: 'REQUIRED_FIELD',
    en: 'This field is required',
    fa: 'این فیلد الزامی است',
  },
  INVALID_FORMAT: {
    code: 'INVALID_FORMAT',
    en: 'Invalid format',
    fa: 'فرمت نامعتبر است',
  },
  
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    en: 'User not found',
    fa: 'کاربر یافت نشد',
  },
  PRODUCT_NOT_FOUND: {
    code: 'PRODUCT_NOT_FOUND',
    en: 'Product not found',
    fa: 'محصول یافت نشد',
  },
  CATEGORY_NOT_FOUND: {
    code: 'CATEGORY_NOT_FOUND',
    en: 'Category not found',
    fa: 'دسته‌بندی یافت نشد',
  },
  ORDER_NOT_FOUND: {
    code: 'ORDER_NOT_FOUND',
    en: 'Order not found',
    fa: 'سفارش یافت نشد',
  },
  CART_ITEM_NOT_FOUND: {
    code: 'CART_ITEM_NOT_FOUND',
    en: 'Cart item not found',
    fa: 'آیتم سبد خرید یافت نشد',
  },
  REVIEW_NOT_FOUND: {
    code: 'REVIEW_NOT_FOUND',
    en: 'Review not found',
    fa: 'نظر یافت نشد',
  },
  
  DUPLICATE_ENTRY: {
    code: 'DUPLICATE_ENTRY',
    en: 'This entry already exists',
    fa: 'این مورد قبلاً ثبت شده است',
  },
  PRODUCT_SKU_DUPLICATE: {
    code: 'PRODUCT_SKU_DUPLICATE',
    en: 'Product with this SKU already exists',
    fa: 'محصولی با این کد SKU از قبل وجود دارد',
  },
  CATEGORY_NAME_DUPLICATE: {
    code: 'CATEGORY_NAME_DUPLICATE',
    en: 'Category with this name already exists',
    fa: 'دسته‌بندی با این نام از قبل وجود دارد',
  },
  USER_EMAIL_DUPLICATE: {
    code: 'USER_EMAIL_DUPLICATE',
    en: 'User with this email already exists',
    fa: 'کاربری با این ایمیل از قبل وجود دارد',
  },
  USER_PHONE_DUPLICATE: {
    code: 'USER_PHONE_DUPLICATE',
    en: 'User with this phone already exists',
    fa: 'کاربری با این شماره تلفن از قبل وجود دارد',
  },
  WISHLIST_DUPLICATE: {
    code: 'WISHLIST_DUPLICATE',
    en: 'Product already in wishlist',
    fa: 'این محصول قبلاً به علاقه‌مندی‌ها اضافه شده است',
  },
  
  INSUFFICIENT_STOCK: {
    code: 'INSUFFICIENT_STOCK',
    en: 'Insufficient stock available',
    fa: 'موجودی کافی نیست',
  },
  CART_EMPTY: {
    code: 'CART_EMPTY',
    en: 'Cart is empty',
    fa: 'سبد خرید خالی است',
  },
  INVALID_QUANTITY: {
    code: 'INVALID_QUANTITY',
    en: 'Invalid quantity',
    fa: 'تعداد نامعتبر است',
  },
  ORDER_CANNOT_BE_CANCELLED: {
    code: 'ORDER_CANNOT_BE_CANCELLED',
    en: 'Order cannot be cancelled',
    fa: 'امکان لغو سفارش وجود ندارد',
  },
  REVIEW_ALREADY_EXISTS: {
    code: 'REVIEW_ALREADY_EXISTS',
    en: 'You have already reviewed this product',
    fa: 'شما قبلاً برای این محصول نظر ثبت کرده‌اید',
  },
  
  FORBIDDEN: {
    code: 'FORBIDDEN',
    en: 'You do not have permission to perform this action',
    fa: 'شما اجازه انجام این عملیات را ندارید',
  },
  ADMIN_ONLY: {
    code: 'ADMIN_ONLY',
    en: 'Admin access required',
    fa: 'نیاز به دسترسی مدیریت',
  },
  
  INTERNAL_ERROR: {
    code: 'INTERNAL_ERROR',
    en: 'Internal server error',
    fa: 'خطای داخلی سرور',
  },
  DATABASE_ERROR: {
    code: 'DATABASE_ERROR',
    en: 'Database operation failed',
    fa: 'خطا در عملیات پایگاه داده',
  },
  SERVICE_UNAVAILABLE: {
    code: 'SERVICE_UNAVAILABLE',
    en: 'Service temporarily unavailable',
    fa: 'سرویس موقتاً در دسترس نیست',
  },
  
  OTP_COOLDOWN: {
    code: 'OTP_COOLDOWN',
    en: 'Please wait before requesting another code',
    fa: 'لطفاً قبل از درخواست کد جدید صبر کنید',
  },
  OTP_EXPIRED: {
    code: 'OTP_EXPIRED',
    en: 'Verification code has expired',
    fa: 'کد تأیید منقضی شده است',
  },
  OTP_INVALID: {
    code: 'OTP_INVALID',
    en: 'Invalid verification code',
    fa: 'کد تأیید نامعتبر است',
  },
  OTP_MAX_ATTEMPTS: {
    code: 'OTP_MAX_ATTEMPTS',
    en: 'Too many failed attempts',
    fa: 'تعداد تلاش‌های ناموفق بیش از حد مجاز',
  },
};

export function getErrorMessage(key: string, lang: 'en' | 'fa' = 'en'): string {
  const error = ERROR_MESSAGES[key];
  if (!error) {
    return lang === 'fa' ? 'خطای نامشخص' : 'Unknown error';
  }
  return lang === 'fa' ? error.fa : error.en;
}

export function getErrorByMessage(message: string): ErrorMessage | undefined {
  const byEn = Object.values(ERROR_MESSAGES).find(err => err.en === message);
  if (byEn) return byEn;
  
  const byFa = Object.values(ERROR_MESSAGES).find(err => err.fa === message);
  if (byFa) return byFa;
  
  const partialMatch = Object.values(ERROR_MESSAGES).find(err => 
    err.en.toLowerCase().includes(message.toLowerCase()) ||
    err.fa.includes(message)
  );
  
  return partialMatch;
}
