"use client"

import { CardFooter } from "@/components/ui/card"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Eye, MessageSquare, PenSquare, Plus, Search, Trash } from "lucide-react"
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
  {
    id: 4,
    title: "Ulusal Yarışma Kayıtları",
    content:
      "TEKNOFEST 2025 katılımcı takım başvuruları 1 Nisan 2025 tarihine kadar devam edecektir. Tüm atölyelerin yarışma takımlarını belirleyip sisteme giriş yapmaları gerekmektedir.",
    date: "2025-03-02",
    commission: "Takımlar Komisyonu",
    status: "active",
    workshops: "all",
    readCount: 20,
    totalCount: 28,
  },
  {
    id: 5,
    title: "Ocak Ayı Yoklama Bildirimi",
    content: "Ocak ayı yoklama girişleri tüm atölyeler tarafından tamamlanmıştır. Teşekkür ederiz.",
    date: "2025-02-10",
    commission: "Eğitmen Komisyonu",
    status: "archived",
    workshops: "all",
    readCount: 28,
    totalCount: 28,
  },
  {
    id: 6,
    title: "Malzeme Talep Formu",
    content: "Bahar dönemi için malzeme talep formları 15 Mart'a kadar doldurulmalıdır.",
    date: "2025-03-02",
    commission: "Takımlar Komisyonu",
    status: "active",
    workshops: "all",
    readCount: 18,
    totalCount: 28,
  },
  {
    id: 7,
    title: "Eğitmen Değerlendirme Anketi",
    content: "Eğitmen değerlendirme anketleri bursiyerlere gönderilmiştir.",
    date: "2025-02-25",
    commission: "Eğitmen Komisyonu",
    status: "archived",
    workshops: "all",
    readCount: 26,
    totalCount: 28,
  },
]

