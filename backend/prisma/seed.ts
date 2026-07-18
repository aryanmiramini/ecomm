import { PrismaClient, UserRole, OrderStatus, PaymentStatus, ShippingMethod, NotificationPriority, NotificationType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:StrongPassword123@localhost:5432/ecommerce_db?schema=public';

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function resetDatabase() {
  console.log('🧹 در حال پاک‌سازی جداول...');
  await prisma.$transaction([
    prisma.notification.deleteMany(),
    prisma.wishlist.deleteMany(),
    prisma.review.deleteMany(),
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.cartItem.deleteMany(),
    prisma.cart.deleteMany(),
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
    prisma.user.deleteMany(),
    prisma.otpCode.deleteMany(),
  ]);
}

async function seedUsers() {
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@ecommerce.com',
      password: hashedPassword,
      firstName: 'مدیر',
      lastName: 'سیستم',
      role: UserRole.ADMIN,
      isEmailVerified: true,
      isActive: true,
      phone: '09120000001',
      shippingAddress: 'تهران، خیابان ولیعصر، پلاک ۱۲۳، واحد ۵',
      billingAddress: 'تهران، خیابان ولیعصر، پلاک ۱۲۳، واحد ۵',
      city: 'تهران',
      state: 'تهران',
      postalCode: '1417812345',
      country: 'ایران',
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      password: hashedPassword,
      firstName: 'علی',
      lastName: 'رضایی',
      role: UserRole.CUSTOMER,
      isEmailVerified: true,
      isActive: true,
      phone: '09121234567',
      shippingAddress: 'اصفهان، خیابان چهارباغ عباسی، کوچه گلستان، پلاک ۴۵',
      billingAddress: 'اصفهان، خیابان چهارباغ عباسی، کوچه گلستان، پلاک ۴۵',
      city: 'اصفهان',
      state: 'اصفهان',
      postalCode: '8145678901',
      country: 'ایران',
    },
  });

  console.log('✅ کاربران ایجاد شدند');
  return { admin, customer };
}

async function seedCategories() {
  const electronics = await prisma.category.create({
    data: {
      name: 'الکترونیک',
      description: 'گوشی، تبلت، لوازم جانبی و گجت‌های دیجیتال',
      slug: 'elektronik',
      icon: 'fa-laptop',
      image: '/media/seed/electronics.svg',
    },
  });

  const computers = await prisma.category.create({
    data: {
      name: 'رایانه و لپ‌تاپ',
      description: 'لپ‌تاپ، رایانه رومیزی و تجهیزات جانبی',
      slug: 'laptop-computer',
      icon: 'fa-computer',
      parentId: electronics.id,
      image: '/media/seed/laptop.svg',
    },
  });

  const clothing = await prisma.category.create({
    data: {
      name: 'پوشاک',
      description: 'لباس، کفش و اکسسوری‌های روزمره',
      slug: 'pooshak',
      icon: 'fa-shirt',
      image: '/media/seed/clothing.svg',
    },
  });

  const homeGarden = await prisma.category.create({
    data: {
      name: 'خانه و آشپزخانه',
      description: 'لوازم خانگی، آشپزخانه و دکوراسیون',
      slug: 'khaneh-ashpazkhaneh',
      icon: 'fa-home',
      image: '/media/seed/coffee.svg',
    },
  });

  console.log('✅ دسته‌بندی‌ها ایجاد شدند');
  return { electronics, computers, clothing, homeGarden };
}

async function seedProducts(categories: Awaited<ReturnType<typeof seedCategories>>) {
  const { electronics, computers, clothing, homeGarden } = categories;

  const laptop = await prisma.product.create({
    data: {
      name: 'لپ‌تاپ گیمینگ پرو ۱۵',
      description:
        'لپ‌تاپ قدرتمند گیمینگ با پردازنده نسل جدید، کارت گرافیک RTX، ۳۲ گیگابایت رم و حافظه SSD یک ترابایتی. مناسب بازی، طراحی و کارهای سنگین.',
      price: 52990000,
      originalPrice: 58990000,
      discountPercentage: 10.17,
      sku: 'LAP-GAMING-001',
      quantity: 50,
      brand: 'تک‌پرداز',
      model: 'GP15-1403',
      images: ['/media/seed/laptop.svg', '/media/seed/laptop.svg'],
      tags: ['گیمینگ', 'لپ‌تاپ', 'قدرتمند', 'گرافیک'],
      isFeatured: true,
      warranty: 'گارانتی ۲۴ ماهه شرکت',
      shippingInfo: 'ارسال رایگان برای سفارش‌های بالای ۵ میلیون تومان',
      madeIn: 'تایوان',
      categoryId: computers.id,
    },
  });

  const smartphone = await prisma.product.create({
    data: {
      name: 'گوشی هوشمند اولترا ۵G',
      description:
        'نمایشگر ۶.۷ اینچ AMOLED، پشتیبانی از ۵G، دوربین سه‌گانه حرفه‌ای و حافظه داخلی ۲۵۶ گیگابایت.',
      price: 32990000,
      sku: 'PHONE-ULTRA-001',
      quantity: 100,
      brand: 'موبایل‌پلاس',
      model: 'Ultra-1403',
      images: ['/media/seed/phone.svg'],
      tags: ['گوشی', '۵G', 'پرچمدار'],
      isFeatured: true,
      warranty: 'گارانتی ۱۸ ماهه',
      categoryId: electronics.id,
    },
  });

  const tshirt = await prisma.product.create({
    data: {
      name: 'تی‌شرت نخی پریمیوم',
      description: '۱۰۰٪ نخ ارگانیک، دوخت با کیفیت، مناسب استفاده روزمره و چهار فصل.',
      price: 890000,
      originalPrice: 1190000,
      discountPercentage: 25.21,
      sku: 'SHIRT-COTTON-001',
      quantity: 200,
      brand: 'پوشاک اصیل',
      size: 'M',
      tags: ['پوشاک', 'تی‌شرت', 'نخی', 'روزمره'],
      images: ['/media/seed/tshirt.svg'],
      categoryId: clothing.id,
    },
  });

  const coffeemaker = await prisma.product.create({
    data: {
      name: 'قهوه‌ساز هوشمند',
      description: 'قهوه‌ساز متصل به وای‌فای با کنترل از طریق اپلیکیشن و برنامه‌ریزی زمان دم‌آوری.',
      price: 6990000,
      sku: 'HOME-COFFEE-001',
      quantity: 75,
      brand: 'دم‌نوش',
      tags: ['خانه', 'آشپزخانه', 'قهوه', 'هوشمند'],
      images: ['/media/seed/coffee.svg'],
      categoryId: homeGarden.id,
    },
  });

  console.log('✅ محصولات ایجاد شدند');
  return { laptop, smartphone, tshirt, coffeemaker };
}

