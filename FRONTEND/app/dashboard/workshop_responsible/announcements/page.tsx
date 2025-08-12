"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, MessageSquare, Bell, CheckCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Sample announcements data
const announcements = [
  {
    id: 1,
    title: "Proje Şenliği Tarihleri",
    content:
      "Bahar dönemi proje şenliği 15-20 Mayıs 2025 tarihleri arasında gerçekleştirilecektir. Tüm atölyelerin bu tarihlere göre hazırlıklarını tamamlamaları gerekmektedir.",
    date: "2025-03-15",
    commission: "Eğitim Programları Komisyonu",
    status: "unread",
    priority: "high",
  },
  {
    id: 2,
    title: "Özel İçerik Çalışması Kılavuzu",
    content:
      '"Özel İçerik Çalışması" için çekim yönergeleri ve teslim detayları panele yüklenmiştir. Son yükleme tarihi 30 Mart 2025\'tir.',
    date: "2025-03-12",
    commission: "Medya ve İletişim Komisyonu",
    status: "unread",
    priority: "medium",
  },
  {
    id: 3,
    title: "Yoklama Girişleri Hakkında",
    content:
      "Mart ayı yoklama girişleri için son tarih 5 Nisan 2025'tir. Tüm atölye sorumlularının bu tarihe kadar hem bursiyer hem de eğitmen yoklamalarını tamamlamaları gerekmektedir.",
    date: "2025-03-08",
    commission: "Eğitmen Komisyonu",
    status: "read",
    priority: "high",
  },
  {
    id: 4,
    title: "Ulusal Yarışma Kayıtları",
    content:
      "TEKNOFEST 2025 katılımcı takım başvuruları 1 Nisan 2025 tarihine kadar devam edecektir. Tüm atölyelerin yarışma takımlarını belirleyip sisteme giriş yapmaları gerekmektedir.",
    date: "2025-03-02",
    commission: "Takımlar Komisyonu",
    status: "read",
    priority: "medium",
  },
  {
    id: 5,
    title: "Ocak Ayı Yoklama Bildirimi",
    content: "Ocak ayı yoklama girişleri tüm atölyeler tarafından tamamlanmıştır. Teşekkür ederiz.",
    date: "2025-02-10",
    commission: "Eğitmen Komisyonu",
    status: "read",
    priority: "low",
  },
  {
    id: 6,
    title: "Atölye Malzeme İhtiyaç Formu",
    content: "Bahar dönemi için atölye malzeme ihtiyaç listesi formları 15 Mart'a kadar doldurulmalıdır.",
    date: "2025-03-02",
    commission: "Takımlar Komisyonu",
    status: "read",
    priority: "high",
  },
  {
    id: 7,
    title: "Eğitmen Değerlendirme Anketi",
    content:
      "Eğitmen değerlendirme anketleri bursiyerlere gönderilmiştir. Anketlerin doldurulması için son tarih 20 Mart 2025'tir.",
    date: "2025-02-25",
    commission: "Eğitmen Komisyonu",
    status: "read",
    priority: "medium",
  },
]