export default function AnnouncementsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [commission, setCommission] = useState("all")
  const [announcements, setAnnouncements] = useState(announcementsData)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<(typeof announcementsData)[0] | null>(null)

  const handleDeleteAnnouncement = (id: number) => {
    setAnnouncements(announcements.filter((announcement) => announcement.id !== id))

    if (selectedAnnouncement?.id === id) {
      setSelectedAnnouncement(null)
    }

    toast({
      title: "Duyuru silindi",
      description: "Duyuru başarıyla silindi.",
    })
  }

  const handleArchiveAnnouncement = (id: number) => {
    setAnnouncements(
      announcements.map((announcement) =>
        announcement.id === id
          ? { ...announcement, status: announcement.status === "active" ? "archived" : "active" }
          : announcement,
      ),
    )

    if (selectedAnnouncement?.id === id) {
      setSelectedAnnouncement((prev) =>
        prev ? { ...prev, status: prev.status === "active" ? "archived" : "active" } : null,
      )
    }

    toast({
      title: selectedAnnouncement?.status === "active" ? "Duyuru arşivlendi" : "Duyuru aktifleştirildi",
      description:
        selectedAnnouncement?.status === "active"
          ? "Duyuru başarıyla arşivlendi."
          : "Duyuru başarıyla aktifleştirildi.",
    })
  }

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCommission = commission === "all" || announcement.commission === commission
    return matchesSearch && matchesCommission
  })

  const activeAnnouncements = filteredAnnouncements.filter((a) => a.status === "active")
  const archivedAnnouncements = filteredAnnouncements.filter((a) => a.status === "archived")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Duyurular</h1>
          <p className="text-muted-foreground">Tüm komisyon duyurularını görüntüleyin ve yönetin</p>
        </div>

        <Button asChild>
          <Link href="/announcements/new">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Duyuru
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Duyuru Listesi</CardTitle>
            <CardDescription>Tüm duyurular ve detayları</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <div className="px-4 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Duyurularda ara..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="px-4 pb-2">
              <Select value={commission} onValueChange={setCommission}>
                <SelectTrigger>
                  <SelectValue placeholder="Komisyon seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Komisyonlar</SelectItem>
                  <SelectItem value="Eğitmen Komisyonu">Eğitmen Komisyonu</SelectItem>
                  <SelectItem value="Takımlar Komisyonu">Takımlar Komisyonu</SelectItem>
                  <SelectItem value="Eğitim Programları Komisyonu">Eğitim Programları Komisyonu</SelectItem>
                  <SelectItem value="Medya ve İletişim Komisyonu">Medya ve İletişim Komisyonu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs defaultValue="active" className="mt-2">
              <div className="px-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="active">Aktif</TabsTrigger>
                  <TabsTrigger value="archived">Arşiv</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="active" className="mt-0">
                <div className="divide-y">
                  {activeAnnouncements.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-muted-foreground">Aktif duyuru bulunamadı</p>
                    </div>
                  ) : (
                    activeAnnouncements.map((announcement) => (
                      <div
                        key={announcement.id}
                        className={`px-4 py-3 cursor-pointer hover:bg-muted/50 ${selectedAnnouncement?.id === announcement.id ? "bg-muted" : ""}`}
                        onClick={() => setSelectedAnnouncement(announcement)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium">{announcement.title}</div>
                            <div className="text-xs text-muted-foreground mt-1">{announcement.commission}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {new Date(announcement.date).toLocaleDateString("tr-TR")}
                            </div>
                          </div>
                          <Badge variant={announcement.workshops === "all" ? "default" : "outline"}>
                            {announcement.workshops === "all" ? "Tüm Atölyeler" : "Seçili Atölyeler"}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="archived" className="mt-0">
                <div className="divide-y">
                  {archivedAnnouncements.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-muted-foreground">Arşivlenmiş duyuru bulunamadı</p>
                    </div>
                  ) : (
                    archivedAnnouncements.map((announcement) => (
                      <div
                        key={announcement.id}
                        className={`px-4 py-3 cursor-pointer hover:bg-muted/50 ${selectedAnnouncement?.id === announcement.id ? "bg-muted" : ""}`}
                        onClick={() => setSelectedAnnouncement(announcement)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium">{announcement.title}</div>
                            <div className="text-xs text-muted-foreground mt-1">{announcement.commission}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {new Date(announcement.date).toLocaleDateString("tr-TR")}
                            </div>
                          </div>
                          <Badge variant="secondary">Arşivlenmiş</Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          {selectedAnnouncement ? (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedAnnouncement.title}</CardTitle>
                    <CardDescription>
                      {selectedAnnouncement.commission} •{" "}
                      {new Date(selectedAnnouncement.date).toLocaleDateString("tr-TR")}
                    </CardDescription>
                  </div>
                  <Badge variant={selectedAnnouncement.status === "active" ? "default" : "secondary"}>
                    {selectedAnnouncement.status === "active" ? "Aktif" : "Arşivlenmiş"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Duyuru İçeriği</h3>
                  <p className="text-sm text-muted-foreground">{selectedAnnouncement.content}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Hedef</h3>
                    <Badge variant={selectedAnnouncement.workshops === "all" ? "default" : "outline"}>
                      {selectedAnnouncement.workshops === "all" ? "Tüm Atölyeler" : "Seçili Atölyeler"}
                    </Badge>
                    {selectedAnnouncement.workshops === "selected" && (
                      <div className="mt-2">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-3 w-3" />
                          Atölyeleri Görüntüle
                        </Button>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Okunma Durumu</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>
                          {selectedAnnouncement.readCount} / {selectedAnnouncement.totalCount} Atölye
                        </span>
                        <span className="font-medium">
                          %{Math.round((selectedAnnouncement.readCount / selectedAnnouncement.totalCount) * 100)}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${(selectedAnnouncement.readCount / selectedAnnouncement.totalCount) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Atölye Detayları</h3>
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Atölye Bazlı Durumu Görüntüle
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleDeleteAnnouncement(selectedAnnouncement.id)}>
                    <Trash className="mr-2 h-4 w-4" />
                    Duyuruyu Sil
                  </Button>
                  <Button variant="outline" onClick={() => handleArchiveAnnouncement(selectedAnnouncement.id)}>
                    {selectedAnnouncement.status === "active" ? (
                      <>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Arşivle
                      </>
                    ) : (
                      <>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Aktifleştir
                      </>
                    )}
                  </Button>
                </div>

                <Button asChild>
                  <Link href={`/dashboard/superadmin/announcements/${selectedAnnouncement.id}/edit`}>
                    <PenSquare className="mr-2 h-4 w-4" />
                    Düzenle
                  </Link>
                </Button>
              </CardFooter>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[500px] p-6 text-center">
              <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Duyuru Seçilmedi</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Detaylarını görmek için sol taraftan bir duyuru seçin veya yeni bir duyuru oluşturun.
              </p>
              <Button asChild>
                <Link href="/announcements/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Yeni Duyuru Oluştur
                </Link>
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
