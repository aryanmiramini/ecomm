import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">تماس با ما</h1>
          <p className="text-muted-foreground">سوالات و پیشنهادات خود را با ما در میان بگذارید</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>فرم تماس</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">نام و نام خانوادگی</label>
                      <Input placeholder="نام خود را وارد کنید" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">ایمیل</label>
                      <Input type="email" placeholder="example@email.com" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">شماره تماس</label>
                    <Input placeholder="۰۹۱۲۳۴۵۶۷۸۹" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">موضوع</label>
                    <Input placeholder="موضوع پیام خود را وارد کنید" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">پیام</label>
                    <Textarea placeholder="پیام خود را بنویسید..." className="min-h-32" />
                  </div>

                  <Button type="submit" className="w-full">
                    ارسال پیام
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="flex items-start gap-4 p-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">تلفن تماس</h3>
                  <p className="text-sm text-muted-foreground">۰۲۱-۱۲۳۴۵۶۷۸</p>
                  <p className="text-sm text-muted-foreground">۰۹۱۲۳۴۵۶۷۸۹</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-start gap-4 p-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">ایمیل</h3>
                  <p className="text-sm text-muted-foreground">info@example.com</p>
                  <p className="text-sm text-muted-foreground">support@example.com</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-start gap-4 p-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">آدرس</h3>
                  <p className="text-sm text-muted-foreground">تهران، خیابان ولیعصر، پلاک ۱۲۳، طبقه ۴</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