export default function AnnouncementsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<(typeof announcements)[0] | null>(null)
  const [readStatus, setReadStatus] = useState<Record<number, boolean>>({})

  // Mark announcements as read when selected
  const handleAnnouncementSelect = (announcement: (typeof announcements)[0]) => {
    setSelectedAnnouncement(announcement)
    setReadStatus((prev) => ({ ...prev, [announcement.id]: true }))
  }

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.commission.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const unreadAnnouncements = filteredAnnouncements.filter((a) => a.status === "unread" && !readStatus[a.id])
  const readAnnouncements = filteredAnnouncements.filter((a) => a.status === "read" || readStatus[a.id])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Duyurular</h1>
        <p className="text-muted-foreground">Komisyonlardan gelen duyurular</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Duyuru Listesi</CardTitle>
            <CardDescription>Tüm duyurular ve bildirimler</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="px-4 py-2">
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

            <Tabs defaultValue="unread" className="mt-2">
              <div className="px-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="unread">
                    Okunmamış
                    {unreadAnnouncements.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {unreadAnnouncements.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="read">Okunmuş</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="unread" className="mt-0">
                <ScrollArea className="h-[500px]">
                  <div className="divide-y">
                    {unreadAnnouncements.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <CheckCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">Tüm duyurular okundu</p>
                      </div>
                    ) : (
                      unreadAnnouncements.map((announcement) => (
                        <div
                          key={announcement.id}
                          className={`px-4 py-3 cursor-pointer hover:bg-muted/50 ${selectedAnnouncement?.id === announcement.id ? "bg-muted" : ""}`}
                          onClick={() => handleAnnouncementSelect(announcement)}
                        >
                          <div className="flex items-start gap-2">
                            <div
                              className={`mt-1 h-2 w-2 rounded-full ${announcement.priority === "high" ? "bg-red-500" : announcement.priority === "medium" ? "bg-yellow-500" : "bg-green-500"}`}
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div className="font-medium">{announcement.title}</div>
                                <Bell className="h-3 w-3 text-blue-500 mt-1 ml-2 flex-shrink-0" />
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">{announcement.commission}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {new Date(announcement.date).toLocaleDateString("tr-TR")}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="read" className="mt-0">
                <ScrollArea className="h-[500px]">
                  <div className="divide-y">
                    {readAnnouncements.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <p className="text-muted-foreground">Okunmuş duyuru bulunmuyor</p>
                      </div>
                    ) : (
                      readAnnouncements.map((announcement) => (
                        <div
                          key={announcement.id}
                          className={`px-4 py-3 cursor-pointer hover:bg-muted/50 ${selectedAnnouncement?.id === announcement.id ? "bg-muted" : ""}`}
                          onClick={() => handleAnnouncementSelect(announcement)}
                        >
                          <div className="flex items-start gap-2">
                            <div
                              className={`mt-1 h-2 w-2 rounded-full ${announcement.priority === "high" ? "bg-red-500" : announcement.priority === "medium" ? "bg-yellow-500" : "bg-green-500"}`}
                            />
                            <div className="flex-1">
                              <div className="font-medium">{announcement.title}</div>
                              <div className="text-xs text-muted-foreground mt-1">{announcement.commission}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {new Date(announcement.date).toLocaleDateString("tr-TR")}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
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
                  <Badge
                    variant={
                      selectedAnnouncement.priority === "high"
                        ? "destructive"
                        : selectedAnnouncement.priority === "medium"
                          ? "default"
                          : "outline"
                    }
                  >
                    {selectedAnnouncement.priority === "high"
                      ? "Yüksek Öncelik"
                      : selectedAnnouncement.priority === "medium"
                        ? "Orta Öncelik"
                        : "Düşük Öncelik"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-line">{selectedAnnouncement.content}</p>
                </div>

                {selectedAnnouncement.id === 1 && (
                  <Alert className="mt-6">
                    <MessageSquare className="h-4 w-4" />
                    <AlertTitle>Önemli Bilgilendirme</AlertTitle>
                    <AlertDescription>
                      Proje şenliği için takım listelerini 20 Mart tarihine kadar sisteme giriniz.
                    </AlertDescription>
                  </Alert>
                )}

                {selectedAnnouncement.id === 3 && (
                  <Alert className="mt-6">
                    <MessageSquare className="h-4 w-4" />
                    <AlertTitle>Hatırlatma</AlertTitle>
                    <AlertDescription>
                      Yoklama girişleri için son tarih 5 Nisan 2025'tir. Lütfen zamanında tamamlayınız.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[500px] p-6 text-center">
              <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Duyuru Seçilmedi</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Detaylarını görmek için sol taraftan bir duyuru seçin.
              </p>
              {unreadAnnouncements.length > 0 && (
                <Badge variant="secondary" className="text-sm">
                  {unreadAnnouncements.length} okunmamış duyurunuz var
                </Badge>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
