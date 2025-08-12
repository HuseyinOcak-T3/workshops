"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  BarChart3,
  CalendarIcon,
  CheckIcon,
  ClipboardIcon,
  DownloadIcon,
  EyeIcon,
  FileTextIcon,
  FilterIcon,
  MoreHorizontalIcon,
  PieChartIcon,
  SearchIcon,
  UsersIcon,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

// Örnek rapor verileri
const reportsData = [
  {
    id: 1,
    title: "Aylık Katılım Raporu - Nisan 2023",
    type: "attendance",
    workshop: "Tüm Atölyeler",
    date: "2023-05-01",
    status: "approved",
    createdBy: "Sistem",
    fileSize: "2.4 MB",
  },
  {
    id: 2,
    title: "Bursiyer Performans Raporu - Nisan 2023",
    type: "performance",
    workshop: "İstanbul Atölyeleri",
    date: "2023-05-02",
    status: "pending",
    createdBy: "Ahmet Yılmaz",
    fileSize: "1.8 MB",
  },
  {
    id: 3,
    title: "Malzeme Envanter Raporu - Q1 2023",
    type: "inventory",
    workshop: "Tüm Atölyeler",
    date: "2023-04-15",
    status: "approved",
    createdBy: "Sistem",
    fileSize: "3.2 MB",
  },
  {
    id: 4,
    title: "Eğitmen Performans Değerlendirmesi - Nisan 2023",
    type: "performance",
    workshop: "Ankara Atölyeleri",
    date: "2023-05-03",
    status: "pending",
    createdBy: "Mehmet Demir",
    fileSize: "1.5 MB",
  },
  {
    id: 5,
    title: "Bütçe Kullanım Raporu - Q1 2023",
    type: "budget",
    workshop: "Tüm Atölyeler",
    date: "2023-04-10",
    status: "approved",
    createdBy: "Finans Departmanı",
    fileSize: "4.1 MB",
  },
  {
    id: 6,
    title: "Atölye Ekipman Durumu - Nisan 2023",
    type: "inventory",
    workshop: "İzmir Atölyeleri",
    date: "2023-05-01",
    status: "rejected",
    createdBy: "Ayşe Şahin",
    fileSize: "2.0 MB",
  },
  {
    id: 7,
    title: "Bursiyer Memnuniyet Anketi Sonuçları - Q1 2023",
    type: "survey",
    workshop: "Tüm Atölyeler",
    date: "2023-04-20",
    status: "approved",
    createdBy: "Sistem",
    fileSize: "2.7 MB",
  },
  {
    id: 8,
    title: "Proje Tamamlama Raporu - Nisan 2023",
    type: "performance",
    workshop: "Bursa Atölyeleri",
    date: "2023-05-02",
    status: "pending",
    createdBy: "Ali Yıldız",
    fileSize: "1.9 MB",
  },
  {
    id: 9,
    title: "Eğitim Materyalleri Kullanım Raporu - Q1 2023",
    type: "education",
    workshop: "Tüm Atölyeler",
    date: "2023-04-25",
    status: "approved",
    createdBy: "Eğitim Departmanı",
    fileSize: "3.5 MB",
  },
  {
    id: 10,
    title: "Atölye Ziyaretçi İstatistikleri - Nisan 2023",
    type: "attendance",
    workshop: "Antalya Atölyeleri",
    date: "2023-05-03",
    status: "pending",
    createdBy: "Fatma Öztürk",
    fileSize: "1.2 MB",
  },
]

