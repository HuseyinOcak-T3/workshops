"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Eye, MessageSquare, PenSquare, Trash, FileText } from "lucide-react"
import Link from "next/link"

// Sample announcements data
const announcementsData = [
  {
    id: 1,
    title: "Proje Şenliği Tarihleri",
    content:
      "Bahar dönemi proje şenliği 15-20 Mayıs 2025 tarihleri arasında gerçekleştirilecektir. Tüm atölyelerin bu tarihlere göre hazırlıklarını tamamlamaları gerekmektedir.",
    date: "2025-03-15",
    commission: "Eğitim Programları Komisyonu",
    status: "active",
    workshops: "all",
    readCount: 22,
    totalCount: 28,
  },
  {
    id: 2,
    title: "Özel İçerik Çalışması Kılavuzu",
    content:
      '"Özel İçerik Çalışması" için çekim yönergeleri ve teslim detayları panele yüklenmiştir. Son yükleme tarihi 30 Mart 2025\'tir.',
    date: "2025-03-12",
    commission: "Medya ve İletişim Komisyonu",
    status: "active",
    workshops: "selected",
    selectedWorkshops: [1, 2, 4, 6],
    readCount: 15,
    totalCount: 20,
  },
  {
    id: 3,
    title: "Yoklama Girişleri Hakkında",
    content:
      "Mart ayı yoklama girişleri için son tarih 5 Nisan 2025'tir. Tüm atölye sorumlularının bu tarihe kadar hem bursiyer hem de eğitmen yoklamalarını tamamlamaları gerekmektedir.",
    date: "2025-03-08",
    commission: "Eğitmen Komisyonu",
    status: "active",
    workshops: "all",
    readCount: 25,
    totalCount: 28,
  },
]

// Sample workshop read status data
const workshopReadStatusData = [
  { id: 1, name: "İstanbul - Pendik Atölyesi", region: "Marmara", read: true, readDate: "2025-03-15" },
  { id: 2, name: "İstanbul - Kadıköy Atölyesi", region: "Marmara", read: true, readDate: "2025-03-16" },
  { id: 3, name: "Ankara - Çankaya Atölyesi", region: "İç Anadolu", read: true, readDate: "2025-03-15" },
  { id: 4, name: "İzmir - Bornova Atölyesi", region: "Ege", read: false, readDate: null },
  { id: 5, name: "Antalya - Muratpaşa Atölyesi", region: "Akdeniz", read: true, readDate: "2025-03-17" },
  { id: 6, name: "Bursa - Nilüfer Atölyesi", region: "Marmara", read: true, readDate: "2025-03-15" },
  { id: 7, name: "Trabzon - Merkez Atölyesi", region: "Karadeniz", read: false, readDate: null },
  {
    id: 8,
    name: "Diyarbakır - Merkez Atölyesi",
    region: "Güneydoğu Anadolu",
    read: false,
    readDate: null,
  },
]

