import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  // Product Methods
  async createProduct(createProductDto: CreateProductDto): Promise<any> {
    const { categoryId, ...productData } = createProductDto as any;

    const category = await this.prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const existingProduct = await this.prisma.product.findUnique({ where: { sku: createProductDto.sku } });
    if (existingProduct) {
      throw new ConflictException('Product with this SKU already exists');
    }

    return this.prisma.product.create({
      data: {
        ...productData,
        categoryId,
      },
    });
  }

  async findAllProducts(
    page: number = 1,
    limit: number = 10,
    categoryId?: string,
    minPrice?: number,
    maxPrice?: number,
    minRating?: number,
    search?: string,
  ): Promise<{ data: any[]; total: number; page: number; limit: number }> {
    const where: any = { isActive: true };
    if (categoryId) where.categoryId = categoryId;
    if (minRating !== undefined) where.rating = { gte: minRating };
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {
        ...(minPrice !== undefined ? { gte: minPrice } : {}),
        ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
      };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        include: { category: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findProductById(id: string): Promise<any> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true, reviews: true },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<any> {
    if (updateProductDto.categoryId) {
      const category = await this.prisma.category.findUnique({ where: { id: updateProductDto.categoryId } });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    if (updateProductDto.sku) {
      const existingProduct = await this.prisma.product.findUnique({ where: { sku: updateProductDto.sku } });
      if (existingProduct && existingProduct.id !== id) {
        throw new ConflictException('Product with this SKU already exists');
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto as any,
    });
  }

  async removeProduct(id: string): Promise<void> {
    await this.findProductById(id);
    await this.prisma.product.delete({ where: { id } });
  }

  async updateInventory(id: string, quantity: number): Promise<any> {
    await this.findProductById(id);
    return this.prisma.product.update({ where: { id }, data: { quantity } });
  }

  async updateRating(productId: string): Promise<void> {
    const reviews = await this.prisma.review.findMany({ where: { productId } });
    if (reviews.length > 0) {
      const total = reviews.reduce((sum, r) => sum + r.rating, 0);
      await this.prisma.product.update({
        where: { id: productId },
        data: { rating: total / reviews.length, reviewCount: reviews.length },
      });
    }
  }

  // Category Methods
  async createCategory(createCategoryDto: CreateCategoryDto): Promise<any> {
    const existingCategory = await this.prisma.category.findUnique({ where: { name: createCategoryDto.name } });
    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }

    const data: any = { ...createCategoryDto };
    if (data.parentId) {
      const parent = await this.prisma.category.findUnique({ where: { id: data.parentId } });
      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }
    } else {
      data.parentId = null;
    }

    return this.prisma.category.create({ data });
  }

  async findAllCategories(): Promise<any[]> {
    return this.prisma.category.findMany({ include: { products: true }, orderBy: { createdAt: 'desc' } });
  }

  async findCategoryById(id: string): Promise<any> {
    const category = await this.prisma.category.findUnique({ where: { id }, include: { products: true } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto): Promise<any> {
    const category = await this.findCategoryById(id);
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.prisma.category.findUnique({ where: { name: updateCategoryDto.name } });
      if (existingCategory) {
        throw new ConflictException('Category with this name already exists');
      }
    }

    const data: any = { ...updateCategoryDto };
    if (Object.prototype.hasOwnProperty.call(data, 'parentId')) {
      if (data.parentId) {
        const parent = await this.prisma.category.findUnique({ where: { id: data.parentId } });
        if (!parent) {
          throw new NotFoundException('Parent category not found');
        }
      } else {
        data.parentId = null;
      }
    }

    return this.prisma.category.update({ where: { id }, data });
  }

  async removeCategory(id: string): Promise<void> {
    await this.findCategoryById(id);
    await this.prisma.category.delete({ where: { id } });
  }
}
