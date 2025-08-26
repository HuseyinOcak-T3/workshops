"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CheckCircleIcon,
  SearchIcon,
  MoreHorizontalIcon,
  EyeIcon,
  EditIcon,
  ClockIcon,
  PlayIcon,
  ArchiveIcon,
  XCircleIcon,
  SendIcon,
  FileCheckIcon,
} from "lucide-react"

export default function ContentStatusPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterWorkshop, setFilterWorkshop] = useState("all")

  // Mock datalar
  const contentItems = [
    {
      id: 1,
      title: "Mayıs Ayı Proje Tanıtım Videosu - İstanbul Kadıköy",
      workshopName: "İstanbul Kadıköy Atölyesi",
      contentWorkTitle: "Mayıs Ayı Proje Tanıtım Videosu",
      submittedDate: "2024-05-12",
      status: "approved",
      statusHistory: [
        { status: "sent", date: "2024-05-12 09:00", note: "İçerik atölyeden alındı" },
        { status: "checking", date: "2024-05-12 14:30", note: "Kalite kontrol başlatıldı" },
        { status: "approved", date: "2024-05-13 10:15", note: "İçerik onaylandı, kurguya hazır" },
      ],
      fileCount: 5,
      fileTypes: ["video", "photo"],
      priority: "high",
      assignedEditor: "Ahmet Yılmaz",
    },
    {
      id: 2,
      title: "Bahar Dönemi Fotoğraf Çekimi - Ankara Çankaya",
      workshopName: "Ankara Çankaya Atölyesi",
      contentWorkTitle: "Bahar Dönemi Fotoğraf Çekimi",
      submittedDate: "2024-05-10",
      status: "shared",
      statusHistory: [
        { status: "sent", date: "2024-05-10 11:00", note: "İçerik teslim alındı" },
        { status: "checking", date: "2024-05-10 15:20", note: "İçerik inceleme aşamasında" },
        { status: "approved", date: "2024-05-11 09:30", note: "Fotoğraflar onaylandı" },
        { status: "editing", date: "2024-05-11 14:00", note: "Renk düzeltme işlemi başlatıldı" },
        { status: "shared", date: "2024-05-12 16:45", note: "Sosyal medyada paylaşıldı" },
      ],
      fileCount: 8,
      fileTypes: ["photo"],
      priority: "medium",
      assignedEditor: "Fatma Demir",
    },
    {
      id: 3,
      title: "Öğrenci Röportaj Serisi - İzmir Bornova",
      workshopName: "İzmir Bornova Atölyesi",
      contentWorkTitle: "Öğrenci Röportaj Serisi",
      submittedDate: "2024-05-08",
      status: "checking",
      statusHistory: [
        { status: "sent", date: "2024-05-08 13:20", note: "Video dosyaları alındı" },
        { status: "checking", date: "2024-05-09 10:00", note: "Ses kalitesi kontrol ediliyor" },
      ],
      fileCount: 2,
      fileTypes: ["video"],
      priority: "low",
      assignedEditor: "Mehmet Kaya",
    },
    {
      id: 4,
      title: "Yaz Dönemi Hazırlık - Bursa Nilüfer",
      workshopName: "Bursa Nilüfer Atölyesi",
      contentWorkTitle: "Yaz Dönemi Hazırlık Çekimleri",
      submittedDate: "2024-05-09",
      status: "editing",
      statusHistory: [
        { status: "sent", date: "2024-05-09 08:30", note: "İçerik teslim alındı" },
        { status: "checking", date: "2024-05-09 11:15", note: "Kalite kontrol tamamlandı" },
        { status: "approved", date: "2024-05-09 16:20", note: "Montaj için onaylandı" },
        { status: "editing", date: "2024-05-10 09:00", note: "Video montaj işlemi başlatıldı" },
      ],
      fileCount: 12,
      fileTypes: ["video", "photo"],
      priority: "high",
      assignedEditor: "Ayşe Kara",
    },
    {
      id: 5,
      title: "Proje Sergisi Tanıtım - Antalya Muratpaşa",
      workshopName: "Antalya Muratpaşa Atölyesi",
      contentWorkTitle: "Proje Sergisi Tanıtım Videosu",
      submittedDate: "2024-05-07",
      status: "archived",
      statusHistory: [
        { status: "sent", date: "2024-05-07 14:00", note: "İçerik alındı" },
        { status: "checking", date: "2024-05-07 16:30", note: "Kalite kontrol yapıldı" },
        { status: "approved", date: "2024-05-08 09:00", note: "Montaj için onaylandı" },
        { status: "editing", date: "2024-05-08 11:00", note: "Video montaj tamamlandı" },
        { status: "shared", date: "2024-05-08 15:30", note: "Sosyal medyada paylaşıldı" },
        { status: "archived", date: "2024-05-09 10:00", note: "Arşive taşındı" },
      ],
      fileCount: 6,
      fileTypes: ["video"],
      priority: "medium",
      assignedEditor: "Can Özkan",
    },
    {
      id: 6,
      title: "Teknoloji Fuarı Çekimi - İstanbul Üsküdar",
      workshopName: "İstanbul Üsküdar Atölyesi",
      contentWorkTitle: "Teknoloji Fuarı Çekimi",
      submittedDate: "2024-05-11",
      status: "cancelled",
      statusHistory: [
        { status: "sent", date: "2024-05-11 10:00", note: "İçerik teslim alındı" },
        { status: "checking", date: "2024-05-11 14:00", note: "Kalite kontrol başlatıldı" },
        { status: "cancelled", date: "2024-05-12 09:00", note: "Teknik sorunlar nedeniyle iptal edildi" },
      ],
      fileCount: 3,
      fileTypes: ["video"],
      priority: "low",
      assignedEditor: null,
    },
  ]

  const statusConfig = {
    sent: {
      label: "İçerik Gönderildi",
      color: "bg-blue-500",
      icon: SendIcon,
      description: "İçerik atölyeden alındı ve sisteme yüklendi",
    },
    checking: {
      label: "İçerik Kontrol Ediliyor",
      color: "bg-yellow-500",
      icon: ClockIcon,
      description: "Kalite kontrol ve inceleme aşamasında",
    },
    approved: {
      label: "İçerik Onaylandı",
      color: "bg-green-500",
      icon: CheckCircleIcon,
      description: "İçerik onaylandı ve bir sonraki aşamaya hazır",
    },
    editing: {
      label: "Kurgu Aşamasında",
      color: "bg-purple-500",
      icon: EditIcon,
      description: "Video montaj veya fotoğraf düzenleme işlemi devam ediyor",
    },
    shared: {
      label: "Paylaşıldı",
      color: "bg-emerald-500",
      icon: PlayIcon,
      description: "İçerik sosyal medyada veya web sitesinde paylaşıldı",
    },
    archived: {
      label: "Arşivlendi",
      color: "bg-gray-500",
      icon: ArchiveIcon,
      description: "İçerik arşive taşındı",
    },
    cancelled: {
      label: "İptal Edildi",
      color: "bg-red-500",
      icon: XCircleIcon,
      description: "İçerik iptal edildi veya reddedildi",
    },
  }

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig]
    if (!config) return <Badge variant="outline">{status}</Badge>

    const IconComponent = config.icon
    return (
      <Badge variant="outline" className="gap-1">
        <div className={`w-2 h-2 rounded-full ${config.color}`} />
        {config.label}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Yüksek</Badge>
      case "medium":
        return <Badge variant="secondary">Orta</Badge>
      case "low":
        return <Badge variant="outline">Düşük</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getFileTypesBadges = (fileTypes: string[]) => {
    return fileTypes.map((type, index) => (
      <Badge key={index} variant="outline" className="text-xs">
        {type === "video" ? "Video" : type === "photo" ? "Fotoğraf" : type}
      </Badge>
    ))
  }

  const updateContentStatus = (contentId: number, newStatus: string) => {
    // API call would be made here
    console.log(`Updating content ${contentId} to status: ${newStatus}`)
  }

  const filteredContent = contentItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.workshopName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || item.status === filterStatus
    const matchesWorkshop = filterWorkshop === "all" || item.workshopName.includes(filterWorkshop)
    return matchesSearch && matchesStatus && matchesWorkshop
  })

  const getStatusStats = () => {
    const stats: { [key: string]: number } = {}
    Object.keys(statusConfig).forEach((status) => {
      stats[status] = contentItems.filter((item) => item.status === status).length
    })
    return stats
  }

  const statusStats = getStatusStats()

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">İçerik Durumu Takibi</h2>
          <p className="text-muted-foreground">
            Gönderilen içeriklerin durumlarını takip edin ve yönetin (Sadece komisyon görünümü)
          </p>
        </div>
      </div>

      {/* Status Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(statusConfig)
          .slice(0, 4)
          .map(([status, config]) => {
            const IconComponent = config.icon
            return (
              <Card key={status}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{config.label}</CardTitle>
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statusStats[status] || 0}</div>
                  <p className="text-xs text-muted-foreground">{config.description}</p>
                </CardContent>
              </Card>
            )
          })}
      </div>

      {/* Additional Status Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(statusConfig)
          .slice(4)
          .map(([status, config]) => {
            const IconComponent = config.icon
            return (
              <Card key={status}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{config.label}</CardTitle>
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statusStats[status] || 0}</div>
                  <p className="text-xs text-muted-foreground">{config.description}</p>
                </CardContent>
              </Card>
            )
          })}
      </div>

      {/* Content Status Table */}
      <Card>
        <CardHeader>
          <CardTitle>İçerik Durumu Listesi</CardTitle>
          <CardDescription>Tüm içeriklerin mevcut durumlarını görüntüleyin ve yönetin</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="İçerik veya atölye ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Durum filtrele" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <SelectItem key={status} value={status}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterWorkshop} onValueChange={setFilterWorkshop}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Atölye filtrele" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Atölyeler</SelectItem>
                <SelectItem value="İstanbul">İstanbul</SelectItem>
                <SelectItem value="Ankara">Ankara</SelectItem>
                <SelectItem value="İzmir">İzmir</SelectItem>
                <SelectItem value="Bursa">Bursa</SelectItem>
                <SelectItem value="Antalya">Antalya</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>İçerik</TableHead>
                  <TableHead>Atölye</TableHead>
                  <TableHead>Gönderim Tarihi</TableHead>
                  <TableHead>Dosya Bilgisi</TableHead>
                  <TableHead>Öncelik</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Editör</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContent.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium line-clamp-1">{item.title}</div>
                        <div className="text-sm text-muted-foreground">{item.contentWorkTitle}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{item.workshopName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{item.submittedDate}</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{item.fileCount} dosya</div>
                        <div className="flex gap-1">{getFileTypesBadges(item.fileTypes)}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">{item.assignedEditor || "Atanmadı"}</div>
                    </TableCell>
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
                          <DropdownMenuItem>
                            <EyeIcon className="mr-2 h-4 w-4" />
                            Detayları Görüntüle
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Durum Değiştir</DropdownMenuLabel>
                          {Object.entries(statusConfig).map(([status, config]) => {
                            if (status === item.status) return null
                            const IconComponent = config.icon
                            return (
                              <DropdownMenuItem key={status} onClick={() => updateContentStatus(item.id, status)}>
                                <IconComponent className="mr-2 h-4 w-4" />
                                {config.label}
                              </DropdownMenuItem>
                            )
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredContent.length === 0 && (
            <div className="text-center py-8">
              <FileCheckIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">İçerik bulunamadı</h3>
              <p className="text-muted-foreground mb-4">Arama kriterlerinize uygun içerik bulunamadı.</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setFilterStatus("all")
                  setFilterWorkshop("all")
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