export default function AnnouncementDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const announcementId = Number(params.id)

  const [announcement, setAnnouncement] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showWorkshops, setShowWorkshops] = useState(false)

  useEffect(() => {
    // Simulate API call to fetch announcement
    const fetchedAnnouncement = announcementsData.find((a) => a.id === announcementId)

    if (fetchedAnnouncement) {
      setAnnouncement(fetchedAnnouncement)
    }

    setLoading(false)
  }, [announcementId])

  const handleDeleteAnnouncement = () => {
    // Simulate API call to delete announcement
    toast({
      title: "Duyuru silindi",
      description: "Duyuru başarıyla silindi.",
    })

    // Redirect back to announcements page
    router.push("/dashboard/superuser/announcements")
  }

  const handleArchiveAnnouncement = () => {
    // Simulate API call to archive/unarchive announcement
    const newStatus = announcement.status === "active" ? "archived" : "active"
    setAnnouncement({ ...announcement, status: newStatus })

    toast({
      title: newStatus === "active" ? "Duyuru aktifleştirildi" : "Duyuru arşivlendi",
      description: newStatus === "active" ? "Duyuru başarıyla aktifleştirildi." : "Duyuru başarıyla arşivlendi.",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!announcement) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <h2 className="text-xl font-semibold mb-2">Duyuru bulunamadı</h2>
        <p className="text-muted-foreground mb-4">İstediğiniz duyuru bulunamadı veya erişim izniniz yok.</p>
        <Button asChild>
          <Link href="/dashboard/superuser/announcements">Duyurulara Dön</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/dashboard/superuser/announcements">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Duyuru Detayı</h1>
            <p className="text-muted-foreground">Duyuru bilgileri ve okunma istatistikleri</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/superadmin/announcements/${announcementId}/edit`}>
              <PenSquare className="mr-2 h-4 w-4" />
              Düzenle
            </Link>
          </Button>
          <Button variant="outline" onClick={handleArchiveAnnouncement}>
            <MessageSquare className="mr-2 h-4 w-4" />
            {announcement.status === "active" ? "Arşivle" : "Aktifleştir"}
          </Button>
          <Button variant="destructive" onClick={handleDeleteAnnouncement}>
            <Trash className="mr-2 h-4 w-4" />
            Sil
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{announcement.title}</CardTitle>
                <CardDescription>
                  {announcement.commission} • {new Date(announcement.date).toLocaleDateString("tr-TR")}
                </CardDescription>
              </div>
              <Badge variant={announcement.status === "active" ? "default" : "secondary"}>
                {announcement.status === "active" ? "Aktif" : "Arşivlenmiş"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Duyuru İçeriği</h3>
              <p className="text-sm text-muted-foreground">{announcement.content}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Hedef</h3>
                <Badge variant={announcement.workshops === "all" ? "default" : "outline"}>
                  {announcement.workshops === "all" ? "Tüm Atölyeler" : "Seçili Atölyeler"}
                </Badge>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Okunma Durumu</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>
                      {announcement.readCount} / {announcement.totalCount} Atölye
                    </span>
                    <span className="font-medium">
                      %{Math.round((announcement.readCount / announcement.totalCount) * 100)}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${(announcement.readCount / announcement.totalCount) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Atölye Detayları</h3>
              <Button variant="outline" size="sm" onClick={() => setShowWorkshops(!showWorkshops)}>
                <Eye className="mr-2 h-4 w-4" />
                {showWorkshops ? "Atölye Detaylarını Gizle" : "Atölye Bazlı Durumu Görüntüle"}
              </Button>
            </div>

            {showWorkshops && (
              <div className="border rounded-lg p-4 mt-2">
                <h4 className="font-medium mb-3">Atölye Bazlı Okunma Durumu</h4>
                <div className="space-y-4">
                  {workshopReadStatusData.map((workshop) => (
                    <div key={workshop.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${workshop.read ? "bg-green-500" : "bg-red-500"}`}></div>
                        <span className="text-sm">{workshop.name}</span>
                        <span className="text-xs text-muted-foreground">({workshop.region})</span>
                      </div>
                      <div className="text-sm">
                        {workshop.read ? (
                          <span className="text-green-600">
                            Okundu: {new Date(workshop.readDate!).toLocaleDateString("tr-TR")}
                          </span>
                        ) : (
                          <span className="text-red-600">Okunmadı</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Duyuru İstatistikleri</CardTitle>
            <CardDescription>Okunma ve etkileşim verileri</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">İlk 24 saat içinde okunma</span>
                <span className="text-sm font-medium">%65</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">İlk 3 gün içinde okunma</span>
                <span className="text-sm font-medium">%82</span>
              </div>
              <Progress value={82} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Toplam okunma</span>
                <span className="text-sm font-medium">
                  %{Math.round((announcement.readCount / announcement.totalCount) * 100)}
                </span>
              </div>
              <Progress value={Math.round((announcement.readCount / announcement.totalCount) * 100)} className="h-2" />
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-3">Bölgesel Okunma Oranları</h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Marmara</span>
                    <span className="font-medium">%90</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>İç Anadolu</span>
                    <span className="font-medium">%85</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Ege</span>
                    <span className="font-medium">%75</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Akdeniz</span>
                    <span className="font-medium">%80</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              Detaylı Rapor İndir
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
