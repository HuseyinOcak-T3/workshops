"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Eye, PenSquare, Plus, Search, Trash } from "lucide-react"
import Link from "next/link"

// Sample announcements data
const announcements = [
  {
    id: 1,
    title: "Proje Şenliği Tarihleri",
    content:
      "Bahar dönemi proje şenliği 15-20 Mayıs 2025 tarihleri arasında gerçekleştirilecektir. Tüm atölyelerin bu tarihlere göre hazırlıklarını tamamlamaları gerekmektedir.",
    date: "2025-03-15",
    commission: "Eğitim Programları Komisyonu",
    status: "active",
    workshops: "all",
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
  },
  {
    id: 5,
    title: "Ocak Ayı Yoklama Bildirimi",
    content: "Ocak ayı yoklama girişleri tüm atölyeler tarafından tamamlanmıştır. Teşekkür ederiz.",
    date: "2025-02-10",
    commission: "Eğitmen Komisyonu",
    status: "archived",
    workshops: "all",
  },
]

export default function AnnouncementsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [commission, setCommission] = useState("all")

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCommission = commission === "all" || announcement.commission.includes(commission)
    return matchesSearch && matchesCommission
  })

  const activeAnnouncements = filteredAnnouncements.filter((a) => a.status === "active")
  const archivedAnnouncements = filteredAnnouncements.filter((a) => a.status === "archived")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Duyurular</h1>
          <p className="text-muted-foreground">Komisyon duyurularını yönetin</p>
        </div>

        <Button asChild>
          <Link href="/dashboard/admin/announcements/new">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Duyuru
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Duyuru Listesi</CardTitle>
          <CardDescription>Tüm duyurular ve detayları</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Duyurularda ara..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-[200px]">
                <Select value={commission} onValueChange={setCommission}>
                  <SelectTrigger>
                    <SelectValue placeholder="Komisyon seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Komisyonlar</SelectItem>
                    <SelectItem value="Eğitmen Komisyonu">Eğitmen Komisyonu</SelectItem>
                    <SelectItem value="Takımlar Komisyonu">Takımlar Komisyonu</SelectItem>
                    <SelectItem value="Eğitim Programları">Eğitim Programları</SelectItem>
                    <SelectItem value="Medya ve İletişim">Medya ve İletişim</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs defaultValue="active">
              <TabsList className="grid grid-cols-2 w-[200px]">
                <TabsTrigger value="active">Aktif</TabsTrigger>
                <TabsTrigger value="archived">Arşiv</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-6">
                {activeAnnouncements.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">Aktif duyuru bulunamadı</div>
                ) : (
                  <div className="space-y-4">
                    {activeAnnouncements.map((announcement) => (
                      <Card key={announcement.id}>
                        <CardContent className="p-4">
                          <div className="grid gap-4">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{announcement.title}</div>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" asChild>
                                  <Link href={`/dashboard/commission/announcements/${announcement.id}`}>
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">Görüntüle</span>
                                  </Link>
                                </Button>
                                <Button variant="ghost" size="icon" asChild>
                                  <Link href={`/dashboard/commission/announcements/${announcement.id}/edit`}>
                                    <PenSquare className="h-4 w-4" />
                                    <span className="sr-only">Düzenle</span>
                                  </Link>
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Trash className="h-4 w-4" />
                                  <span className="sr-only">Sil</span>
                                </Button>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground line-clamp-2">{announcement.content}</div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{announcement.commission}</Badge>
                                <Badge variant="secondary">
                                  {announcement.workshops === "all" ? "Tüm Atölyeler" : "Seçili Atölyeler"}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(announcement.date).toLocaleDateString("tr-TR")}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="archived" className="mt-6">
                {archivedAnnouncements.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">Arşivlenmiş duyuru bulunamadı</div>
                ) : (
                  <div className="space-y-4">
                    {archivedAnnouncements.map((announcement) => (
                      <Card key={announcement.id}>
                        <CardContent className="p-4">
                          <div className="grid gap-4">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{announcement.title}</div>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" asChild>
                                  <Link href={`/dashboard/commission/announcements/${announcement.id}`}>
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">Görüntüle</span>
                                  </Link>
                                </Button>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground line-clamp-2">{announcement.content}</div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{announcement.commission}</Badge>
                                <Badge variant="secondary">
                                  {announcement.workshops === "all" ? "Tüm Atölyeler" : "Seçili Atölyeler"}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(announcement.date).toLocaleDateString("tr-TR")}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
