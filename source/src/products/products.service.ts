import { Injectable } from '@nestjs/common';
import { BusinessException, NotFoundException, DuplicateException } from '../common/exceptions/business.exception';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  // Product Methods
  async createProduct(createProductDto: CreateProductDto) {
    try {
      const { categoryId, ...productData } = createProductDto as any;

      // Validate category exists
      const category = await this.prisma.category.findUnique({ 
        where: { id: categoryId } 
      });
      
      if (!category) {
        throw new NotFoundException('CATEGORY');
      }

      // Check for duplicate SKU
      if (createProductDto.sku) {
        const existingProduct = await this.prisma.product.findUnique({ 
          where: { sku: createProductDto.sku } 
        });
        
        if (existingProduct) {
          throw new DuplicateException('PRODUCT_SKU');
        }
      }

      // Create product
      const product = await this.prisma.product.create({
        data: {
          ...productData,
          categoryId,
          rating: 0,
          reviewCount: 0,
        },
        include: {
          category: true,
        },
      });

      return product;
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new DuplicateException('PRODUCT_SKU');
        }
      }
      throw new BusinessException('DATABASE_ERROR');
    }
  }

  async findAllProducts(
    page?: number,
    limit?: number,
    categoryId?: string,
    minPrice?: number,
    maxPrice?: number,
    minRating?: number,
    search?: string,
    sort?: string,
  ) {
    try {
      const pageNum = Math.max(1, Number(page) || 1);
      const limitNum = Math.min(100, Math.max(1, Number(limit) || 10));
      const skip = (pageNum - 1) * limitNum;

      const where: Prisma.ProductWhereInput = { 
        isActive: true 
      };

      if (categoryId) {
        where.categoryId = categoryId;
      }

      if (minRating !== undefined) {
        where.rating = { gte: Number(minRating) };
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined) {
          where.price.gte = Number(minPrice);
        }
        if (maxPrice !== undefined) {
          where.price.lte = Number(maxPrice);
        }
      }

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
        ];
      }

      const orderBy = this.resolveProductSort(sort);

      const [data, total] = await this.prisma.$transaction([
        this.prisma.product.findMany({
          where,
          include: { 
            category: true,
            _count: {
              select: { reviews: true }
            }
          },
          skip,
          take: limitNum,
          orderBy,
        }),
        this.prisma.product.count({ where }),
      ]);

      return { 
        data, 
        total, 
        page: pageNum, 
        limit: limitNum 
      };
    } catch (error) {
      throw new BusinessException('DATABASE_ERROR');
    }
  }

  private resolveProductSort(sort?: string): Prisma.ProductOrderByWithRelationInput {
    switch ((sort || '').toLowerCase()) {
      case 'price-asc':
        return { price: 'asc' };
      case 'price-desc':
        return { price: 'desc' };
      case 'popular':
        return { rating: 'desc' };
      case 'oldest':
        return { createdAt: 'asc' };
      case 'newest':
      default:
        return { createdAt: 'desc' };
    }
  }

  async findProductById(id: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
        include: { 
          category: true,
          reviews: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                }
              }
            },
            orderBy: { createdAt: 'desc' }
          }
        },
      });

      if (!product) {
        throw new NotFoundException('PRODUCT');
      }

      return product;
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error;
      }
      throw new BusinessException('DATABASE_ERROR');
    }
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    try {
      // Check product exists
      const existingProduct = await this.prisma.product.findUnique({ 
        where: { id } 
      });
      
      if (!existingProduct) {
        throw new NotFoundException('PRODUCT');
      }

      // Validate category if provided
      if (updateProductDto.categoryId) {
        const category = await this.prisma.category.findUnique({ 
          where: { id: updateProductDto.categoryId } 
        });
        
        if (!category) {
          throw new NotFoundException('CATEGORY');
        }
      }

      // Check for duplicate SKU if updating
      if (updateProductDto.sku && updateProductDto.sku !== existingProduct.sku) {
        const duplicateSku = await this.prisma.product.findUnique({ 
          where: { sku: updateProductDto.sku } 
        });
        
        if (duplicateSku) {
          throw new DuplicateException('PRODUCT_SKU');
        }
      }

      const product = await this.prisma.product.update({
        where: { id },
        data: updateProductDto as any,
        include: { category: true },
      });

      return product;
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new DuplicateException('PRODUCT_SKU');
        }
      }
      throw new BusinessException('DATABASE_ERROR');
    }
  }

  async removeProduct(id: string) {
    try {
      // Check product exists
      const product = await this.prisma.product.findUnique({ 
        where: { id } 
      });
      
      if (!product) {
        throw new NotFoundException('PRODUCT');
      }

      // Check if product is in any active orders
      const activeOrders = await this.prisma.orderItem.findFirst({
        where: {
          productId: id,
          order: {
            status: {
              in: ['PENDING', 'PROCESSING', 'SHIPPED']
            }
          }
        }
      });

      if (activeOrders) {
        throw new BusinessException('ORDER_CANNOT_BE_CANCELLED');
      }

      await this.prisma.product.delete({ where: { id } });
      
      return { deleted: true };
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error;
      }
      throw new BusinessException('DATABASE_ERROR');
    }
  }

  async updateInventory(id: string, quantity: number) {
    try {
      const product = await this.prisma.product.findUnique({ 
        where: { id } 
      });
      
      if (!product) {
        throw new NotFoundException('PRODUCT');
      }

      if (quantity < 0) {
        throw new BusinessException('INVALID_QUANTITY');
      }

      const updated = await this.prisma.product.update({ 
        where: { id }, 
        data: { quantity },
        include: { category: true },
      });

      return updated;
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error;
      }
      throw new BusinessException('DATABASE_ERROR');
    }
  }

  async updateRating(productId: string) {
    try {
      const reviews = await this.prisma.review.findMany({ 
        where: { productId } 
      });
      
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = totalRating / reviews.length;
        
        await this.prisma.product.update({
          where: { id: productId },
          data: { 
            rating: avgRating, 
            reviewCount: reviews.length 
          },
        });
      } else {
        await this.prisma.product.update({
          where: { id: productId },
          data: { 
            rating: 0, 
            reviewCount: 0 
          },
        });
      }
    } catch (error) {
      // Silent fail for rating updates
      console.error('Failed to update product rating:', error);
    }
  }

  // Category Methods
  async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      // Check for duplicate name
      const existingCategory = await this.prisma.category.findUnique({ 
        where: { name: createCategoryDto.name } 
      });
      
      if (existingCategory) {
        throw new DuplicateException('CATEGORY_NAME');
      }

      const category = await this.prisma.category.create({
        data: createCategoryDto,
      });

      return category;
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new DuplicateException('CATEGORY_NAME');
        }
      }
      throw new BusinessException('DATABASE_ERROR');
    }
  }

  async findAllCategories() {
    try {
      const categories = await this.prisma.category.findMany({
        include: {
          _count: {
            select: { products: true }
          },
          products: {
            where: { isActive: true },
            take: 5,
            orderBy: { createdAt: 'desc' }
          }
        },
        orderBy: { name: 'asc' },
      });

      return categories;
    } catch (error) {
      throw new BusinessException('DATABASE_ERROR');
    }
  }

  async findCategoryById(id: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
        include: {
          products: {
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
          },
          _count: {
            select: { products: true }
          }
        },
      });

      if (!category) {
        throw new NotFoundException('CATEGORY');
      }

      return category;
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error;
      }
      throw new BusinessException('DATABASE_ERROR');
    }
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      // Check category exists
      const existingCategory = await this.prisma.category.findUnique({ 
        where: { id } 
      });
      
      if (!existingCategory) {
        throw new NotFoundException('CATEGORY');
      }

      // Check for duplicate name if updating
      if (updateCategoryDto.name && updateCategoryDto.name !== existingCategory.name) {
        const duplicateName = await this.prisma.category.findUnique({ 
          where: { name: updateCategoryDto.name } 
        });
        
        if (duplicateName) {
          throw new DuplicateException('CATEGORY_NAME');
        }
      }

      const category = await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
        include: {
          _count: {
            select: { products: true }
          }
        }
      });

      return category;
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new DuplicateException('CATEGORY_NAME');
        }
      }
      throw new BusinessException('DATABASE_ERROR');
    }
  }

  async removeCategory(id: string) {
    try {
      // Check category exists
      const category = await this.prisma.category.findUnique({ 
        where: { id },
        include: {
          _count: {
            select: { products: true }
          }
        }
      });
      
      if (!category) {
        throw new NotFoundException('CATEGORY');
      }

      // Check if category has products
      if (category._count.products > 0) {
        throw new BusinessException('VALIDATION_ERROR');
      }

      await this.prisma.category.delete({ where: { id } });
      
      return { deleted: true };
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error;
      }
      throw new BusinessException('DATABASE_ERROR');
    }
  }
}