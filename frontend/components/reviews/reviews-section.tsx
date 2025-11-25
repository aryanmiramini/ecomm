"use client"

import { useEffect, useState } from "react"
import { Star, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/components/auth/auth-provider"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function ReviewsSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { isAuthenticated, user } = useAuth()
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadReviews()
  }, [productId])

  const loadReviews = async () => {
    try {
      const res = await apiClient.getProductReviews(productId)
      setReviews(res.reviews)
    } catch (error) {
      console.error("Error loading reviews", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error("برای ثبت نظر ابتدا وارد شوید")
      return
    }
    if (!newReview.comment.trim()) {
      toast.error("لطفاً متن نظر را وارد کنید")
      return
    }

    setSubmitting(true)
    try {
      await apiClient.addReview(productId, newReview)
      toast.success("نظر شما با موفقیت ثبت شد")
      setNewReview({ rating: 5, comment: "" })
      loadReviews()
    } catch (error: any) {
      toast.error(error.message || "خطا در ثبت نظر")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (reviewId: string) => {
    if (!confirm("آیا از حذف این نظر اطمینان دارید؟")) return
    try {
      await apiClient.deleteReview(reviewId)
      setReviews(reviews.filter(r => r.id !== reviewId))
      toast.success("نظر حذف شد")
    } catch (error: any) {
      toast.error(error.message || "خطا در حذف نظر")
    }
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">نظرات کاربران ({reviews.length})</h2>

      {/* Add Review Form */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold">دیدگاه خود را ثبت کنید</h3>
        {!isAuthenticated ? (
          <div className="text-center py-4 text-muted-foreground">
            برای ثبت نظر، لطفاً <Button variant="link" className="px-1" asChild><a href="/login">وارد حساب کاربری شوید</a></Button>.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">امتیاز شما:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={cn(
                        "h-6 w-6 transition-colors",
                        star <= newReview.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
            <Textarea
              placeholder="نظر خود را بنویسید..."
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              className="min-h-[100px]"
            />
            <Button type="submit" disabled={submitting}>
              {submitting ? "در حال ثبت..." : "ثبت نظر"}
            </Button>
          </form>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-center text-muted-foreground">هنوز نظری برای این محصول ثبت نشده است.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{review.user?.firstName || "کاربر"} {review.user?.lastName}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-3 w-3",
                            i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
                          )}
                        />
                      ))}
                      <span className="mr-2 text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString("fa-IR")}
                      </span>
                    </div>
                  </div>
                </div>
                {user?.id === review.userId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(review.id)}
                  >
                    حذف
                  </Button>
                )}
              </div>
              <p className="text-muted-foreground">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

