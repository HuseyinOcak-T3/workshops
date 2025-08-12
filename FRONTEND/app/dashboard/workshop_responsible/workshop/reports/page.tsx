"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { BarChart, Calendar, Download, FileText, PieChart } from "lucide-react"
import Link from "next/link"

export default function WorkshopReportsPage() {
  const { toast } = useToast()
  const [period, setPeriod] = useState("2025-03")
  const [reportType, setReportType] = useState("attendance")

  const handleDownloadReport = () => {
    toast({
      title: "Rapor indiriliyor",
      description: "Rapor indirme işlemi başlatıldı.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Atölye Raporları</h1>
          <p className="text-muted-foreground">Atölye performans ve istatistik raporları</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/workshop_responsible/workshop">
              <FileText className="mr-2 h-4 w-4" />
              Atölye Detayları
            </Link>
          </Button>
          <Button onClick={handleDownloadReport}>
            <Download className="mr-2 h-4 w-4" />
            Raporu İndir
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Rapor Filtreleri</CardTitle>
            <CardDescription>Rapor türü ve dönem seçimi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="report-type">Rapor Türü</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="Rapor türü seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attendance">Yoklama Raporu</SelectItem>
                  <SelectItem value="performance">Performans Raporu</SelectItem>
                  <SelectItem value="equipment">Ekipman Raporu</SelectItem>
                  <SelectItem value="scholars">Bursiyer Raporu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="period">Dönem</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger id="period">
                  <SelectValue placeholder="Dönem seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025-03">Mart 2025</SelectItem>
                  <SelectItem value="2025-02">Şubat 2025</SelectItem>
                  <SelectItem value="2025-01">Ocak 2025</SelectItem>
                  <SelectItem value="2024-12">Aralık 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleDownloadReport}>
              <Download className="mr-2 h-4 w-4" />
              Raporu İndir
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-9">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {reportType === "attendance"
                  ? "Yoklama Raporu"
                  : reportType === "performance"
                    ? "Performans Raporu"
                    : reportType === "equipment"
                      ? "Ekipman Raporu"
                      : "Bursiyer Raporu"}
              </CardTitle>
              <Tabs defaultValue="table">
                <TabsList>
                  <TabsTrigger value="table">
                    <FileText className="h-4 w-4 mr-2" />
                    Tablo
                  </TabsTrigger>
                  <TabsTrigger value="chart">
                    <BarChart className="h-4 w-4 mr-2" />
                    Grafik
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <CardDescription>
              {period === "2025-03"
                ? "Mart 2025"
                : period === "2025-02"
                  ? "Şubat 2025"
                  : period === "2025-01"
                    ? "Ocak 2025"
                    : "Aralık 2024"}{" "}
              dönemi raporu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TabsContent value="table" className="mt-0">
              {reportType === "attendance" && (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tarih</TableHead>
                        <TableHead>Bursiyer Yoklama</TableHead>
                        <TableHead>Eğitmen Yoklama</TableHead>
                        <TableHead>Toplam Katılım</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>01.03.2025</TableCell>
                        <TableCell>18/24 (%75)</TableCell>
                        <TableCell>3/3 (%100)</TableCell>
                        <TableCell>%80</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>08.03.2025</TableCell>
                        <TableCell>20/24 (%83)</TableCell>
                        <TableCell>3/3 (%100)</TableCell>
                        <TableCell>%87</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>15.03.2025</TableCell>
                        <TableCell>22/24 (%92)</TableCell>
                        <TableCell>2/3 (%67)</TableCell>
                        <TableCell>%85</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>22.03.2025</TableCell>
                        <TableCell>21/24 (%88)</TableCell>
                        <TableCell>3/3 (%100)</TableCell>
                        <TableCell>%90</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>29.03.2025</TableCell>
                        <TableCell>19/24 (%79)</TableCell>
                        <TableCell>3/3 (%100)</TableCell>
                        <TableCell>%85</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}

              {reportType === "performance" && (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Metrik</TableHead>
                        <TableHead>Değer</TableHead>
                        <TableHead>Önceki Dönem</TableHead>
                        <TableHead>Değişim</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Bursiyer Yoklama Oranı</TableCell>
                        <TableCell>%85</TableCell>
                        <TableCell>%82</TableCell>
                        <TableCell className="text-green-600">+%3</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Eğitmen Yoklama Oranı</TableCell>
                        <TableCell>%93</TableCell>
                        <TableCell>%95</TableCell>
                        <TableCell className="text-red-600">-%2</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Görev Tamamlama Oranı</TableCell>
                        <TableCell>%90</TableCell>
                        <TableCell>%85</TableCell>
                        <TableCell className="text-green-600">+%5</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Ekipman Kullanım Oranı</TableCell>
                        <TableCell>%78</TableCell>
                        <TableCell>%75</TableCell>
                        <TableCell className="text-green-600">+%3</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Genel Performans</TableCell>
                        <TableCell>%87</TableCell>
                        <TableCell>%84</TableCell>
                        <TableCell className="text-green-600">+%3</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}

              {reportType === "equipment" && (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ekipman</TableHead>
                        <TableHead>Toplam</TableHead>
                        <TableHead>Çalışan</TableHead>
                        <TableHead>Arızalı</TableHead>
                        <TableHead>Kullanım Oranı</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>3D Yazıcı</TableCell>
                        <TableCell>5</TableCell>
                        <TableCell>5</TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>%85</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Robotik Kit</TableCell>
                        <TableCell>30</TableCell>
                        <TableCell>28</TableCell>
                        <TableCell>2</TableCell>
                        <TableCell>%90</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Bilgisayar</TableCell>
                        <TableCell>25</TableCell>
                        <TableCell>25</TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>%95</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Arduino Set</TableCell>
                        <TableCell>40</TableCell>
                        <TableCell>38</TableCell>
                        <TableCell>2</TableCell>
                        <TableCell>%80</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Elektronik Devre Kiti</TableCell>
                        <TableCell>35</TableCell>
                        <TableCell>32</TableCell>
                        <TableCell>3</TableCell>
                        <TableCell>%75</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}

              {reportType === "scholars" && (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sınıf</TableHead>
                        <TableHead>Toplam Bursiyer</TableHead>
                        <TableHead>Aktif</TableHead>
                        <TableHead>Devam Etmiyor</TableHead>
                        <TableHead>Yoklama Oranı</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>9. Sınıf</TableCell>
                        <TableCell>8</TableCell>
                        <TableCell>7</TableCell>
                        <TableCell>1</TableCell>
                        <TableCell>%82</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>10. Sınıf</TableCell>
                        <TableCell>10</TableCell>
                        <TableCell>9</TableCell>
                        <TableCell>1</TableCell>
                        <TableCell>%88</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>11. Sınıf</TableCell>
                        <TableCell>6</TableCell>
                        <TableCell>5</TableCell>
                        <TableCell>1</TableCell>
                        <TableCell>%85</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>12. Sınıf</TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Toplam</TableCell>
                        <TableCell className="font-medium">24</TableCell>
                        <TableCell className="font-medium">21</TableCell>
                        <TableCell className="font-medium">3</TableCell>
                        <TableCell className="font-medium">%85</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="chart" className="mt-0">
              <div className="flex items-center justify-center p-12 border rounded-lg">
                <div className="text-center">
                  <PieChart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Grafik Görünümü</h3>
                  <p className="text-sm text-muted-foreground">Bu özellik yakında kullanıma sunulacaktır.</p>
                </div>
              </div>
            </TabsContent>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Son güncelleme: 01.04.2025</span>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/workshop_responsible/workshop/reports/detailed">
                <FileText className="mr-2 h-4 w-4" />
                Detaylı Rapor
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Toplam Bursiyer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">21 Aktif, 3 Devam etmiyor</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Yoklama Oranı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">%85</div>
            <p className="text-xs text-muted-foreground">Önceki dönem: %82</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Eğitmen Sayısı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">3 Aktif, 0 İzinli</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
