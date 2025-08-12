"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  CalendarRange,
  Download,
  FileDown,
  Filter,
  PieChart,
  Plus,
  TableProperties,
  Waves,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

export default function ReportsPage() {
  const [regionFilter, setRegionFilter] = useState("all")
  const [periodFilter, setPeriodFilter] = useState("month")
  const [reportType, setReportType] = useState("attendance")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Raporlar</h1>
          <p className="text-muted-foreground">Sistem geneli performans ve analiz raporları</p>
        </div>

        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Yeni Rapor Oluştur
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Yeni Rapor Oluştur</DialogTitle>
                <DialogDescription>
                  Özelleştirilmiş bir rapor oluşturmak için aşağıdaki seçenekleri kullanın.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="report-type">Rapor Türü</Label>
                  <RadioGroup defaultValue="attendance">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="attendance" id="attendance" />
                      <Label htmlFor="attendance">Yoklama Raporu</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tasks" id="tasks" />
                      <Label htmlFor="tasks">Görev Raporu</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="workshops" id="workshops" />
                      <Label htmlFor="workshops">Atölye Performans Raporu</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="teams" id="teams" />
                      <Label htmlFor="teams">Takım Raporu</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="region">Bölge</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="region">
                      <SelectValue placeholder="Bölge seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Bölgeler</SelectItem>
                      <SelectItem value="marmara">Marmara</SelectItem>
                      <SelectItem value="ege">Ege</SelectItem>
                      <SelectItem value="ic-anadolu">İç Anadolu</SelectItem>
                      <SelectItem value="akdeniz">Akdeniz</SelectItem>
                      <SelectItem value="karadeniz">Karadeniz</SelectItem>
                      <SelectItem value="dogu-anadolu">Doğu Anadolu</SelectItem>
                      <SelectItem value="guneydogu-anadolu">Güneydoğu Anadolu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="period">Periyot</Label>
                  <Select defaultValue="month">
                    <SelectTrigger id="period">
                      <SelectValue placeholder="Periyot seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Haftalık</SelectItem>
                      <SelectItem value="month">Aylık</SelectItem>
                      <SelectItem value="quarter">3 Aylık</SelectItem>
                      <SelectItem value="year">Yıllık</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="options">Dahil Edilecek Veriler</Label>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-charts" defaultChecked />
                      <Label htmlFor="include-charts">Grafikler</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-tables" defaultChecked />
                      <Label htmlFor="include-tables">Tablolar</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-analytics" defaultChecked />
                      <Label htmlFor="include-analytics">Analitik Veriler</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-comparisons" />
                      <Label htmlFor="include-comparisons">Karşılaştırmalı Veriler</Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Rapor Oluştur</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center justify-between space-x-2">
        <Tabs defaultValue="general" className="w-full">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="general">Genel Raporlar</TabsTrigger>
              <TabsTrigger value="performance">Performans Raporları</TabsTrigger>
              <TabsTrigger value="attendance">Yoklama Raporları</TabsTrigger>
              <TabsTrigger value="tasks">Görev Raporları</TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Bölge seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Bölgeler</SelectItem>
                  <SelectItem value="marmara">Marmara</SelectItem>
                  <SelectItem value="ege">Ege</SelectItem>
                  <SelectItem value="ic-anadolu">İç Anadolu</SelectItem>
                  <SelectItem value="akdeniz">Akdeniz</SelectItem>
                  <SelectItem value="karadeniz">Karadeniz</SelectItem>
                  <SelectItem value="dogu-anadolu">Doğu Anadolu</SelectItem>
                  <SelectItem value="guneydogu-anadolu">Güneydoğu Anadolu</SelectItem>
                </SelectContent>
              </Select>

              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Periyot seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Haftalık</SelectItem>
                  <SelectItem value="month">Aylık</SelectItem>
                  <SelectItem value="quarter">3 Aylık</SelectItem>
                  <SelectItem value="year">Yıllık</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="general" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Genel Atölye Performansı</CardTitle>
                  <CardDescription>Atölye genel performans raporu</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[230px] flex flex-col justify-center">
                    <div className="mx-auto h-52 w-52 relative">
                      <div className="h-full w-full rounded-full bg-muted flex items-center justify-center">
                        <div className="h-36 w-36 rounded-full bg-card flex flex-col items-center justify-center">
                          <span className="text-4xl font-bold">78%</span>
                          <span className="text-sm text-muted-foreground">Genel Skor</span>
                        </div>
                      </div>
                      <div className="absolute top-0 left-0 h-full w-full">
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            width: "50%",
                            height: "2px",
                            backgroundColor: "hsl(var(--primary))",
                            transformOrigin: "0 0",
                            transform: "rotate(70deg)",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/superuser/reports/performance">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Detaylı Rapor
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Bursiyer Devam Durumu</CardTitle>
                  <CardDescription>Bursiyer devam oranları raporu</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8 mt-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Devamlılık Oranı</span>
                        <span className="font-medium">%82</span>
                      </div>
                      <Progress value={82} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Telafi Oranı</span>
                        <span className="font-medium">%12</span>
                      </div>
                      <Progress value={12} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Devamsızlık Oranı</span>
                        <span className="font-medium">%6</span>
                      </div>
                      <Progress value={6} className="h-2" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/superuser/reports/attendance">
                      <PieChart className="mr-2 h-4 w-4" />
                      Detaylı Rapor
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Görev Tamamlama</CardTitle>
                  <CardDescription>Görev tamamlama oranları raporu</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-around my-5">
                    <div className="flex flex-col items-center">
                      <div className="text-3xl font-bold">28</div>
                      <div className="text-sm text-muted-foreground">Toplam</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-3xl font-bold text-green-500">20</div>
                      <div className="text-sm text-muted-foreground">Başarılı</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-3xl font-bold text-yellow-500">5</div>
                      <div className="text-sm text-muted-foreground">Devam</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-3xl font-bold text-red-500">3</div>
                      <div className="text-sm text-muted-foreground">Geciken</div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="h-3 w-full flex rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full" style={{ width: "71.5%" }}></div>
                      <div className="bg-yellow-500 h-full" style={{ width: "17.5%" }}></div>
                      <div className="bg-red-500 h-full" style={{ width: "11%" }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <div>0</div>
                      <div>28</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/superuser/reports/tasks">
                      <FileDown className="mr-2 h-4 w-4" />
                      Detaylı Rapor
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle>Bölgesel Performans Karşılaştırması</CardTitle>
                  <CardDescription>Türkiye genelindeki atölyelerin bölgesel performans raporu</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px] flex flex-col justify-center space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-primary rounded-sm mr-2"></div>
                          <span className="text-sm">Marmara</span>
                        </div>
                        <div className="text-3xl font-bold ml-6 mt-1">%82</div>
                      </div>
                      <div className="w-[70%]">
                        <Progress value={82} className="h-8" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-primary rounded-sm mr-2"></div>
                          <span className="text-sm">İç Anadolu</span>
                        </div>
                        <div className="text-3xl font-bold ml-6 mt-1">%78</div>
                      </div>
                      <div className="w-[70%]">
                        <Progress value={78} className="h-8" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-primary rounded-sm mr-2"></div>
                          <span className="text-sm">Ege</span>
                        </div>
                        <div className="text-3xl font-bold ml-6 mt-1">%75</div>
                      </div>
                      <div className="w-[70%]">
                        <Progress value={75} className="h-8" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Rapor İndir (PDF)
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Sonraki Raporlama Takvimi</CardTitle>
                  <CardDescription>Yaklaşan raporlama tarihleri</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 p-2 rounded-lg text-center min-w-16">
                        <div className="font-bold text-primary">5</div>
                        <div className="text-xs text-muted-foreground">NİS</div>
                      </div>
                      <div>
                        <div className="font-medium">Mart Ayı Yoklama Raporu</div>
                        <div className="text-sm text-muted-foreground mt-1">Mart ayı atölye yoklama bildirimleri</div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 p-2 rounded-lg text-center min-w-16">
                        <div className="font-bold text-primary">15</div>
                        <div className="text-xs text-muted-foreground">NİS</div>
                      </div>
                      <div>
                        <div className="font-medium">Q1 Performans Raporu</div>
                        <div className="text-sm text-muted-foreground mt-1">İlk çeyrek atölye performans raporu</div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 p-2 rounded-lg text-center min-w-16">
                        <div className="font-bold text-primary">30</div>
                        <div className="text-xs text-muted-foreground">NİS</div>
                      </div>
                      <div>
                        <div className="font-medium">Yarışma Takımları Raporu</div>
                        <div className="text-sm text-muted-foreground mt-1">Ulusal yarışma takım bildirimleri</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <CalendarRange className="mr-2 h-4 w-4" />
                    Takvimi Görüntüle
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Atölye Performans Karşılaştırması</CardTitle>
                  <CardDescription>Aylık atölye performans değerlendirmesi</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                          <span className="text-sm font-medium">İstanbul - Pendik Atölyesi</span>
                        </div>
                        <span className="text-sm font-medium">%95</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                          <span className="text-sm font-medium">Ankara - Çankaya Atölyesi</span>
                        </div>
                        <span className="text-sm font-medium">%88</span>
                      </div>
                      <Progress value={88} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                          <span className="text-sm font-medium">İzmir - Bornova Atölyesi</span>
                        </div>
                        <span className="text-sm font-medium">%82</span>
                      </div>
                      <Progress value={82} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                          <span className="text-sm font-medium">Bursa - Nilüfer Atölyesi</span>
                        </div>
                        <span className="text-sm font-medium">%78</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                          <span className="text-sm font-medium">Antalya - Muratpaşa Atölyesi</span>
                        </div>
                        <span className="text-sm font-medium">%65</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <Badge>Son 30 gün içerisinde</Badge>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    PDF olarak indir
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performans Metrikleri</CardTitle>
                  <CardDescription>Atölye performans metrikleri dağılımı</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
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

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Takım Çalışmalarına Katılım</span>
                        <span className="font-medium">%72</span>
                      </div>
                      <Progress value={72} className="h-2" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <TableProperties className="mr-2 h-4 w-4" />
                    Detaylı Veri Görüntüle
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Atölye Karşılaştırmalı Trend</CardTitle>
                  <CardDescription>Zaman içindeki performans değişimi</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px] flex items-end justify-around gap-4">
                    {/* Simplified chart representation */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-[140px] w-10 bg-primary/20 rounded-t-sm relative overflow-hidden">
                        <div className="absolute bottom-0 w-full h-[65%] bg-primary rounded-t-sm"></div>
                      </div>
                      <div className="text-xs">Ocak</div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-[140px] w-10 bg-primary/20 rounded-t-sm relative overflow-hidden">
                        <div className="absolute bottom-0 w-full h-[70%] bg-primary rounded-t-sm"></div>
                      </div>
                      <div className="text-xs">Şubat</div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-[140px] w-10 bg-primary/20 rounded-t-sm relative overflow-hidden">
                        <div className="absolute bottom-0 w-full h-[78%] bg-primary rounded-t-sm"></div>
                      </div>
                      <div className="text-xs">Mart</div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-[140px] w-10 bg-primary/20 rounded-t-sm relative overflow-hidden">
                        <div className="absolute bottom-0 w-full h-[75%] bg-primary rounded-t-sm"></div>
                      </div>
                      <div className="text-xs">Nisan</div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-[140px] w-10 bg-primary/20 rounded-t-sm relative overflow-hidden">
                        <div className="absolute bottom-0 w-full h-[85%] bg-primary rounded-t-sm"></div>
                      </div>
                      <div className="text-xs">Mayıs</div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-[140px] w-10 bg-primary/20 rounded-t-sm relative overflow-hidden">
                        <div className="absolute bottom-0 w-full h-[82%] bg-primary rounded-t-sm"></div>
                      </div>
                      <div className="text-xs">Haziran</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <Waves className="mr-2 h-4 w-4" />
                    Trend Analizi
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Yoklama Oranları</CardTitle>
                  <CardDescription>Atölye bazlı yoklama oranları raporu</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="border rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold">758</div>
                        <div className="text-sm text-muted-foreground">Toplam Bursiyer</div>
                      </div>
                      <div className="border rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">82%</div>
                        <div className="text-sm text-muted-foreground">Devamlılık</div>
                      </div>
                      <div className="border rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-600">12%</div>
                        <div className="text-sm text-muted-foreground">Telafi</div>
                      </div>
                      <div className="border rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">6%</div>
                        <div className="text-sm text-muted-foreground">Devamsızlık</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                            <span className="text-sm font-medium">İstanbul - Pendik Atölyesi</span>
                          </div>
                          <span className="text-sm font-medium">%90</span>
                        </div>
                        <Progress value={90} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                            <span className="text-sm font-medium">Ankara - Çankaya Atölyesi</span>
                          </div>
                          <span className="text-sm font-medium">%85</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                            <span className="text-sm font-medium">İzmir - Bornova Atölyesi</span>
                          </div>
                          <span className="text-sm font-medium">%78</span>
                        </div>
                        <Progress value={78} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                            <span className="text-sm font-medium">Bursa - Nilüfer Atölyesi</span>
                          </div>
                          <span className="text-sm font-medium">%80</span>
                        </div>
                        <Progress value={80} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Select defaultValue="month">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Ay seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="january">Ocak</SelectItem>
                      <SelectItem value="february">Şubat</SelectItem>
                      <SelectItem value="march">Mart</SelectItem>
                      <SelectItem value="month">Son 30 Gün</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Raporu İndir
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bölgesel Yoklama Verileri</CardTitle>
                  <CardDescription>Bölge bazlı yoklama performansı</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="pt-4 space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="min-w-[100px]">
                        <div className="font-medium text-sm">Marmara</div>
                        <div className="text-2xl font-bold">%87</div>
                      </div>
                      <div className="flex-1">
                        <Progress value={87} className="h-4" />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="min-w-[100px]">
                        <div className="font-medium text-sm">İç Anadolu</div>
                        <div className="text-2xl font-bold">%85</div>
                      </div>
                      <div className="flex-1">
                        <Progress value={85} className="h-4" />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="min-w-[100px]">
                        <div className="font-medium text-sm">Ege</div>
                        <div className="text-2xl font-bold">%78</div>
                      </div>
                      <div className="flex-1">
                        <Progress value={78} className="h-4" />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="min-w-[100px]">
                        <div className="font-medium text-sm">Akdeniz</div>
                        <div className="text-2xl font-bold">%76</div>
                      </div>
                      <div className="flex-1">
                        <Progress value={76} className="h-4" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    Şehir Bazlı Analiz
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Zaman Serisi Analizi</CardTitle>
                  <CardDescription>Yoklama oranları zaman analizi</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px] flex items-center justify-center">
                    <div className="relative w-full h-40">
                      {/* Simplified line chart */}
                      <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
                        <path
                          d="M0,50 C20,40 40,30 60,35 C80,40 100,60 120,55 C140,50 160,35 180,30 C200,25 220,35 240,30 C260,25 280,15 300,20"
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="2"
                        />
                        <path
                          d="M0,50 C20,40 40,30 60,35 C80,40 100,60 120,55 C140,50 160,35 180,30 C200,25 220,35 240,30 C260,25 280,15 300,20"
                          fill="hsl(var(--primary) / 0.1)"
                          strokeWidth="0"
                          d="M0,100 L0,50 C20,40 40,30 60,35 C80,40 100,60 120,55 C140,50 160,35 180,30 C200,25 220,35 240,30 C260,25 280,15 300,20 L300,100 Z"
                        />
                      </svg>

                      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground">
                        <div>Ocak</div>
                        <div>Şubat</div>
                        <div>Mart</div>
                        <div>Nisan</div>
                        <div>Mayıs</div>
                        <div>Haz</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Trend Analizi
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Görev Tamamlama Raporu</CardTitle>
                  <CardDescription>Görev bazlı tamamlanma raporu</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="border rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold">28</div>
                        <div className="text-sm text-muted-foreground">Toplam Görev</div>
                      </div>
                      <div className="border rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">20</div>
                        <div className="text-sm text-muted-foreground">Tamamlanan</div>
                      </div>
                      <div className="border rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-600">5</div>
                        <div className="text-sm text-muted-foreground">Devam Eden</div>
                      </div>
                      <div className="border rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">3</div>
                        <div className="text-sm text-muted-foreground">Geciken</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">Mart Ayı Yoklama Girişleri</div>
                          <span className="text-yellow-600 text-sm font-medium">Devam Ediyor</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Son tarih: 05.04.2025</span>
                          <span>18/28 Atölye</span>
                        </div>
                        <Progress value={64} className="h-2 mt-1" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">Proje Şenliği Takım Listeleri</div>
                          <span className="text-yellow-600 text-sm font-medium">Devam Ediyor</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Son tarih: 20.03.2025</span>
                          <span>12/28 Atölye</span>
                        </div>
                        <Progress value={43} className="h-2 mt-1" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">Şubat Ayı Raporları</div>
                          <span className="text-green-600 text-sm font-medium">Tamamlandı</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Tamamlandı: 10.03.2025</span>
                          <span>28/28 Atölye</span>
                        </div>
                        <Progress value={100} className="h-2 mt-1" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Badge>Son 30 gün içerisinde</Badge>
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Raporu İndir
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Komisyon Görev Performansı</CardTitle>
                  <CardDescription>Komisyon bazlı görev tamamlanma oranları</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="pt-2 space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Eğitmen Komisyonu</span>
                        <span className="font-medium">%85</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Takımlar Komisyonu</span>
                        <span className="font-medium">%70</span>
                      </div>
                      <Progress value={70} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Eğitim Programları Komisyonu</span>
                        <span className="font-medium">%90</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Medya ve İletişim Komisyonu</span>
                        <span className="font-medium">%60</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    Görev Bazlı Analiz
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Öncelik Dağılımı</CardTitle>
                  <CardDescription>Görevlerin öncelik dağılımı</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-[200px]">
                    <div className="relative h-40 w-40 rounded-full overflow-hidden bg-muted">
                      <div
                        className="absolute top-0 left-0 h-1/2 w-full bg-red-500"
                        style={{ transform: "rotate(0deg)" }}
                      ></div>
                      <div
                        className="absolute top-0 left-0 h-1/2 w-full bg-yellow-500"
                        style={{ transform: "rotate(135deg)" }}
                      ></div>
                      <div
                        className="absolute top-0 left-0 h-1/2 w-full bg-green-500"
                        style={{ transform: "rotate(270deg)" }}
                      ></div>
                      <div className="absolute top-0 left-0 right-0 bottom-0 m-auto h-28 w-28 rounded-full bg-card"></div>
                    </div>
                  </div>
                  <div className="flex justify-around text-center text-sm pt-4">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div>Yüksek: 35%</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div>Orta: 45%</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <div>Düşük: 20%</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <TableProperties className="mr-2 h-4 w-4" />
                    Detaylı Veriler
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
