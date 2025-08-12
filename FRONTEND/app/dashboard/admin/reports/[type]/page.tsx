"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, BarChart3, Download, FileDown, Filter, Printer, Share2 } from "lucide-react"
import Link from "next/link"

export default function DetailedReportPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const reportType = params.type as string

  const [loading, setLoading] = useState(true)
  const [regionFilter, setRegionFilter] = useState("all")
  const [periodFilter, setPeriodFilter] = useState("month")
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart")

  useEffect(() => {
    // Simulate API call to fetch report data
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [reportType])

  const handleDownloadReport = (format: string) => {
    toast({
      title: `${format.toUpperCase()} indiriliyor`,
      description: `Rapor ${format.toUpperCase()} formatında indiriliyor, lütfen bekleyin.`,
    })

    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Rapor indirildi",
        description: `Rapor başarıyla ${format.toUpperCase()} formatında indirildi.`,
      })
    }, 1500)
  }

  const getReportTitle = () => {
    switch (reportType) {
      case "attendance":
        return "Yoklama Raporu"
      case "tasks":
        return "Görev Raporu"
      case "performance":
        return "Performans Raporu"
      default:
        return "Detaylı Rapor"
    }
  }

  const getReportDescription = () => {
    switch (reportType) {
      case "attendance":
        return "Atölye bazlı yoklama oranları ve istatistikler"
      case "tasks":
        return "Görev tamamlanma oranları ve istatistikler"
      case "performance":
        return "Atölye performans metrikleri ve karşılaştırmalar"
      default:
        return "Detaylı rapor ve istatistikler"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Rapor yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/dashboard/superuser/reports">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{getReportTitle()}</h1>
            <p className="text-muted-foreground">{getReportDescription()}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Paylaş
          </Button>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Yazdır
          </Button>
          <Select defaultValue="pdf">
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Format seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf" onClick={() => handleDownloadReport("pdf")}>
                PDF İndir
              </SelectItem>
              <SelectItem value="excel" onClick={() => handleDownloadReport("excel")}>
                Excel İndir
              </SelectItem>
              <SelectItem value="csv" onClick={() => handleDownloadReport("csv")}>
                CSV İndir
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between space-x-2">
        <div className="flex items-center gap-2">
          <Button variant={viewMode === "chart" ? "default" : "outline"} size="sm" onClick={() => setViewMode("chart")}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Grafik Görünümü
          </Button>
          <Button variant={viewMode === "table" ? "default" : "outline"} size="sm" onClick={() => setViewMode("table")}>
            <FileDown className="mr-2 h-4 w-4" />
            Tablo Görünümü
          </Button>
        </div>

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

      {reportType === "attendance" && (
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

                {viewMode === "chart" ? (
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
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                          >
                            Atölye
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                          >
                            Bölge
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                          >
                            Devamlılık
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                          >
                            Telafi
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                          >
                            Devamsızlık
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-card divide-y divide-border">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">İstanbul - Pendik Atölyesi</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Marmara</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">%90</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">%7</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">%3</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Ankara - Çankaya Atölyesi</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">İç Anadolu</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">%85</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">%10</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">%5</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">İzmir - Bornova Atölyesi</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Ege</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">%78</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">%15</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">%7</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Bursa - Nilüfer Atölyesi</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Marmara</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">%80</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">%12</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">%8</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Badge>
                {periodFilter === "week"
                  ? "Haftalık Rapor"
                  : periodFilter === "month"
                    ? "Aylık Rapor"
                    : periodFilter === "quarter"
                      ? "3 Aylık Rapor"
                      : "Yıllık Rapor"}
              </Badge>

              <Button onClick={() => handleDownloadReport("pdf")}>
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
      )}

      {reportType === "tasks" && (
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

                {viewMode === "chart" ? (
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
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                          >
                            Görev
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                          >
                            Komisyon
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                          >
                            Son Tarih
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                          >
                            Durum
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                          >
                            Tamamlanma
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-card divide-y divide-border">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Mart Ayı Yoklama Girişleri</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Eğitmen Komisyonu</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">05.04.2025</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">Devam Ediyor</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">18/28 (%64)</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Proje Şenliği Takım Listeleri</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Eğitim Programları Komisyonu</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">20.03.2025</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">Devam Ediyor</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">12/28 (%43)</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Şubat Ayı Raporları</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Eğitmen Komisyonu</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">10.03.2025</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Tamamlandı</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">28/28 (%100)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Badge>
                {periodFilter === "week"
                  ? "Haftalık Rapor"
                  : periodFilter === "month"
                    ? "Aylık Rapor"
                    : periodFilter === "quarter"
                      ? "3 Aylık Rapor"
                      : "Yıllık Rapor"}
              </Badge>

              <Button onClick={() => handleDownloadReport("pdf")}>
                <Download className="mr-2 h-4 w-4" />
                Raporu İndir
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {reportType === "performance" && (
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
              <Button variant="outline" onClick={() => handleDownloadReport("pdf")}>
                <Download className="mr-2 h-4 w-4" />
                PDF olarak indir
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
