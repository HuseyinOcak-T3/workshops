"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Building2, Calendar, CheckSquare, FileText, Map, MessageSquare, User, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { useState } from "react"

// Fake Turkey map component
function TurkeyMap() {
  const cities = [
    { id: 1, name: "İstanbul", x: 160, y: 80, count: 4 },
    { id: 2, name: "Ankara", x: 240, y: 130, count: 3 },
    { id: 3, name: "İzmir", x: 110, y: 170, count: 2 },
    { id: 4, name: "Antalya", x: 180, y: 220, count: 2 },
    { id: 5, name: "Bursa", x: 140, y: 110, count: 2 },
    { id: 6, name: "Konya", x: 220, y: 180, count: 1 },
    { id: 7, name: "Adana", x: 290, y: 200, count: 2 },
    { id: 8, name: "Trabzon", x: 380, y: 100, count: 1 },
    { id: 9, name: "Diyarbakır", x: 380, y: 180, count: 1 },
    { id: 10, name: "Erzurum", x: 420, y: 130, count: 1 },
  ]

  const [selectedCity, setSelectedCity] = useState<number | null>(null)

  return (
    <div className="relative w-full h-[400px] bg-gray-100 border rounded-lg overflow-hidden">
      <svg width="100%" height="100%" viewBox="0 0 520 300">
        {/* Simplified Turkey map outline */}
        <path
          d="M50,150 C100,100 200,50 300,60 C400,70 450,120 480,150 C450,200 400,230 300,240 C200,230 100,200 50,150Z"
          fill="#f1f5f9"
          stroke="#cbd5e1"
          strokeWidth="2"
        />

        {/* Workshop dots */}
        {cities.map((city) => (
          <g key={city.id} onClick={() => setSelectedCity(city.id)}>
            <circle
              cx={city.x}
              cy={city.y}
              r={city.count * 5 + 5}
              fill={selectedCity === city.id ? "rgba(99, 102, 241, 0.5)" : "rgba(99, 102, 241, 0.2)"}
              stroke={selectedCity === city.id ? "rgb(99, 102, 241)" : "rgba(99, 102, 241, 0.5)"}
              strokeWidth="2"
              style={{ cursor: "pointer" }}
            />
            <text
              x={city.x}
              y={city.y + 3}
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill={selectedCity === city.id ? "rgb(99, 102, 241)" : "#64748b"}
              style={{ cursor: "pointer" }}
            >
              {city.count}
            </text>
            <text
              x={city.x}
              y={city.y + 20}
              textAnchor="middle"
              fontSize="8"
              fill="#475569"
              style={{ cursor: "pointer" }}
            >
              {city.name}
            </text>
          </g>
        ))}
      </svg>

      {selectedCity && (
        <div className="absolute bottom-0 left-0 right-0 bg-white p-3 border-t">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{cities.find((c) => c.id === selectedCity)?.name}</p>
              <p className="text-sm text-muted-foreground">{cities.find((c) => c.id === selectedCity)?.count} Atölye</p>
            </div>
            <Button size="sm" asChild>
              <Link href={`/dashboard/superadmin/workshops?city=${selectedCity}`}>Detayları Gör</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function SuperuserDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ana Sayfa</h1>
          <p className="text-muted-foreground">Yönetici Panel Görünümü</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/superuser/reports">
              <FileText className="mr-2 h-4 w-4" />
              Raporlar
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/superuser/workshops">
              <Users className="mr-2 h-4 w-4" />
              Tüm Atölyeler
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Toplam Atölye</CardTitle>
            <Building2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">15 İl, 20 İlçe</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Toplam Bursiyer</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">758</div>
            <p className="text-xs text-muted-foreground">612 Aktif, 146 Devam etmiyor</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Eğitmenler</CardTitle>
            <User className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87</div>
            <p className="text-xs text-muted-foreground">81 Aktif, 6 Pasif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Görev Oranı</CardTitle>
            <CheckSquare className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">%78</div>
            <Progress value={78} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Türkiye Geneli Atölyeler</CardTitle>
            <CardDescription>Türkiye genelindeki atölyelerin dağılımı</CardDescription>
          </CardHeader>
          <CardContent>
            <TurkeyMap />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kritik Bildirimler</CardTitle>
            <CardDescription>Dikkat gerektiren konular</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Bursa - Nilüfer Atölyesi</AlertTitle>
                  <AlertDescription>Malzeme eksiklikleri 3 haftadır giderilmedi</AlertDescription>
                </Alert>

                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>İzmir - Bornova Atölyesi</AlertTitle>
                  <AlertDescription>Görev tamamlama oranı %60'ın altında</AlertDescription>
                </Alert>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Ankara - Çankaya Atölyesi</AlertTitle>
                  <AlertDescription>Proje şenliği takım listeleri tamamlanmadı</AlertDescription>
                </Alert>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>İstanbul - Pendik Atölyesi</AlertTitle>
                  <AlertDescription>Eğitmen değişikliği onay bekliyor</AlertDescription>
                </Alert>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Antalya - Muratpaşa Atölyesi</AlertTitle>
                  <AlertDescription>Eğitim mekanı değişikliği onay bekliyor</AlertDescription>
                </Alert>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="stats">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="stats">İstatistikler</TabsTrigger>
          <TabsTrigger value="announcements">Duyurular</TabsTrigger>
          <TabsTrigger value="tasks">Görevler</TabsTrigger>
          <TabsTrigger value="calendar">Takvim</TabsTrigger>
        </TabsList>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Genel İstatistikler</CardTitle>
              <CardDescription>Tüm atölyelerin performans istatistikleri</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Bursiyer Devamlılık Oranı</span>
                      <span className="font-medium">%82</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Eğitmen Devamlılık Oranı</span>
                      <span className="font-medium">%95</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Görev Tamamlama Oranı</span>
                      <span className="font-medium">%78</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Atölye Malzeme Doluluk Oranı</span>
                      <span className="font-medium">%86</span>
                    </div>
                    <Progress value={86} className="h-2" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Proje Şenliği Katılım Oranı</span>
                      <span className="font-medium">%75</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Yarışma Katılım Oranı</span>
                      <span className="font-medium">%42</span>
                    </div>
                    <Progress value={42} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Duyuru Okunma Oranı</span>
                      <span className="font-medium">%68</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Form/Anket Doldurma Oranı</span>
                      <span className="font-medium">%71</span>
                    </div>
                    <Progress value={71} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements">
          <Card>
            <CardHeader>
              <CardTitle>Tüm Duyurular</CardTitle>
              <CardDescription>Komisyonlar tarafından yapılan son duyurular</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Eğitim Programları Komisyonu</div>
                      <div className="text-xs text-muted-foreground">15.03.2025</div>
                    </div>
                    <p className="font-medium mt-1">Proje Şenliği Tarihleri</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Bahar dönemi proje şenliği 15-20 Mayıs 2025 tarihleri arasında gerçekleştirilecektir. Tüm
                      atölyelerin bu tarihlere göre hazırlıklarını tamamlamaları gerekmektedir.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Medya ve İletişim Komisyonu</div>
                      <div className="text-xs text-muted-foreground">12.03.2025</div>
                    </div>
                    <p className="font-medium mt-1">Özel İçerik Çalışması Kılavuzu</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      "Özel İçerik Çalışması" için çekim yönergeleri ve teslim detayları panele yüklenmiştir. Son
                      yükleme tarihi 30 Mart 2025'tir.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Eğitmen Komisyonu</div>
                      <div className="text-xs text-muted-foreground">08.03.2025</div>
                    </div>
                    <p className="font-medium mt-1">Yoklama Girişleri Hakkında</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Mart ayı yoklama girişleri için son tarih 5 Nisan 2025'tir. Tüm atölye sorumlularının bu tarihe
                      kadar hem bursiyer hem de eğitmen yoklamalarını tamamlamaları gerekmektedir.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Takımlar Komisyonu</div>
                      <div className="text-xs text-muted-foreground">02.03.2025</div>
                    </div>
                    <p className="font-medium mt-1">Ulusal Yarışma Kayıtları</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      TEKNOFEST 2025 katılımcı takım başvuruları 1 Nisan 2025 tarihine kadar devam edecektir. Tüm
                      atölyelerin yarışma takımlarını belirleyip sisteme giriş yapmaları gerekmektedir.
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Görev Durumları</CardTitle>
              <CardDescription>Tüm atölyelere atanan görevler ve tamamlanma durumları</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Mart Ayı Yoklama Girişleri</div>
                      <div className="text-yellow-500 text-sm font-medium">Devam Ediyor</div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-sm text-muted-foreground">Son tarih: 05.04.2025</div>
                      <div className="text-sm">18/28 Atölye</div>
                    </div>
                    <Progress value={64} className="h-2 mt-2" />
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Proje Şenliği Takım Listeleri</div>
                      <div className="text-yellow-500 text-sm font-medium">Devam Ediyor</div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-sm text-muted-foreground">Son tarih: 20.03.2025</div>
                      <div className="text-sm">12/28 Atölye</div>
                    </div>
                    <Progress value={43} className="h-2 mt-2" />
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Ulusal Yarışma Takım Kayıtları</div>
                      <div className="text-yellow-500 text-sm font-medium">Devam Ediyor</div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-sm text-muted-foreground">Son tarih: 01.04.2025</div>
                      <div className="text-sm">9/28 Atölye</div>
                    </div>
                    <Progress value={32} className="h-2 mt-2" />
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Şubat Ayı Raporları</div>
                      <div className="text-green-500 text-sm font-medium">Tamamlandı</div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-sm text-muted-foreground">Tamamlandı: 10.03.2025</div>
                      <div className="text-sm">28/28 Atölye</div>
                    </div>
                    <Progress value={100} className="h-2 mt-2" />
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Eğitmen Değerlendirme Anketleri</div>
                      <div className="text-green-500 text-sm font-medium">Tamamlandı</div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-sm text-muted-foreground">Tamamlandı: 05.03.2025</div>
                      <div className="text-sm">25/28 Atölye</div>
                    </div>
                    <Progress value={89} className="h-2 mt-2" />
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>DENEYAP Takvimi</CardTitle>
              <CardDescription>Yaklaşan etkinlikler ve son tarihler</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-lg text-center min-w-16">
                    <div className="font-bold text-primary">20</div>
                    <div className="text-xs text-muted-foreground">MAR</div>
                  </div>
                  <div>
                    <div className="font-medium">Proje Şenliği Takım Listelerinin Son Teslim Tarihi</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Tüm atölyelerin proje şenliği takım listelerini tamamlamaları gereken son tarih.
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-lg text-center min-w-16">
                    <div className="font-bold text-primary">30</div>
                    <div className="text-xs text-muted-foreground">MAR</div>
                  </div>
                  <div>
                    <div className="font-medium">Özel İçerik Çalışması Son Teslim Tarihi</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Medya ve İletişim Komisyonu için hazırlanan özel içeriklerin teslim tarihi.
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-lg text-center min-w-16">
                    <div className="font-bold text-primary">1</div>
                    <div className="text-xs text-muted-foreground">NİS</div>
                  </div>
                  <div>
                    <div className="font-medium">TEKNOFEST 2025 Katılımcı Takım Son Başvuru Tarihi</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Ulusal yarışmalar için takım kayıtlarının son tarihi.
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-lg text-center min-w-16">
                    <div className="font-bold text-primary">5</div>
                    <div className="text-xs text-muted-foreground">NİS</div>
                  </div>
                  <div>
                    <div className="font-medium">Mart Ayı Yoklama Girişleri Son Tarihi</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Bursiyer ve eğitmen yoklamalarının tamamlanması gereken son tarih.
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-lg text-center min-w-16">
                    <div className="font-bold text-primary">15-20</div>
                    <div className="text-xs text-muted-foreground">MAY</div>
                  </div>
                  <div>
                    <div className="font-medium">Bahar Dönemi Proje Şenliği</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Tüm atölyelerde bahar dönemi proje şenlikleri düzenlenecektir.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Hızlı Erişim</CardTitle>
            <CardDescription>Sık kullanılan işlemler</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/dashboard/superuser/workshops"
                className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <Map className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium text-center">Atölyeler</span>
              </Link>
              <Link
                href="/dashboard/superuser/reports"
                className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <FileText className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium text-center">Raporlar</span>
              </Link>
              <Link
                href="/dashboard/superuser/announcements"
                className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <MessageSquare className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium text-center">Duyurular</span>
              </Link>
              <Link
                href="/dashboard/superuser/calendar"
                className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <Calendar className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium text-center">Takvim</span>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Komisyon Faaliyetleri</CardTitle>
            <CardDescription>Komisyonların son faaliyetleri</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Eğitmen Komisyonu</span>
                  <span className="font-medium">12 Görev</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Takımlar Komisyonu</span>
                  <span className="font-medium">8 Görev</span>
                </div>
                <Progress value={70} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Eğitim Programları Komisyonu</span>
                  <span className="font-medium">15 Görev</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Medya ve İletişim Komisyonu</span>
                  <span className="font-medium">10 Görev</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