export default function AdminReportsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  // Rapor türleri
  const reportTypes = Array.from(new Set(reportsData.map((report) => report.type)))

  // Filtreleme fonksiyonu
  const filteredReports = reportsData.filter((report) => {
    // Arama sorgusu filtresi
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.workshop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.createdBy.toLowerCase().includes(searchQuery.toLowerCase())

    // Tür filtresi
    const matchesType = selectedType === "all" || report.type === selectedType

    // Durum filtresi
    const matchesStatus = selectedStatus === "all" || report.status === selectedStatus

    // Tab filtresi
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "attendance" && report.type === "attendance") ||
      (activeTab === "performance" && report.type === "performance") ||
      (activeTab === "inventory" && report.type === "inventory") ||
      (activeTab === "budget" && report.type === "budget")

    return matchesSearch && matchesType && matchesStatus && matchesTab
  })

  const handleDownloadReport = (id: number) => {
    // Rapor indirme işlemi burada yapılacak
    toast({
      title: "Rapor indiriliyor",
      description: "Rapor indirme işlemi başlatıldı.",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50 border-green-200">
            <CheckIcon className="mr-1 h-3 w-3" />
            Onaylandı
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 hover:bg-yellow-50 border-yellow-200">
            <ClockIcon className="mr-1 h-3 w-3" />
            İnceleniyor
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50 border-red-200">
            <XIcon className="mr-1 h-3 w-3" />
            Reddedildi
          </Badge>
        )
      default:
        return null
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "attendance":
        return <UsersIcon className="h-4 w-4 text-blue-500" />
      case "performance":
        return <BarChart3 className="h-4 w-4 text-purple-500" />
      case "inventory":
        return <ClipboardIcon className="h-4 w-4 text-green-500" />
      case "budget":
        return <PieChartIcon className="h-4 w-4 text-red-500" />
      case "survey":
        return <FileTextIcon className="h-4 w-4 text-orange-500" />
      case "education":
        return <BookIcon className="h-4 w-4 text-cyan-500" />
      default:
        return <FileTextIcon className="h-4 w-4 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Raporlar</h2>
        <Button>
          <DownloadIcon className="mr-2 h-4 w-4" />
          Rapor İndir
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">Tüm Raporlar</TabsTrigger>
            <TabsTrigger value="attendance">Katılım</TabsTrigger>
            <TabsTrigger value="performance">Performans</TabsTrigger>
            <TabsTrigger value="inventory">Envanter</TabsTrigger>
            <TabsTrigger value="budget">Bütçe</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rapor ara..."
                className="w-[200px] pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
              <FilterIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {showFilters && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-6">
                <div className="space-y-2">
                  <Label>Rapor Türü</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Tür seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Türler</SelectItem>
                      {reportTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Durum</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Durum seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Durumlar</SelectItem>
                      <SelectItem value="approved">Onaylandı</SelectItem>
                      <SelectItem value="pending">İnceleniyor</SelectItem>
                      <SelectItem value="rejected">Reddedildi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tarih Aralığı</Label>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Tarih aralığı seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Zamanlar</SelectItem>
                      <SelectItem value="this-month">Bu Ay</SelectItem>
                      <SelectItem value="last-month">Geçen Ay</SelectItem>
                      <SelectItem value="this-quarter">Bu Çeyrek</SelectItem>
                      <SelectItem value="last-quarter">Geçen Çeyrek</SelectItem>
                      <SelectItem value="this-year">Bu Yıl</SelectItem>
                      <SelectItem value="custom">Özel Aralık</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Atölye</Label>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Atölye seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Atölyeler</SelectItem>
                      <SelectItem value="istanbul">İstanbul Atölyeleri</SelectItem>
                      <SelectItem value="ankara">Ankara Atölyeleri</SelectItem>
                      <SelectItem value="izmir">İzmir Atölyeleri</SelectItem>
                      <SelectItem value="bursa">Bursa Atölyeleri</SelectItem>
                      <SelectItem value="antalya">Antalya Atölyeleri</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rapor Listesi</CardTitle>
              <CardDescription>
                Toplam {filteredReports.length} rapor listeleniyor
                {searchQuery && ` (${searchQuery} için arama sonuçları)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rapor Adı</TableHead>
                    <TableHead>Tür</TableHead>
                    <TableHead>Atölye</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Oluşturan</TableHead>
                    <TableHead>Boyut</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          {getTypeIcon(report.type)}
                          <span className="ml-2">{report.title}</span>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{report.type}</TableCell>
                      <TableCell>{report.workshop}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                          {formatDate(report.date)}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>{report.createdBy}</TableCell>
                      <TableCell>{report.fileSize}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Menüyü aç</span>
                              <MoreHorizontalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/commission/reports/${report.id}`}>
                                <EyeIcon className="mr-2 h-4 w-4" />
                                <span>Görüntüle</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownloadReport(report.id)}>
                              <DownloadIcon className="mr-2 h-4 w-4" />
                              <span>İndir</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                toast({
                                  title: "Rapor onaylandı",
                                  description: "Rapor başarıyla onaylandı.",
                                })
                              }}
                            >
                              <CheckIcon className="mr-2 h-4 w-4" />
                              <span>Onayla</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Katılım Raporları</CardTitle>
              <CardDescription>Atölye katılım ve devam durumu raporları</CardDescription>
            </CardHeader>
            <CardContent>{/* Benzer tablo yapısı */}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performans Raporları</CardTitle>
              <CardDescription>Bursiyer ve eğitmen performans değerlendirme raporları</CardDescription>
            </CardHeader>
            <CardContent>{/* Benzer tablo yapısı */}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Envanter Raporları</CardTitle>
              <CardDescription>Atölye malzeme ve ekipman envanter raporları</CardDescription>
            </CardHeader>
            <CardContent>{/* Benzer tablo yapısı */}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bütçe Raporları</CardTitle>
              <CardDescription>Atölye bütçe kullanım ve harcama raporları</CardDescription>
            </CardHeader>
            <CardContent>{/* Benzer tablo yapısı */}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Eksik ikonlar
function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function BookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}
