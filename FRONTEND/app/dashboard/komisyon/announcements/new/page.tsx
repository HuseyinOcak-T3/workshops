"use client"

import type React from "react"

import { useRouter } from "next/navigation"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ChevronLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

// Sample workshop data
const workshops = [
  { id: 1, name: "İstanbul - Pendik Atölyesi", region: "Marmara" },
  { id: 2, name: "İstanbul - Kadıköy Atölyesi", region: "Marmara" },
  { id: 3, name: "Ankara - Çankaya Atölyesi", region: "İç Anadolu" },
  { id: 4, name: "İzmir - Bornova Atölyesi", region: "Ege" },
  { id: 5, name: "Antalya - Muratpaşa Atölyesi", region: "Akdeniz" },
  { id: 6, name: "Bursa - Nilüfer Atölyesi", region: "Marmara" },
  { id: 7, name: "Trabzon - Merkez Atölyesi", region: "Karadeniz" },
  { id: 8, name: "Diyarbakır - Merkez Atölyesi", region: "Güneydoğu Anadolu" },
]

export default function NewAnnouncementPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    commission: "",
    target: "all",
    selectedWorkshops: [] as number[],
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

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

    toast({
      title: "Duyuru oluşturuldu",
      description: "Duyurunuz başarıyla oluşturuldu ve yayınlandı.",
    })

    window.location.href = "/dashboard/admin/announcements"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Yeni Duyuru</h1>
          <p className="text-muted-foreground">Yeni bir duyuru oluştur</p>
        </div>

        <Button variant="outline" asChild>
          <Link href="/dashboard/admin/announcements">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Geri Dön
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Duyuru Detayları</CardTitle>
            <CardDescription>Duyuru bilgilerini ve kime gönderileceğini belirleyin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3">
              <Label htmlFor="title">Duyuru Başlığı</Label>
              <Input
                id="title"
                placeholder="Başlık girin"
                required
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="content">Duyuru İçeriği</Label>
              <Textarea
                id="content"
                placeholder="Duyuru içeriğini girin"
                className="min-h-[200px]"
                required
                value={formData.content}
                onChange={(e) => handleChange("content", e.target.value)}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="commission">Komisyon</Label>
              <Select required value={formData.commission} onValueChange={(value) => handleChange("commission", value)}>
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
              <Label>Hedef Atölyeler</Label>
              <RadioGroup
                value={formData.target}
                onValueChange={(value) => handleChange("target", value)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all">Tüm Atölyeler</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="selected" id="selected" />
                  <Label htmlFor="selected">Belirli Atölyeler</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.target === "selected" && (
              <div className="grid gap-3">
                <Label>Atölye Seçimi</Label>
                <Card>
                  <CardContent className="p-4 max-h-[250px] overflow-y-auto">
                    <div className="space-y-4">
                      {workshops.map((workshop) => (
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
                  Seçili Atölye Sayısı: {formData.selectedWorkshops.length} / {workshops.length}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => (window.location.href = "/dashboard/admin/announcements")}
            >
              İptal
            </Button>
            <Button type="submit">Duyuruyu Yayınla</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
