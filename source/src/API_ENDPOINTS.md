# API Endpoints Reference

Base URL: `http://localhost:3000/api`

## Authentication Endpoints

### POST /auth/register
Register a new user
\`\`\`json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "address": "123 Main St"
}
\`\`\`

### POST /auth/login
Login and get JWT token
\`\`\`json
{
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

### POST /auth/forgot-password
Request password reset
\`\`\`json
{
  "email": "user@example.com"
}
\`\`\`

### POST /auth/reset-password
Reset password with token
\`\`\`json
{
  "token": "reset-token-here",
  "newPassword": "newpassword123"
}
\`\`\`

## User Endpoints

### GET /users/profile
Get current user profile (requires JWT)

### PATCH /users/profile
Update current user profile (requires JWT)
\`\`\`json
{
  "firstName": "Jane",
  "phone": "+1987654321"
}
\`\`\`

### GET /users (Admin only)
Get all users

### GET /users/:id (Admin only)
Get user by ID

### DELETE /users/:id (Admin only)
Delete user

## Product Endpoints

### GET /products
Get all products with pagination and filters
Query params:
- page (default: 1)
- limit (default: 10)
- search (product name/description)
- categoryId
- minPrice
- maxPrice
- minRating

Example: `/products?page=1&limit=10&search=laptop&minPrice=500&maxPrice=2000`

### GET /products/:id
Get product by ID

### POST /products (Admin only)
Create new product
\`\`\`json
{
  "name": "Laptop",
  "description": "High performance laptop",
  "price": 999.99,
  "sku": "LAP-001",
  "quantity": 50,
  "categoryId": 1,
  "images": ["url1", "url2"]
}
\`\`\`

### PATCH /products/:id (Admin only)
Update product

### DELETE /products/:id (Admin only)
Delete product

### PATCH /products/:id/inventory (Admin only)
Update product inventory
\`\`\`json
{
  "quantity": 100
}
\`\`\`

## Category Endpoints

### GET /products/categories/all
Get all categories

### GET /products/categories/:id
Get category by ID

### POST /products/categories (Admin only)
Create category
\`\`\`json
{
  "name": "Electronics",
  "description": "Electronic devices"
}
\`\`\`

### PATCH /products/categories/:id (Admin only)
Update category

### DELETE /products/categories/:id (Admin only)
Delete category

## Cart Endpoints

### POST /cart/add
Add item to cart
\`\`\`json
{
  "productId": 1,
  "quantity": 2
}
\`\`\`

### GET /cart/summary
Get cart summary

### PATCH /cart/items/:itemId
Update cart item quantity
\`\`\`json
{
  "quantity": 3
}
\`\`\`

### DELETE /cart/items/:itemId
Remove item from cart

### DELETE /cart/clear
Clear entire cart

## Order Endpoints

### POST /orders
Create new order
\`\`\`json
{
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 2, "quantity": 1 }
  ],
  "shippingAddress": "123 Main St, City, State 12345",
  "billingAddress": "123 Main St, City, State 12345",
  "paymentMethod": "stripe",
  "notes": "Please deliver before 5 PM",
  "shipping": 10.00,
  "tax": 8.50
}
\`\`\`

### GET /orders/my-orders
Get current user's orders

### GET /orders/:id
Get order by ID

### PATCH /orders/:id/cancel
Cancel order

### GET /orders/all (Admin only)
Get all orders with pagination
Query params:
- page (default: 1)
- limit (default: 10)
- status (pending, processing, paid, shipped, delivered, cancelled, returned)

### PATCH /orders/:id/status (Admin only)
Update order status
\`\`\`json
{
  "status": "shipped",
  "trackingNumber": "TRACK123456"
}
\`\`\`

### DELETE /orders/:id (Admin only)
Delete order

### GET /orders/stats/overview (Admin only)
Get order statistics

## Payment Endpoints

### POST /payments/create-payment-intent/:orderId
Create Stripe payment intent for order

### POST /payments/webhook
Stripe webhook endpoint (for Stripe to call)

### GET /payments/status/:orderId
Get payment status for order

### POST /payments/refund/:orderId (Admin only)
Refund payment for order

## Review Endpoints

### POST /reviews/products/:productId
Add review for product
\`\`\`json
{
  "rating": 5,
  "comment": "Great product!"
}
\`\`\`

### GET /reviews/products/:productId
Get all reviews for product

### GET /reviews/my-reviews
Get current user's reviews

### PATCH /reviews/:reviewId
Update review
\`\`\`json
{
  "rating": 4,
  "comment": "Updated review"
}
\`\`\`

### DELETE /reviews/:reviewId
Delete review

## Wishlist Endpoints

### POST /wishlist/:productId
Add product to wishlist

### GET /wishlist
Get user's wishlist

### DELETE /wishlist/:productId
Remove product from wishlist

### GET /wishlist/check/:productId
Check if product is in wishlist

## Notification Endpoints

### GET /notifications
Get user's notifications
Query params:
- unreadOnly (true/false)

### PATCH /notifications/:id/read
Mark notification as read

### PATCH /notifications/read-all
Mark all notifications as read

### DELETE /notifications/:id
Delete notification

## Response Formats

### Success Response
\`\`\`json
{
  "data": { ... },
  "message": "Success"
}
\`\`\`

### Error Response
\`\`\`json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
\`\`\`

### Paginated Response
\`\`\`json
{
  "data": [ ... ],
  "total": 100,
  "page": 1,
  "limit": 10
}
\`\`\`

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

## Rate Limiting

Consider implementing rate limiting in production to prevent abuse.

## CORS

CORS is enabled for all origins in development. Configure appropriately for production.
