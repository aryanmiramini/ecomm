import { 
  Controller, 
  Post, 
  Get, 
  Patch, 
  Delete, 
  Param, 
  Body, 
  Request,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('products/:productId')
  addReview(
    @Request() req,
    @Param('productId') productId: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.addReview(req.user.id, productId, createReviewDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':reviewId')
  updateReview(
    @Request() req,
    @Param('reviewId') reviewId: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.updateReview(req.user.id, reviewId, updateReviewDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':reviewId')
  deleteReview(@Request() req, @Param('reviewId') reviewId: string) {
    return this.reviewsService.deleteReview(req.user.id, reviewId);
  }

  @Get('products/:productId')
  getProductReviews(@Param('productId') productId: string) {
    return this.reviewsService.getProductReviews(productId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-reviews')
  getUserReviews(@Request() req) {
    return this.reviewsService.getUserReviews(req.user.id);
  }
}
