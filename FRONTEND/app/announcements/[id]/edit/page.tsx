"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

// Sample workshops data
const workshopsData = [
  { id: 1, name: "İstanbul - Pendik Atölyesi", region: "Marmara" },
  { id: 2, name: "İstanbul - Kadıköy Atölyesi", region: "Marmara" },
  { id: 3, name: "Ankara - Çankaya Atölyesi", region: "İç Anadolu" },
  { id: 4, name: "İzmir - Bornova Atölyesi", region: "Ege" },
  { id: 5, name: "Antalya - Muratpaşa Atölyesi", region: "Akdeniz" },
  { id: 6, name: "Bursa - Nilüfer Atölyesi", region: "Marmara" },
  { id: 7, name: "Trabzon - Merkez Atölyesi", region: "Karadeniz" },
  { id: 8, name: "Diyarbakır - Merkez Atölyesi", region: "Güneydoğu Anadolu" },
]

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

export default function EditAnnouncementPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const announcementId = Number(params.id)

  const [announcement, setAnnouncement] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    commission: "",
    status: "active",
    workshops: "all",
    selectedWorkshops: [] as number[],
  })

  useEffect(() => {
    // Simulate API call to fetch announcement
    const fetchedAnnouncement = announcementsData.find((a) => a.id === announcementId)

    if (fetchedAnnouncement) {
      setAnnouncement(fetchedAnnouncement)
      setFormData({
        title: fetchedAnnouncement.title,
        content: fetchedAnnouncement.content,
        commission: fetchedAnnouncement.commission,
        status: fetchedAnnouncement.status,
        workshops: fetchedAnnouncement.workshops,
        selectedWorkshops: fetchedAnnouncement.selectedWorkshops || [],
      })
    }

    setLoading(false)
  }, [announcementId])

  const handleWorkshopToggle = (workshopId: number) => {
    setFormData((prev) => {
      const isSelected = prev.selectedWorkshops.includes(workshopId)
      return {
        ...prev,
        selectedWorkshops: isSelected
          ? prev.selectedWorkshops.filter((id) => id !== workshopId)
          : [...prev.selectedWorkshops, workshopId],
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simulate API call to update announcement
    toast({
      title: "Duyuru güncellendi",
      description: "Duyuru başarıyla güncellendi.",
    })

    // Redirect back to announcements page
    router.push("/dashboard/superuser/announcements")
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
            <h1 className="text-3xl font-bold tracking-tight">Duyuru Düzenle</h1>
            <p className="text-muted-foreground">Duyuru bilgilerini güncelleyin</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Duyuru Bilgileri</CardTitle>
            <CardDescription>Duyuru içeriğini ve hedef kitlesini düzenleyin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3">
              <Label htmlFor="title">Duyuru Başlığı</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Duyuru başlığını girin"
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="content">Duyuru İçeriği</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Duyuru içeriğini girin"
                className="min-h-[150px]"
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="commission">Komisyon</Label>
              <Select
                value={formData.commission}
                onValueChange={(value) => setFormData({ ...formData, commission: value })}
              >
                <SelectTrigger id="commission">
                  <SelectValue placeholder="Komisyon seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Eğitmen Komisyonu">Eğitmen Komisyonu</SelectItem>
                  <SelectItem value="Takımlar Komisyonu">Takımlar Komisyonu</SelectItem>
                  <SelectItem value="Eğitim Programları Komisyonu">Eğitim Programları Komisyonu</SelectItem>
                  <SelectItem value="Medya ve İletişim Komisyonu">Medya ve İletişim Komisyonu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3">
              <Label>Durum</Label>
              <RadioGroup
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="active" id="active" />
                  <Label htmlFor="active">Aktif</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="archived" id="archived" />
                  <Label htmlFor="archived">Arşivlenmiş</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-3">
              <Label>Hedef Atölyeler</Label>
              <RadioGroup
                value={formData.workshops}
                onValueChange={(value) => setFormData({ ...formData, workshops: value })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all-workshops" />
                  <Label htmlFor="all-workshops">Tüm Atölyeler</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="selected" id="selected-workshops" />
                  <Label htmlFor="selected-workshops">Belirli Atölyeler</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.workshops === "selected" && (
              <div className="grid gap-3">
                <Label>Atölye Seçimi</Label>
                <Card>
                  <CardContent className="p-4 max-h-[200px] overflow-y-auto">
                    <div className="space-y-4">
                      {workshopsData.map((workshop) => (
                        <div key={workshop.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`workshop-${workshop.id}`}
                            checked={formData.selectedWorkshops.includes(workshop.id)}
                            onCheckedChange={() => handleWorkshopToggle(workshop.id)}
                          />
                          <Label htmlFor={`workshop-${workshop.id}`} className="text-sm">
                            {workshop.name}
                            <span className="ml-2 text-xs text-muted-foreground">({workshop.region})</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <div className="text-sm text-muted-foreground">
                  Seçili Atölye Sayısı: {formData.selectedWorkshops.length} / {workshopsData.length}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/dashboard/superuser/announcements">İptal</Link>
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Değişiklikleri Kaydet
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
