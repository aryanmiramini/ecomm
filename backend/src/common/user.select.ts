import { Prisma } from '@prisma/client';

export const SAFE_USER_SELECT = {
  id: true,
  email: true,
  phone: true,
  firstName: true,
  lastName: true,
  avatar: true,
  role: true,
  isActive: true,
  city: true,
  state: true,
  postalCode: true,
  country: true,
  shippingAddress: true,
  billingAddress: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export const PUBLIC_REVIEWER_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  avatar: true,
} satisfies Prisma.UserSelect;
