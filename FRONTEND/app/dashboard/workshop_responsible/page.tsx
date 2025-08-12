import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Building2, CheckCircle2, Clock, FileText, MessageSquare, User, UserCheck, Users } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

export default function UserDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ana Sayfa</h1>
        <p className="text-muted-foreground">Atölye Sorumlusu Panel Görünümü</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Toplam Bursiyer</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">15 Aktif, 9 Devam etmiyor</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Yoklama Oranı</CardTitle>
            <UserCheck className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">%85</div>
            <Progress value={85} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Eğitmen Sayısı</CardTitle>
            <User className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">3 Aktif, 0 İzinli</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Bekleyen Görevler</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">5 Tamamlanan, 2 Beklemede</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Duyurular</CardTitle>
            <CardDescription>Son duyurular ve bilgilendirmeler</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[280px]">
              <div className="space-y-4">
                <Alert>
                  <MessageSquare className="h-4 w-4" />
                  <AlertTitle>Eğitim Programları Komisyonu</AlertTitle>
                  <AlertDescription>
                    Proje şenliği takım listelerini 20 Mart tarihine kadar sisteme giriniz.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <MessageSquare className="h-4 w-4" />
                  <AlertTitle>Medya ve İletişim Komisyonu</AlertTitle>
                  <AlertDescription>
                    Atölye etkinlik fotoğraflarını sisteme yükleme kılavuzu yayınlandı.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <MessageSquare className="h-4 w-4" />
                  <AlertTitle>Eğitmen Komisyonu</AlertTitle>
                  <AlertDescription>Mart ayı yoklamaları için son tarih 5 Nisan 2025.</AlertDescription>
                </Alert>
                <Alert>
                  <MessageSquare className="h-4 w-4" />
                  <AlertTitle>Takımlar Komisyonu</AlertTitle>
                  <AlertDescription>
                    Ulusal yarışmalar için gönderilecek takım bilgilerini güncelleyin.
                  </AlertDescription>
                </Alert>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Bekleyen Görevler</CardTitle>
            <CardDescription>Tamamlanması gereken görevler</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[280px]">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-100 p-2 rounded">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium">Mart Ayı Bursiyer Yoklamaları</div>
                    <div className="text-sm text-muted-foreground">
                      Mart ayı için bursiyer yoklamalarını tamamlayın.
                    </div>
                    <div className="text-xs text-muted-foreground">Son: 5 Nisan 2025</div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-100 p-2 rounded">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium">Proje Şenliği Takım Oluşturma</div>
                    <div className="text-sm text-muted-foreground">
                      Bahar dönemi proje şenliği için takımları oluşturun.
                    </div>
                    <div className="text-xs text-muted-foreground">Son: 20 Mart 2025</div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-2 rounded">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium">Şubat Ayı Eğitmen Yoklamaları</div>
                    <div className="text-sm text-muted-foreground">Şubat ayı için eğitmen yoklamaları tamamlandı.</div>
                    <div className="text-xs text-muted-foreground">Tamamlandı: 8 Mart 2025</div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-2 rounded">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium">Atölye Malzeme İhtiyaç Formu</div>
                    <div className="text-sm text-muted-foreground">
                      Bahar dönemi için atölye malzeme ihtiyaç listesi tamamlandı.
                    </div>
                    <div className="text-xs text-muted-foreground">Tamamlandı: 15 Şubat 2025</div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Hızlı Erişim</CardTitle>
            <CardDescription>Sık kullanılan işlemlere hızlı erişim</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/dashboard/workshop_responsible/attendance"
                className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <UserCheck className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium text-center">Yoklama Gir</span>
              </Link>
              <Link
                href="/dashboard/workshop_responsible/tasks"
                className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <FileText className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium text-center">Görevlerim</span>
              </Link>
              <Link
                href="/dashboard/workshop_responsible/workshop"
                className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <Building2 className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium text-center">Atölyem</span>
              </Link>
              <Link
                href="/dashboard/workshop_responsible/scholars"
                className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <Users className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium text-center">Bursiyerler</span>
              </Link>
              <Link
                href="/dashboard/workshop_responsible/trainers"
                className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <User className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium text-center">Eğitmenler</span>
              </Link>
              <Link
                href="/dashboard/workshop_responsible/teams"
                className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <Users className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium text-center">Takımlar</span>
              </Link>
              <Link
                href="/dashboard/workshop_responsible/messages"
                className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <MessageSquare className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium text-center">Mesajlar</span>
              </Link>
              <Link
                href="/dashboard/workshop_responsible/announcements"
                className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <Bell className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium text-center">Duyurular</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
