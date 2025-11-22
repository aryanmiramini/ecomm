# فروشگاه آنلاین - Persian E-commerce Platform

A complete Next.js e-commerce platform with RTL (Right-to-Left) Persian language support, featuring a beautiful purple color palette and modern UI design.

## Features

### 🎨 Design
- **RTL Support**: Full Persian language support with right-to-left layout
- **Beautiful Color Palette**: Custom purple/magenta theme based on provided RGB values
- **Responsive Design**: Mobile-first approach with seamless desktop experience
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS v4

### 🛍️ Customer Features
- **Home Page**: Featured products, categories showcase, and promotional sections
- **Product Catalog**: Browse all products with filtering and sorting
- **Category Pages**: Organized product categories
- **Product Details**: (Ready for implementation)
- **Shopping Cart**: (Ready for implementation)
- **User Authentication**: Login and registration pages

### 👨‍💼 Admin Dashboard
- **Dashboard Overview**: Real-time statistics and analytics
- **Product Management**: Create, read, update, and delete products
- **Order Management**: Track and update order statuses
- **Category Management**: Manage product categories
- **User Management**: (Ready for implementation)

### 🔧 Technical Stack
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Font**: Vazirmatn (Persian font)
- **API**: RESTful API routes with mock data

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PATCH /api/orders/:id` - Update order status

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics

## Color Palette

Based on the provided RGB values:

- Primary Dark: `rgb(65, 21, 39)` - #411527
- Primary Medium: `rgb(105, 34, 71)` - #692247
- Accent Magenta: `rgb(133, 30, 90)` - #851E5A (Primary)
- Accent Bright: `rgb(159, 31, 92)` - #9F1F5C
- Neutral Purple: `rgb(97, 74, 104)` - #614A68
- Neutral Purple Light: `rgb(122, 71, 105)` - #7A4769
- Neutral Purple Lighter: `rgb(79, 61, 91)` - #4F3D5B

## Getting Started

### Access the Application

**Customer Pages:**
- Home: `/`
- Products: `/products`
- Categories: `/categories`
- About: `/about`
- Contact: `/contact`
- Login: `/login`
- Register: `/register`

**Admin Dashboard:**
- Dashboard: `/admin`
- Products: `/admin/products`
- Orders: `/admin/orders`
- Categories: `/admin/categories`

### Development Notes

The current implementation uses mock data stored in `lib/mock-data.ts`. For production:

1. **Replace Mock Data**: Connect to a real database (PostgreSQL, MongoDB, etc.)
2. **Add Authentication**: Implement proper JWT or session-based authentication
3. **Add Payment Gateway**: Integrate with payment providers (Stripe, etc.)
4. **Implement Search**: Add full-text search functionality
5. **Add Image Upload**: Implement image upload for products
6. **Email Notifications**: Add order confirmation emails

## Project Structure

\`\`\`
├── app/
│   ├── (customer)/          # Customer-facing pages
│   │   ├── page.tsx         # Home page
│   │   ├── products/        # Products pages
│   │   ├── categories/      # Categories pages
│   │   ├── login/           # Login page
│   │   └── register/        # Register page
│   ├── admin/               # Admin dashboard
│   │   ├── page.tsx         # Dashboard
│   │   ├── products/        # Product management
│   │   ├── orders/          # Order management
│   │   └── categories/      # Category management
│   └── api/                 # API routes
│       ├── products/
│       ├── categories/
│       ├── orders/
│       └── admin/
├── components/
│   ├── admin/               # Admin components
│   └── customer/            # Customer components
├── lib/
│   ├── types.ts             # TypeScript types
│   ├── api-client.ts        # API client
│   └── mock-data.ts         # Mock data
└── ...
\`\`\`

## RTL Support

The application fully supports RTL (Right-to-Left) layout for Persian language:

- HTML `dir="rtl"` attribute
- Vazirmatn font for proper Persian text rendering
- Mirrored icons and components where appropriate
- Persian date formatting
- All text content in Persian

## License

MIT License - Feel free to use this project for your own purposes.

## Support

For questions or issues, please contact the development team.

---

**Made with ❤️ for Persian e-commerce**
