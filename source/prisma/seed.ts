import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (in reverse order of dependencies)
  await prisma.notification.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleared existing data');

  // Create Users
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@ecommerce.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isEmailVerified: true,
      phone: '+1-555-0100',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      postalCode: '10001',
      shippingAddress: '123 Admin Street, New York, NY 10001',
      billingAddress: '123 Admin Street, New York, NY 10001',
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'CUSTOMER',
      isEmailVerified: true,
      phone: '+1-555-0101',
      city: 'Los Angeles',
      state: 'CA',
      country: 'United States',
      postalCode: '90001',
      shippingAddress: '456 Customer Ave, Los Angeles, CA 90001',
      billingAddress: '456 Customer Ave, Los Angeles, CA 90001',
    },
  });

  console.log('✅ Created users');

  // Create Categories
  const electronics = await prisma.category.create({
    data: {
      name: 'Electronics',
      description: 'Electronic devices and gadgets',
      slug: 'electronics',
      icon: 'fa-laptop',
      isActive: true,
      sortOrder: 1,
    },
  });

  const computers = await prisma.category.create({
    data: {
      name: 'Computers & Laptops',
      description: 'Desktop computers, laptops, and accessories',
      slug: 'computers-laptops',
      icon: 'fa-computer',
      isActive: true,
      sortOrder: 2,
      parentId: electronics.id,
    },
  });

  const clothing = await prisma.category.create({
    data: {
      name: 'Clothing',
      description: 'Fashion and apparel',
      slug: 'clothing',
      icon: 'fa-shirt',
      isActive: true,
      sortOrder: 3,
    },
  });

  const homeGarden = await prisma.category.create({
    data: {
      name: 'Home & Garden',
      description: 'Home improvement and garden supplies',
      slug: 'home-garden',
      icon: 'fa-home',
      isActive: true,
      sortOrder: 4,
    },
  });

  console.log('✅ Created categories');

  // Create Products
  const laptop = await prisma.product.create({
    data: {
      name: 'Gaming Laptop Pro 15',
      description: 'High-performance gaming laptop with RTX 4080, 32GB RAM, 1TB SSD. Perfect for gaming and content creation.',
      price: 1299.99,
      originalPrice: 1499.99,
      discountPercentage: 13.33,
      sku: 'LAP-GAMING-001',
      quantity: 50,
      brand: 'TechBrand',
      model: 'GP15-2024',
      rating: 4.7,
      reviewCount: 128,
      images: [
        'https://images.unsplash.com/photo-1603302576837-37561b2e2302',
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed',
      ],
      weight: 2.5,
      dimensions: '35.5x24.5x2.0',
      color: 'Black',
      tags: ['gaming', 'laptop', 'high-performance', 'rtx'],
      isActive: true,
      isFeatured: true,
      condition: 'new',
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
      rating: 4.5,
      reviewCount: 89,
      images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9'],
      weight: 0.195,
      dimensions: '16.0x7.5x0.8',
      color: 'Midnight Blue',
      tags: ['smartphone', '5g', 'premium'],
      isActive: true,
      isFeatured: true,
      condition: 'new',
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
      rating: 4.3,
      reviewCount: 45,
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'],
      color: 'Navy Blue',
      size: 'M',
      tags: ['clothing', 't-shirt', 'cotton', 'casual'],
      isActive: true,
      condition: 'new',
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
      model: 'Smart-2024',
      rating: 4.6,
      reviewCount: 67,
      images: ['https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6'],
      weight: 3.2,
      dimensions: '25x20x35',
      color: 'Stainless Steel',
      tags: ['home', 'kitchen', 'coffee', 'smart'],
      isActive: true,
      condition: 'new',
      warranty: '1 year warranty',
      categoryId: homeGarden.id,
    },
  });

  console.log('✅ Created products');

  // Create Reviews
  await prisma.review.createMany({
    data: [
      {
        userId: customerUser.id,
        productId: laptop.id,
        rating: 5,
        title: 'Excellent Gaming Performance',
        comment: 'This laptop exceeded my expectations! The RTX 4080 handles all modern games at high settings.',
        isVerifiedPurchase: true,
        helpfulCount: 15,
      },
      {
        userId: customerUser.id,
        productId: smartphone.id,
        rating: 4,
        title: 'Great Phone, Minor Issues',
        comment: 'Love the camera quality and 5G speed, but battery life could be better.',
        isVerifiedPurchase: true,
        helpfulCount: 8,
      },
    ],
  });

  console.log('✅ Created reviews');

  // Create Cart for customer
  const cart = await prisma.cart.create({
    data: {
      userId: customerUser.id,
      isActive: true,
      totalAmount: 1329.98,
      itemCount: 2,
    },
  });

  await prisma.cartItem.createMany({
    data: [
      {
        cartId: cart.id,
        productId: laptop.id,
        quantity: 1,
        price: 1299.99,
        subtotal: 1299.99,
      },
      {
        cartId: cart.id,
        productId: tshirt.id,
        quantity: 1,
        price: 29.99,
        subtotal: 29.99,
      },
    ],
  });

  console.log('✅ Created cart');

  // Create Order
  const order = await prisma.order.create({
    data: {
      userId: customerUser.id,
      orderNumber: `ORD-${Date.now()}`,
      status: 'DELIVERED',
      paymentStatus: 'COMPLETED',
      subtotal: 899.99,
      tax: 72.00,
      shipping: 15.00,
      total: 986.99,
      shippingAddress: '456 Customer Ave, Los Angeles, CA 90001',
      billingAddress: '456 Customer Ave, Los Angeles, CA 90001',
      shippingFirstName: 'John',
      shippingLastName: 'Doe',
      shippingPhone: '+1-555-0101',
      shippingEmail: 'customer@example.com',
      shippingMethod: 'STANDARD',
      paymentMethod: 'stripe',
      paymentIntentId: 'pi_test_' + Math.random().toString(36).substr(2, 9),
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
      productId: smartphone.id,
      quantity: 1,
      price: 899.99,
      subtotal: 899.99,
      total: 899.99,
    },
  });

  console.log('✅ Created order');

  // Create Wishlist
  await prisma.wishlist.createMany({
    data: [
      {
        userId: customerUser.id,
        productId: coffeemaker.id,
        note: 'For new apartment',
        priority: 1,
      },
    ],
  });

  console.log('✅ Created wishlist items');

  // Create Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: customerUser.id,
        title: 'Order Delivered',
        message: `Your order #${order.orderNumber} has been delivered!`,
        type: 'ORDER_DELIVERED',
        priority: 'HIGH',
      },
      {
        userId: customerUser.id,
        title: 'Price Drop Alert',
        message: 'The Gaming Laptop Pro 15 is now on sale!',
        type: 'PRICE_DROP',
        priority: 'MEDIUM',
      },
    ],
  });

  console.log('✅ Created notifications');

  console.log('\n🎉 Database seed completed successfully!\n');
  console.log('📊 Summary:');
  console.log('  - Users: 2 (1 admin, 1 customer)');
  console.log('  - Categories: 4');
  console.log('  - Products: 4');
  console.log('  - Reviews: 2');
  console.log('  - Orders: 1');
  console.log('  - Cart Items: 2');
  console.log('  - Wishlist Items: 1');
  console.log('  - Notifications: 2');
  console.log('\n🔐 Login Credentials:');
  console.log('  Admin:');
  console.log('    Email: admin@ecommerce.com');
  console.log('    Password: Password123!');
  console.log('  Customer:');
  console.log('    Email: customer@example.com');
  console.log('    Password: Password123!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
