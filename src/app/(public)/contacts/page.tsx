import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ContactsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Контакты</h1>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Свяжитесь со мной</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <span>Email: example@email.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <span>Телефон: +7 (XXX) XXX-XX-XX</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Занятия проводятся онлайн</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Напишите мне</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="name">Ваше имя</Label>
                  <Input id="name" placeholder="Имя" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="email@example.com" />
                </div>
                <div>
                  <Label htmlFor="message">Сообщение</Label>
                  <Textarea id="message" placeholder="Ваше сообщение" rows={5} />
                </div>
                <Button type="submit" className="w-full">Отправить</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

