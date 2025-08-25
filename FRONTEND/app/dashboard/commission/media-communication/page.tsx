"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  VideoIcon,
  FolderIcon,
  StarIcon,
  CheckCircleIcon,
  TrendingUpIcon,
  PlusCircleIcon,
  AlertCircleIcon,
} from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function CommissionDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for commission dashboard
  const stats = {
    totalContentWorks: 45,
    activeContentWorks: 12,
    completedContentWorks: 28,
    pendingEvaluations: 8,
    totalWorkshops: 24,
    workshopsWithUploads: 18,
    averageContentQuality: 4.2,
    totalSkillsTracked: 156,
  }

  const recentContentWorks = [
    {
      id: 1,
      title: "Mayıs Ayı Proje Tanıtım Videosu",
      assignedTo: "Tüm Atölyeler",
      dueDate: "2024-05-20",
      status: "active",
      uploadCount: 15,
      totalWorkshops: 24,
    },
    {
      id: 2,
      title: "Bahar Dönemi Fotoğraf Çekimi",
      assignedTo: "İstanbul Bölgesi",
      dueDate: "2024-05-15",
      status: "completed",
      uploadCount: 8,
      totalWorkshops: 8,
    },
    {
      id: 3,
      title: "Öğrenci Röportaj Serisi",
      assignedTo: "Ankara ve İzmir",
      dueDate: "2024-05-25",
      status: "pending",
      uploadCount: 3,
      totalWorkshops: 6,
    },
  ]

  const driveStatus = [
    { province: "İstanbul", uploaded: true, lastUpload: "2024-05-10", fileCount: 12 },
    { province: "Ankara", uploaded: true, lastUpload: "2024-05-09", fileCount: 8 },
    { province: "İzmir", uploaded: false, lastUpload: null, fileCount: 0 },
    { province: "Bursa", uploaded: true, lastUpload: "2024-05-08", fileCount: 6 },
    { province: "Antalya", uploaded: false, lastUpload: null, fileCount: 0 },
  ]

  const contentStatusOverview = [
    { status: "İçerik gönderildi", count: 12, color: "bg-blue-500" },
    { status: "İçerik kontrol ediliyor", count: 8, color: "bg-yellow-500" },
    { status: "İçerik onaylandı", count: 15, color: "bg-green-500" },
    { status: "Kurgu aşamasında", count: 6, color: "bg-purple-500" },
    { status: "Paylaşıldı", count: 28, color: "bg-emerald-500" },
    { status: "Arşivlendi", count: 45, color: "bg-gray-500" },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Medya ve İletişim Komisyonu</h2>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/admin/commission/content-works/new">
            <Button className="gap-1">
              <PlusCircleIcon className="h-4 w-4" />
              Yeni İçerik Çalışması
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="content">İçerik Çalışmaları</TabsTrigger>
          <TabsTrigger value="drive">Drive Takip</TabsTrigger>
          <TabsTrigger value="evaluations">Değerlendirmeler</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam İçerik Çalışması</CardTitle>
                <VideoIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalContentWorks}</div>
                <p className="text-xs text-muted-foreground">{stats.activeContentWorks} aktif çalışma</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Drive Yükleme Oranı</CardTitle>
                <FolderIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((stats.workshopsWithUploads / stats.totalWorkshops) * 100)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.workshopsWithUploads}/{stats.totalWorkshops} atölye
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ortalama Kalite Puanı</CardTitle>
                <StarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageContentQuality}/5</div>
                <p className="text-xs text-muted-foreground">Son değerlendirmeler</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bekleyen Değerlendirme</CardTitle>
                <AlertCircleIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingEvaluations}</div>
                <p className="text-xs text-muted-foreground">Değerlendirme bekliyor</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Son İçerik Çalışmaları</CardTitle>
                <CardDescription>Aktif ve yakın zamanda tamamlanan çalışmalar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentContentWorks.map((work) => (
                    <div key={work.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <div className="font-medium">{work.title}</div>
                        <div className="text-sm text-muted-foreground">
                          Son Tarih: {work.dueDate} • {work.assignedTo}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Yükleme: {work.uploadCount}/{work.totalWorkshops} atölye
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            work.status === "completed" ? "default" : work.status === "active" ? "secondary" : "outline"
                          }
                        >
                          {work.status === "completed" ? "Tamamlandı" : work.status === "active" ? "Aktif" : "Bekliyor"}
                        </Badge>
                        <Progress value={(work.uploadCount / work.totalWorkshops) * 100} className="w-20 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/dashboard/admin/commission/content-works">
                    <Button variant="outline" className="w-full bg-transparent">
                      Tüm İçerik Çalışmalarını Görüntüle
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>İçerik Durumu Özeti</CardTitle>
                <CardDescription>İçeriklerin mevcut durumları</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contentStatusOverview.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className="text-sm">{item.status}</span>
                      </div>
                      <span className="font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/dashboard/admin/commission/content-status">
                    <Button variant="outline" className="w-full bg-transparent">
                      Detaylı Durum Takibi
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Drive Yükleme Durumu</CardTitle>
                <CardDescription>İllere göre Drive klasörü yükleme durumları</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {driveStatus.map((province, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${province.uploaded ? "bg-green-500" : "bg-red-500"}`} />
                        <div>
                          <div className="font-medium">{province.province}</div>
                          <div className="text-sm text-muted-foreground">
                            {province.uploaded ? `Son yükleme: ${province.lastUpload}` : "Henüz yükleme yapılmadı"}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{province.fileCount} dosya</div>
                        <Badge variant={province.uploaded ? "default" : "destructive"}>
                          {province.uploaded ? "Yüklendi" : "Bekleniyor"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/dashboard/admin/commission/drive-tracking">
                    <Button variant="outline" className="w-full bg-transparent">
                      Detaylı Drive Takibi
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Hızlı Erişim</CardTitle>
                <CardDescription>Sık kullanılan komisyon sayfaları</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href="/dashboard/admin/commission/content-works">
                    <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                      <VideoIcon className="h-4 w-4" />
                      İçerik Çalışmaları
                    </Button>
                  </Link>
                  <Link href="/dashboard/admin/commission/drive-tracking">
                    <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                      <FolderIcon className="h-4 w-4" />
                      Drive Takip
                    </Button>
                  </Link>
                  <Link href="/dashboard/admin/commission/evaluations">
                    <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                      <StarIcon className="h-4 w-4" />
                      Atölye Değerlendirme
                    </Button>
                  </Link>
                  <Link href="/dashboard/admin/commission/skills">
                    <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                      <TrendingUpIcon className="h-4 w-4" />
                      Yetenek Yönetimi
                    </Button>
                  </Link>
                  <Link href="/dashboard/admin/commission/content-status">
                    <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                      <CheckCircleIcon className="h-4 w-4" />
                      İçerik Durumu
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>İçerik Çalışmaları Yönetimi</CardTitle>
              <CardDescription>Atölyelere gönderilen içerik çalışmalarını yönetin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <VideoIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">İçerik Çalışmaları</h3>
                <p className="text-muted-foreground mb-4">Detaylı içerik çalışması yönetimi için ayrı sayfaya gidin</p>
                <Link href="/dashboard/admin/commission/content-works">
                  <Button>İçerik Çalışmaları Sayfasına Git</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Drive Klasör Takibi</CardTitle>
              <CardDescription>İllerin Drive klasörlerine yükleme durumlarını takip edin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FolderIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Drive Takip Sistemi</h3>
                <p className="text-muted-foreground mb-4">Detaylı Drive takibi için ayrı sayfaya gidin</p>
                <Link href="/dashboard/admin/commission/drive-tracking">
                  <Button>Drive Takip Sayfasına Git</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evaluations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Atölye Değerlendirmeleri</CardTitle>
              <CardDescription>Tamamlanan içerik çalışmalarının değerlendirmelerini yapın</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <StarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Değerlendirme Sistemi</h3>
                <p className="text-muted-foreground mb-4">Detaylı değerlendirme yönetimi için ayrı sayfaya gidin</p>
                <Link href="/dashboard/admin/commission/evaluations">
                  <Button>Değerlendirme Sayfasına Git</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
