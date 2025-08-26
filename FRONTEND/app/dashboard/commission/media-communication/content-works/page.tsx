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
import {
  PlusCircleIcon,
  SearchIcon,
  MoreHorizontalIcon,
  DownloadIcon,
  EyeIcon,
  EditIcon,
  TrashIcon,
  FileTextIcon,
  CalendarIcon,
  UsersIcon,
} from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

export default function ContentWorksPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Mock datalar
  const contentWorks = [
    {
      id: 1,
      title: "Mayıs Ayı Proje Tanıtım Videosu",
      description: "Atölyelerin Mayıs ayında gerçekleştirdiği projelerin tanıtım videoları",
      assignedTo: "Tüm Atölyeler",
      assignedWorkshops: 24,
      dueDate: "2024-05-20",
      createdDate: "2024-05-01",
      status: "active",
      uploadCount: 15,
      pdfAttached: true,
      driveLink: "https://drive.google.com/folder/example1",
      lastUploadDate: "2024-05-12",
    },
    {
      id: 2,
      title: "Bahar Dönemi Fotoğraf Çekimi",
      description: "Bahar döneminde gerçekleştirilen etkinliklerin fotoğraf çekimi",
      assignedTo: "İstanbul Bölgesi",
      assignedWorkshops: 8,
      dueDate: "2024-05-15",
      createdDate: "2024-04-25",
      status: "completed",
      uploadCount: 8,
      pdfAttached: true,
      driveLink: "https://drive.google.com/folder/example2",
      lastUploadDate: "2024-05-14",
    },
    {
      id: 3,
      title: "Öğrenci Röportaj Serisi",
      description: "Başarılı öğrencilerle yapılacak röportaj çekimleri",
      assignedTo: "Ankara ve İzmir",
      assignedWorkshops: 6,
      dueDate: "2024-05-25",
      createdDate: "2024-05-05",
      status: "pending",
      uploadCount: 3,
      pdfAttached: false,
      driveLink: "https://drive.google.com/folder/example3",
      lastUploadDate: "2024-05-10",
    },
    {
      id: 4,
      title: "Yaz Dönemi Hazırlık Çekimleri",
      description: "Yaz dönemine hazırlık kapsamında yapılacak tanıtım çekimleri",
      assignedTo: "Güney Bölgesi",
      assignedWorkshops: 12,
      dueDate: "2024-06-01",
      createdDate: "2024-05-10",
      status: "draft",
      uploadCount: 0,
      pdfAttached: true,
      driveLink: "https://drive.google.com/folder/example4",
      lastUploadDate: null,
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
      case "draft":
        return <Badge variant="destructive">Taslak</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredWorks = contentWorks.filter((work) => {
    const matchesSearch =
      work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      work.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || work.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">İçerik Çalışmaları</h2>
          <p className="text-muted-foreground">Atölyelere gönderilen içerik çalışmalarını yönetin ve takip edin</p>
        </div>
        <Link href="/dashboard/admin/commission/content-works/new">
          <Button className="gap-1">
            <PlusCircleIcon className="h-4 w-4" />
            Yeni İçerik Çalışması
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Çalışma</CardTitle>
            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contentWorks.length}</div>
            <p className="text-xs text-muted-foreground">
              {contentWorks.filter((w) => w.status === "active").length} aktif
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tamamlanan</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contentWorks.filter((w) => w.status === "completed").length}</div>
            <p className="text-xs text-muted-foreground">Bu ay</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Atölye</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contentWorks.reduce((sum, work) => sum + work.assignedWorkshops, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Atanan atölye sayısı</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ortalama Tamamlanma</CardTitle>
            <DownloadIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                contentWorks.reduce((sum, work) => sum + (work.uploadCount / work.assignedWorkshops) * 100, 0) /
                  contentWorks.length,
              )}
              %
            </div>
            <p className="text-xs text-muted-foreground">Yükleme oranı</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>İçerik Çalışmaları Listesi</CardTitle>
          <CardDescription>Tüm içerik çalışmalarını görüntüleyin, düzenleyin ve yönetin</CardDescription>
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
                <DropdownMenuItem onClick={() => setFilterStatus("draft")}>Taslak</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Content Works Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>İçerik Çalışması</TableHead>
                  <TableHead>Atanan Atölyeler</TableHead>
                  <TableHead>Son Tarih</TableHead>
                  <TableHead>Yükleme Durumu</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Son Yükleme</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorks.map((work) => (
                  <TableRow key={work.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{work.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">{work.description}</div>
                        <div className="flex items-center gap-2 mt-1">
                          {work.pdfAttached && (
                            <Badge variant="outline" className="text-xs">
                              PDF Eklendi
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            Drive Bağlantısı
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{work.assignedTo}</div>
                        <div className="text-sm text-muted-foreground">{work.assignedWorkshops} atölye</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{work.dueDate}</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>
                            {work.uploadCount}/{work.assignedWorkshops}
                          </span>
                          <span>{Math.round((work.uploadCount / work.assignedWorkshops) * 100)}%</span>
                        </div>
                        <Progress value={(work.uploadCount / work.assignedWorkshops) * 100} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(work.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">{work.lastUploadDate || "Henüz yükleme yok"}</div>
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
                            Görüntüle
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <EditIcon className="mr-2 h-4 w-4" />
                            Düzenle
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <DownloadIcon className="mr-2 h-4 w-4" />
                            Drive'ı Aç
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <TrashIcon className="mr-2 h-4 w-4" />
                            Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredWorks.length === 0 && (
            <div className="text-center py-8">
              <FileTextIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">İçerik çalışması bulunamadı</h3>
              <p className="text-muted-foreground mb-4">Arama kriterlerinize uygun içerik çalışması bulunamadı.</p>
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
