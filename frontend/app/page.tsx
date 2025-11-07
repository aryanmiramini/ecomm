import Hero from "@/components/home/hero"
import FeaturedProducts from "@/components/home/featured-products"
import Categories from "@/components/home/categories"
import Testimonials from "@/components/home/testimonials"

export default function Home() {
  return (
    <div>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Testimonials />
    </div>
  )
}
