import { PrismaClient, UserRole, OrderStatus, PaymentStatus, ShippingMethod, NotificationPriority, NotificationType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetDatabase() {
  console.log('🧹 Resetting tables...');
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
  ]);
}

async function seedUsers() {
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@ecommerce.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      isEmailVerified: true,
      phone: '+1-555-0100',
      shippingAddress: '123 Admin Street, New York, NY 10001',
      billingAddress: '123 Admin Street, New York, NY 10001',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'United States',
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.CUSTOMER,
      isEmailVerified: true,
      phone: '+1-555-0101',
      shippingAddress: '456 Customer Ave, Los Angeles, CA 90001',
      billingAddress: '456 Customer Ave, Los Angeles, CA 90001',
      city: 'Los Angeles',
      state: 'CA',
      postalCode: '90001',
      country: 'United States',
    },
  });

  console.log('✅ Seeded users');
  return { admin, customer };
}

async function seedCategories() {
  const electronics = await prisma.category.create({
    data: {
      name: 'Electronics',
      description: 'Electronic devices and gadgets',
      slug: 'electronics',
      icon: 'fa-laptop',
    },
  });

  const computers = await prisma.category.create({
    data: {
      name: 'Computers & Laptops',
      description: 'Desktop computers, laptops, and accessories',
      slug: 'computers-laptops',
      icon: 'fa-computer',
      parentId: electronics.id,
    },
  });

  const clothing = await prisma.category.create({
    data: {
      name: 'Clothing',
      description: 'Fashion and apparel',
      slug: 'clothing',
      icon: 'fa-shirt',
    },
  });

  const homeGarden = await prisma.category.create({
    data: {
      name: 'Home & Garden',
      description: 'Home improvement and garden supplies',
      slug: 'home-garden',
      icon: 'fa-home',
    },
  });

  console.log('✅ Seeded categories');
  return { electronics, computers, clothing, homeGarden };
}

async function seedProducts(categories: ReturnType<typeof seedCategories> extends Promise<infer R> ? R : never) {
  const { electronics, computers, clothing, homeGarden } = categories as await ReturnType<typeof seedCategories>;

  const laptop = await prisma.product.create({
    data: {
      name: 'Gaming Laptop Pro 15',
      description: 'High-performance gaming laptop with RTX 4080, 32GB RAM, 1TB SSD.',
      price: 1299.99,
      originalPrice: 1499.99,
      discountPercentage: 13.33,
      sku: 'LAP-GAMING-001',
      quantity: 50,
      brand: 'TechBrand',
      model: 'GP15-2024',
      images: [
        'https://images.unsplash.com/photo-1603302576837-37561b2e2302',
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed',
      ],
      tags: ['gaming', 'laptop', 'high-performance', 'rtx'],
      isFeatured: true,
      warranty: '2 years manufacturer warranty',
      shippingInfo: 'Free shipping on orders over $50',
      madeIn: 'Taiwan',
      categoryId: computers.id,
    },
  });

  const smartphone = await prisma.product.create({
    data: {
      name: 'Smartphone Ultra 5G',
      description: '6.7" AMOLED display, 5G capable, triple camera system, 256GB storage',
      price: 899.99,
      sku: 'PHONE-ULTRA-001',
      quantity: 100,
      brand: 'TechMobile',
      model: 'Ultra-2024',
      images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9'],
      tags: ['smartphone', '5g', 'premium'],
      isFeatured: true,
      warranty: '1 year manufacturer warranty',
      categoryId: electronics.id,
    },
  });

  const tshirt = await prisma.product.create({
    data: {
      name: 'Premium Cotton T-Shirt',
      description: '100% organic cotton, comfortable fit, perfect for everyday wear',
      price: 29.99,
      originalPrice: 39.99,
      discountPercentage: 25,
      sku: 'SHIRT-COTTON-001',
      quantity: 200,
      brand: 'EcoWear',
      size: 'M',
      tags: ['clothing', 't-shirt', 'cotton', 'casual'],
      categoryId: clothing.id,
    },
  });

  const coffeemaker = await prisma.product.create({
    data: {
      name: 'Smart Coffee Maker',
      description: 'WiFi-enabled coffee maker with app control, programmable brewing',
      price: 149.99,
      sku: 'HOME-COFFEE-001',
      quantity: 75,
      brand: 'BrewMaster',
      tags: ['home', 'kitchen', 'coffee', 'smart'],
      categoryId: homeGarden.id,
    },
  });

  console.log('✅ Seeded products');
  return { laptop, smartphone, tshirt, coffeemaker };
}

async function seedOrderWithRelations(customerId: string, productId: string) {
  const order = await prisma.order.create({
    data: {
      userId: customerId,
      orderNumber: `ORD-${Date.now()}`,
      status: OrderStatus.DELIVERED,
      paymentStatus: PaymentStatus.COMPLETED,
      subtotal: 899.99,
      tax: 72.0,
      shipping: 15,
      total: 986.99,
      shippingAddress: '456 Customer Ave, Los Angeles, CA 90001',
      billingAddress: '456 Customer Ave, Los Angeles, CA 90001',
      shippingFirstName: 'John',
      shippingLastName: 'Doe',
      shippingPhone: '+1-555-0101',
      shippingEmail: 'customer@example.com',
      shippingMethod: ShippingMethod.STANDARD,
      paymentMethod: 'stripe',
      paymentIntentId: 'pi_test_seed',
      trackingNumber: '1Z999AA10123456784',
      carrier: 'UPS',
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
      price: 899.99,
      subtotal: 899.99,
      total: 899.99,
    },
  });

  console.log('✅ Seeded order');
  return order;
}

async function main() {
  console.log('🌱 Starting database seed...');
  await resetDatabase();

  const { admin, customer } = await seedUsers();
  const categories = await seedCategories();
  const products = await seedProducts(categories);

  await prisma.review.createMany({
    data: [
      {
        userId: customer.id,
        productId: products.laptop.id,
        rating: 5,
        title: 'Excellent Gaming Performance',
        comment: 'RTX 4080 handles all modern games at high settings.',
        isVerifiedPurchase: true,
      },
      {
        userId: customer.id,
        productId: products.smartphone.id,
        rating: 4,
        title: 'Great Phone, Minor Issues',
        comment: 'Camera quality is great, battery could be better.',
        isVerifiedPurchase: true,
      },
    ],
  });

  await prisma.cart.create({
    data: {
      userId: customer.id,
      isActive: true,
      totalAmount: 1329.98,
      itemCount: 2,
      items: {
        create: [
          {
            productId: products.laptop.id,
            quantity: 1,
            price: 1299.99,
            subtotal: 1299.99,
          },
          {
            productId: products.tshirt.id,
            quantity: 1,
            price: 29.99,
            subtotal: 29.99,
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
      note: 'For new apartment',
      priority: 1,
    },
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: customer.id,
        title: 'Order Delivered',
        message: `Your order #${order.orderNumber} has been delivered!`,
        type: NotificationType.ORDER_DELIVERED,
        priority: NotificationPriority.HIGH,
      },
      {
        userId: customer.id,
        title: 'Price Drop Alert',
        message: 'The Gaming Laptop Pro 15 is now on sale!',
        type: NotificationType.PRICE_DROP,
        priority: NotificationPriority.MEDIUM,
      },
    ],
  });

  console.log('\n🎉 Database seed complete!');
  console.log('Admin credentials -> admin@ecommerce.com / Password123!');
  console.log('Customer credentials -> customer@example.com / Password123!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
