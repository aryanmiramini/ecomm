# Frontend API Endpoints Mapping

This document maps all frontend pages and components to their corresponding backend API endpoints.

## Customer Pages

### Home Page (`/`)
- **GET** `/api/products` → Backend: `GET /api/products`
- **GET** `/api/categories` → Backend: `GET /api/categories`
- **Status**: ✅ Connected

### Products Page (`/products`)
- **GET** `/api/products` → Backend: `GET /api/products`
- **Status**: ✅ Connected

### Categories Page (`/categories`)
- **GET** `/api/categories` → Backend: `GET /api/categories`
- **Status**: ✅ Connected

### Login Page (`/login`)
- **POST** `/api/auth/login` → Backend: `POST /api/auth/login`
- **Status**: ✅ Connected
- **Features**: 
  - Stores JWT token in httpOnly cookie
  - Redirects based on user role (ADMIN → /admin, CUSTOMER → /)

### Register Page (`/register`)
- **POST** `/api/auth/register` → Backend: `POST /api/auth/register`
- **Status**: ✅ Connected
- **Features**: Form validation, password confirmation

### About Page (`/about`)
- **Status**: ✅ Static page (no API calls)

### Contact Page (`/contact`)
- **Status**: ✅ Static page (no API calls)

## Admin Pages

### Admin Dashboard (`/admin`)
- **GET** `/api/admin/dashboard` → Backend:
  - `GET /api/orders/stats/overview` (order stats)
  - `GET /api/products?limit=100&page=1` (products count & featured)
  - `GET /api/orders/all?limit=5&page=1` (recent orders)
  - `GET /api/users` (customer count)
- **Status**: ✅ Connected

### Admin Products (`/admin/products`)
- **GET** `/api/products` → Backend: `GET /api/products`
- **DELETE** `/api/products/:id` → Backend: `DELETE /api/products/:id`
- **Status**: ✅ Connected (full CRUD via admin UI)

### Admin Orders (`/admin/orders`)
- **GET** `/api/orders` → Backend: `GET /api/orders/all`
- **PATCH** `/api/orders/:id` → Backend: `PATCH /api/orders/:id/status`
- **Status**: ✅ Connected

### Admin Categories (`/admin/categories`)
- **GET** `/api/categories` → Backend: `GET /api/categories`
- **POST** `/api/categories` → Backend: `POST /api/categories` (requires auth)
- **PATCH** `/api/categories/:id` → Backend: `PATCH /api/categories/:id` (requires auth)
- **DELETE** `/api/categories/:id` → Backend: `DELETE /api/categories/:id` (requires auth)
- **Status**: ✅ Connected (full CRUD via admin UI)

### Admin Users (`/admin/users`)
- **GET** `/api/users` → Backend: `GET /api/users` (Admin only)
- **DELETE** `/api/users/:id` → Backend: `DELETE /api/users/:id` (Admin only)
- **Status**: ✅ Connected

### Admin Settings (`/admin/settings`)
- **Status**: ✅ Profile update via `/api/users/profile`

## User Profile Pages

### Profile (`/profile`)
- **GET** `/api/users/profile` → Backend: `GET /api/users/profile`
- **PATCH** `/api/users/profile` → Backend: `PATCH /api/users/profile`
- **Status**: ✅ Connected

### My Orders (`/profile/orders`)
- **GET** `/api/orders/my-orders` → Backend: `GET /api/orders/my-orders`
- **Status**: ✅ Connected

### Wishlist (`/wishlist`)
- **GET** `/api/wishlist` → Backend: `GET /api/wishlist`
- **POST** `/api/wishlist/:productId` → Backend: `POST /api/wishlist/:productId`
- **DELETE** `/api/wishlist/:productId` → Backend: `DELETE /api/wishlist/:productId`
- **Status**: ✅ Connected

## Product Features

### Reviews
- **GET** `/api/reviews/products/:productId` → Backend: `GET /api/reviews/products/:productId`
- **POST** `/api/reviews/products/:productId` → Backend: `POST /api/reviews/products/:productId`
- **DELETE** `/api/reviews/:reviewId` → Backend: `DELETE /api/reviews/:reviewId`
- **Status**: ✅ Connected

### Notifications
- **GET** `/api/notifications` → Backend: `GET /api/notifications`
- **PATCH** `/api/notifications/:id/read` → Backend: `PATCH /api/notifications/:id/read`
- **Status**: ✅ Connected

## API Routes (Next.js Server Routes)

### Products API
- **GET** `/api/products` → Backend: `GET /api/products`
- **POST** `/api/products` → Backend: `POST /api/products` (requires auth)
- **GET** `/api/products/:id` → Backend: `GET /api/products/:id`
- **PATCH** `/api/products/:id` → Backend: `PATCH /api/products/:id` (requires auth)
- **DELETE** `/api/products/:id` → Backend: `DELETE /api/products/:id` (requires auth)

### Categories API
- **GET** `/api/categories` → Backend: `GET /api/categories`
- **POST** `/api/categories` → Backend: `POST /api/categories` (requires auth)

### Orders API
- **GET** `/api/orders` → Backend: `GET /api/orders/all` (requires auth)
- **POST** `/api/orders` → Backend: `POST /api/orders` (requires auth)
- **GET** `/api/orders/:id` → Backend: `GET /api/orders/:id` (requires auth)
- **PATCH** `/api/orders/:id` → Backend: `PATCH /api/orders/:id/status` (requires auth)

### Auth API
- **POST** `/api/auth/login` → Backend: `POST /api/auth/login`
- **POST** `/api/auth/register` → Backend: `POST /api/auth/register`

### Admin API
- **GET** `/api/admin/dashboard` → Backend: Multiple endpoints aggregated (requires auth)

## Authentication Flow

1. User logs in via `/api/auth/login`
2. Backend returns JWT token in response
3. Next.js API route sets httpOnly cookie with token
4. All subsequent API calls include token via cookie
5. Server-side `backendFetch` reads cookie and adds `Authorization: Bearer <token>` header

## Error Handling

All API routes use consistent error handling:
- Catches `BackendRequestError` and returns appropriate status codes
- Returns Persian error messages
- Logs errors for debugging

## Data Mapping

All backend responses are mapped to frontend types via:
- `mapProduct()` - Maps backend product to frontend Product type
- `mapCategory()` - Maps backend category to frontend Category type
- `mapOrder()` - Maps backend order to frontend Order type

## Notes

- All API calls go through Next.js API routes (server-side)
- Authentication handled via httpOnly cookies
- CORS configured for Docker networking
- Environment variables:
  - `BACKEND_API_URL` - Server-side backend URL
  - `NEXT_PUBLIC_API_URL` - Public backend URL (fallback)