async function seedOrderWithRelations(customerId: string, productId: string) {
  const order = await prisma.order.create({
    data: {
      userId: customerId,
      orderNumber: `ORD-${Date.now()}`,
      status: OrderStatus.DELIVERED,
      paymentStatus: PaymentStatus.COMPLETED,
      subtotal: 32990000,
      tax: 2639200,
      shipping: 350000,
      total: 35979200,
      shippingAddress: 'اصفهان، خیابان چهارباغ عباسی، کوچه گلستان، پلاک ۴۵',
      billingAddress: 'اصفهان، خیابان چهارباغ عباسی، کوچه گلستان، پلاک ۴۵',
      shippingFirstName: 'علی',
      shippingLastName: 'رضایی',
      shippingPhone: '09121234567',
      shippingEmail: 'customer@example.com',
      shippingMethod: ShippingMethod.STANDARD,
      paymentMethod: 'cash',
      trackingNumber: 'IR-1403123456789',
      carrier: 'پست پیشتاز',
      itemCount: 1,
      paidAt: new Date(),
      shippedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      deliveredAt: new Date(),
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: order.id,
      productId,
      quantity: 1,
      price: 32990000,
      subtotal: 32990000,
      total: 32990000,
    },
  });

  console.log('✅ سفارش نمونه ایجاد شد');
  return order;
}

async function main() {
  if (process.env.RUN_SEED !== 'true') {
    console.log('Seed رد شد (برای اجرا RUN_SEED=true تنظیم کنید).');
    return;
  }

  console.log('🌱 شروع seed پایگاه داده...');
  await resetDatabase();

  const { admin, customer } = await seedUsers();
  const categories = await seedCategories();
  const products = await seedProducts(categories);

  await prisma.review.createMany({
    data: [
      {
        userId: customer.id,
        productId: products.smartphone.id,
        rating: 4,
        title: 'گوشی عالی با چند نکته جزئی',
        comment: 'کیفیت دوربین واقعاً خوب است و صفحه‌نمایش شفاف است. فقط دوام باتری در استفاده سنگین کمی کمتر از انتظار بود.',
        isVerifiedPurchase: true,
      },
    ],
  });

  await prisma.cart.create({
    data: {
      userId: customer.id,
      isActive: true,
      totalAmount: 53880000,
      itemCount: 2,
      items: {
        create: [
          {
            productId: products.laptop.id,
            quantity: 1,
            price: 52990000,
            subtotal: 52990000,
          },
          {
            productId: products.tshirt.id,
            quantity: 1,
            price: 890000,
            subtotal: 890000,
          },
        ],
      },
    },
  });

  const order = await seedOrderWithRelations(customer.id, products.smartphone.id);

  await prisma.wishlist.create({
    data: {
      userId: customer.id,
      productId: products.coffeemaker.id,
      note: 'برای آشپزخانه خانه جدید',
      priority: 1,
    },
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: customer.id,
        title: 'سفارش تحویل شد',
        message: `سفارش شما با شماره ${order.orderNumber} با موفقیت تحویل داده شد.`,
        type: NotificationType.ORDER_DELIVERED,
        priority: NotificationPriority.HIGH,
      },
      {
        userId: customer.id,
        title: 'کاهش قیمت',
        message: 'لپ‌تاپ گیمینگ پرو ۱۵ اکنون با تخفیف ویژه در فروشگاه موجود است.',
        type: NotificationType.PRICE_DROP,
        priority: NotificationPriority.MEDIUM,
      },
    ],
  });

  console.log('\n🎉 seed پایگاه داده با موفقیت انجام شد!');
  console.log('حساب مدیر -> admin@ecommerce.com / Password123!');
  console.log('حساب مشتری -> customer@example.com / Password123!');
}

main()
  .catch((e) => {
    console.error('❌ خطا در seed پایگاه داده:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
