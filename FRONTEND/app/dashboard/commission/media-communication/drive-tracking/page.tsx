"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  RefreshCwIcon,
  SearchIcon,
  FolderIcon,
  DownloadIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  ExternalLinkIcon,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function DriveTrackingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Mock data for drive tracking
  const driveData = [
    {
      id: 1,
      contentWorkTitle: "Mayıs Ayı Proje Tanıtım Videosu",
      driveLink: "https://drive.google.com/folder/example1",
      provinces: [
        {
          name: "İstanbul",
          workshops: [
            {
              name: "Kadıköy Atölyesi",
              uploaded: true,
              fileCount: 5,
              lastUpload: "2024-05-12 14:30",
              fileTypes: ["video", "photo"],
            },
            {
              name: "Üsküdar Atölyesi",
              uploaded: true,
              fileCount: 3,
              lastUpload: "2024-05-11 16:45",
              fileTypes: ["video"],
            },
          ],
          uploadRate: 100,
        },
        {
          name: "Ankara",
          workshops: [
            {
              name: "Çankaya Atölyesi",
              uploaded: true,
              fileCount: 4,
              lastUpload: "2024-05-10 09:15",
              fileTypes: ["video", "photo"],
            },
            { name: "Keçiören Atölyesi", uploaded: false, fileCount: 0, lastUpload: null, fileTypes: [] },
          ],
          uploadRate: 50,
        },
        {
          name: "İzmir",
          workshops: [
            { name: "Bornova Atölyesi", uploaded: false, fileCount: 0, lastUpload: null, fileTypes: [] },
            {
              name: "Karşıyaka Atölyesi",
              uploaded: true,
              fileCount: 2,
              lastUpload: "2024-05-09 11:20",
              fileTypes: ["photo"],
            },
          ],
          uploadRate: 50,
        },
      ],
      totalWorkshops: 6,
      uploadedWorkshops: 4,
      dueDate: "2024-05-20",
      status: "active",
    },
    {
      id: 2,
      contentWorkTitle: "Bahar Dönemi Fotoğraf Çekimi",
      driveLink: "https://drive.google.com/folder/example2",
      provinces: [
        {
          name: "İstanbul",
          workshops: [
            {
              name: "Kadıköy Atölyesi",
              uploaded: true,
              fileCount: 8,
              lastUpload: "2024-05-14 13:22",
              fileTypes: ["photo"],
            },
            {
              name: "Üsküdar Atölyesi",
              uploaded: true,
              fileCount: 6,
              lastUpload: "2024-05-14 15:10",
              fileTypes: ["photo"],
            },
          ],
          uploadRate: 100,
        },
      ],
      totalWorkshops: 2,
      uploadedWorkshops: 2,
      dueDate: "2024-05-15",
      status: "completed",
    },
    {
      id: 3,
      contentWorkTitle: "Öğrenci Röportaj Serisi",
      driveLink: "https://drive.google.com/folder/example3",
      provinces: [
        {
          name: "Ankara",
          workshops: [
            {
              name: "Çankaya Atölyesi",
              uploaded: true,
              fileCount: 2,
              lastUpload: "2024-05-10 10:30",
              fileTypes: ["video"],
            },
            { name: "Keçiören Atölyesi", uploaded: false, fileCount: 0, lastUpload: null, fileTypes: [] },
          ],
          uploadRate: 50,
        },
        {
          name: "İzmir",
          workshops: [
            { name: "Bornova Atölyesi", uploaded: false, fileCount: 0, lastUpload: null, fileTypes: [] },
            { name: "Karşıyaka Atölyesi", uploaded: false, fileCount: 0, lastUpload: null, fileTypes: [] },
          ],
          uploadRate: 0,
        },
      ],
      totalWorkshops: 4,
      uploadedWorkshops: 1,
      dueDate: "2024-05-25",
      status: "pending",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Aktif</Badge>
      case "completed":
        return <Badge variant="secondary">Tamamlandı</Badge>
      case "pending":
        return <Badge variant="outline">Bekliyor</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getUploadStatusIcon = (uploaded: boolean) => {
    return uploaded ? (
      <CheckCircleIcon className="h-4 w-4 text-green-500" />
    ) : (
      <AlertCircleIcon className="h-4 w-4 text-red-500" />
    )
  }

  const getFileTypesBadges = (fileTypes: string[]) => {
    return fileTypes.map((type, index) => (
      <Badge key={index} variant="outline" className="text-xs">
        {type === "video" ? "Video" : type === "photo" ? "Fotoğraf" : type}
      </Badge>
    ))
  }

  const handleRefreshData = async () => {
    setIsRefreshing(true)
    // Simulate API call to refresh drive data
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsRefreshing(false)
  }

  const filteredData = driveData.filter((item) => {
    const matchesSearch = item.contentWorkTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || item.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Drive Klasör Takibi</h2>
          <p className="text-muted-foreground">İllerin Drive klasörlerine yükleme durumlarını API ile takip edin</p>
        </div>
        <Button onClick={handleRefreshData} disabled={isRefreshing} className="gap-1">
          <RefreshCwIcon className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Yenileniyor..." : "Verileri Yenile"}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam İçerik Çalışması</CardTitle>
            <FolderIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{driveData.length}</div>
            <p className="text-xs text-muted-foreground">
              {driveData.filter((d) => d.status === "active").length} aktif takip
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Atölye</CardTitle>
            <DownloadIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{driveData.reduce((sum, item) => sum + item.totalWorkshops, 0)}</div>
            <p className="text-xs text-muted-foreground">Takip edilen atölye</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yükleme Yapan</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{driveData.reduce((sum, item) => sum + item.uploadedWorkshops, 0)}</div>
            <p className="text-xs text-muted-foreground">Atölye yükleme yaptı</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ortalama Yükleme Oranı</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                driveData.reduce((sum, item) => sum + (item.uploadedWorkshops / item.totalWorkshops) * 100, 0) /
                  driveData.length,
              )}
              %
            </div>
            <p className="text-xs text-muted-foreground">Tüm çalışmalar</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Drive Takip Listesi</CardTitle>
          <CardDescription>İçerik çalışmalarının Drive yükleme durumlarını görüntüleyin</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="İçerik çalışması ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Durum: {filterStatus === "all" ? "Tümü" : filterStatus}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterStatus("all")}>Tümü</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("active")}>Aktif</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("completed")}>Tamamlandı</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("pending")}>Bekliyor</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Drive Tracking Cards */}
          <div className="space-y-6">
            {filteredData.map((item) => (
              <Card key={item.id} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{item.contentWorkTitle}</CardTitle>
                      <CardDescription>
                        Son Tarih: {item.dueDate} • {item.uploadedWorkshops}/{item.totalWorkshops} atölye yükledi
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(item.status)}
                      <Button variant="outline" size="sm" asChild>
                        <a href={item.driveLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLinkIcon className="h-4 w-4 mr-1" />
                          Drive'ı Aç
                        </a>
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Progress value={(item.uploadedWorkshops / item.totalWorkshops) * 100} className="h-2" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {item.provinces.map((province, provinceIndex) => (
                      <div key={provinceIndex} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-lg">{province.name}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{province.uploadRate}% yükleme oranı</Badge>
                            <Progress value={province.uploadRate} className="w-20 h-2" />
                          </div>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                          {province.workshops.map((workshop, workshopIndex) => (
                            <div
                              key={workshopIndex}
                              className="flex items-center justify-between p-3 border rounded-md"
                            >
                              <div className="flex items-center gap-3">
                                {getUploadStatusIcon(workshop.uploaded)}
                                <div>
                                  <div className="font-medium">{workshop.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {workshop.uploaded
                                      ? `${workshop.fileCount} dosya • ${workshop.lastUpload}`
                                      : "Henüz yükleme yapılmadı"}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">{getFileTypesBadges(workshop.fileTypes)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-8">
              <FolderIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Drive takip verisi bulunamadı</h3>
              <p className="text-muted-foreground mb-4">Arama kriterlerinize uygun veri bulunamadı.</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setFilterStatus("all")
                }}
              >
                Filtreleri Temizle
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
