"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

// Workshop data type
type Workshop = {
  id: number
  name: string
  city: string
  district: string
  region: string
  address: string
  phone: string
  email: string
  scholarCount: number
  trainerCount: number
  taskCompletion: number
  status: "active" | "inactive" | "maintenance"
  description: string
  foundedAt: string
  lastMaintenance: string
}

// Sample workshop data
const workshopData: Workshop[] = [
  {
    id: 1,
    name: "Pendik Atölyesi",
    city: "İstanbul",
    district: "Pendik",
    region: "Marmara",
    address: "Batı Mah. Erol Kaya Cad. No:42 Pendik/İstanbul",
    phone: "+90 216 555 1234",
    email: "pendik@deneyap.org",
    scholarCount: 24,
    trainerCount: 3,
    taskCompletion: 95,
    status: "active",
    description:
      "Pendik Deneyap Atölyesi, 2019 yılında kurulmuş olup, robotik, kodlama ve yapay zeka alanlarında eğitim vermektedir.",
    foundedAt: "2019-05-15",
    lastMaintenance: "2023-08-10",
  },
  {
    id: 2,
    name: "Kadıköy Atölyesi",
    city: "İstanbul",
    district: "Kadıköy",
    region: "Marmara",
    address: "Caferağa Mah. Moda Cad. No:120 Kadıköy/İstanbul",
    phone: "+90 216 555 5678",
    email: "kadikoy@deneyap.org",
    scholarCount: 28,
    trainerCount: 4,
    taskCompletion: 88,
    status: "active",
    description:
      "Kadıköy Deneyap Atölyesi, 2020 yılında kurulmuş olup, elektronik, kodlama ve 3D tasarım alanlarında eğitim vermektedir.",
    foundedAt: "2020-02-20",
    lastMaintenance: "2023-07-05",
  },
  // Diğer atölyeler...
]

export default function EditWorkshopPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<Workshop>>({
    name: "",
    city: "",
    district: "",
    region: "",
    address: "",
    phone: "",
    email: "",
    status: "active",
    description: "",
  })

  useEffect(() => {
    // Simulating API call to get workshop details
    const workshopId = Number(params.id)
    const foundWorkshop = workshopData.find((w) => w.id === workshopId)

    if (foundWorkshop) {
      setFormData(foundWorkshop)
    }

    setLoading(false)
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    // Simulating API call to update workshop
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Atölye güncellendi",
      description: `${formData.name} başarıyla güncellendi.`,
    })

    setSaving(false)
    router.push(`/dashboard/superuser/workshops/${params.id}`)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Yükleniyor...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="outline" size="sm" asChild className="mb-4">
          <Link href={`/dashboard/superadmin/workshops/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Atölye Detaylarına Dön
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Atölye Düzenle</h1>
        <p className="text-muted-foreground">Atölye bilgilerini güncelleyin</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Temel Bilgiler</CardTitle>
              <CardDescription>Atölyenin temel bilgilerini düzenleyin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Atölye Adı</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Durum</Label>
                  <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Durum seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="inactive">Pasif</SelectItem>
                      <SelectItem value="maintenance">Bakımda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">Şehir</Label>
                  <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">İlçe</Label>
                  <Input id="district" name="district" value={formData.district} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Bölge</Label>
                  <Select value={formData.region} onValueChange={(value) => handleSelectChange("region", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Bölge seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Marmara">Marmara</SelectItem>
                      <SelectItem value="Ege">Ege</SelectItem>
                      <SelectItem value="Akdeniz">Akdeniz</SelectItem>
                      <SelectItem value="İç Anadolu">İç Anadolu</SelectItem>
                      <SelectItem value="Karadeniz">Karadeniz</SelectItem>
                      <SelectItem value="Doğu Anadolu">Doğu Anadolu</SelectItem>
                      <SelectItem value="Güneydoğu Anadolu">Güneydoğu Anadolu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adres</Label>
                <Textarea id="address" name="address" value={formData.address} onChange={handleChange} required />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>İletişim Bilgileri</CardTitle>
              <CardDescription>Atölyenin iletişim bilgilerini düzenleyin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Açıklama</CardTitle>
              <CardDescription>Atölye hakkında detaylı bilgi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="min-h-[150px]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-4">
              <Button variant="outline" asChild>
                <Link href={`/dashboard/superadmin/workshops/${params.id}`}>İptal</Link>
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>Kaydediliyor...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Değişiklikleri Kaydet
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}
