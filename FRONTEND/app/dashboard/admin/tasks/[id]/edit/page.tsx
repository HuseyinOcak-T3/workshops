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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, CalendarIcon, Save } from "lucide-react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
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

// Sample tasks data
const tasksData = [
  {
    id: 1,
    title: "Mart Ayı Yoklama Girişleri",
    description:
      "Mart ayı yoklama girişleri için son tarih 5 Nisan 2025'tir. Tüm atölye sorumlularının bu tarihe kadar hem bursiyer hem de eğitmen yoklamalarını tamamlamaları gerekmektedir.",
    dueDate: "2025-04-05",
    createdDate: "2025-03-08",
    commission: "Eğitmen Komisyonu",
    status: "active",
    completedCount: 18,
    totalCount: 28,
    priority: "high",
    target: "all",
    selectedWorkshops: [],
  },
  {
    id: 2,
    title: "Proje Şenliği Takım Listeleri",
    description: "Bahar dönemi proje şenliği için takım listelerini 20 Mart 2025 tarihine kadar sisteme giriniz.",
    dueDate: "2025-03-20",
    createdDate: "2025-03-01",
    commission: "Eğitim Programları Komisyonu",
    status: "active",
    completedCount: 12,
    totalCount: 28,
    priority: "high",
    target: "all",
    selectedWorkshops: [],
  },
  {
    id: 3,
    title: "Ulusal Yarışma Takım Kayıtları",
    description:
      "TEKNOFEST 2025 katılımcı takım başvuruları 1 Nisan 2025 tarihine kadar devam edecektir. Tüm atölyelerin yarışma takımlarını belirleyip sisteme giriş yapmaları gerekmektedir.",
    dueDate: "2025-04-01",
    createdDate: "2025-03-02",
    commission: "Takımlar Komisyonu",
    status: "active",
    completedCount: 9,
    totalCount: 28,
    priority: "medium",
    target: "all",
    selectedWorkshops: [],
  },
  {
    id: 4,
    title: "Özel İçerik Çalışması",
    description:
      '"Özel İçerik Çalışması" için çekim yönergeleri ve teslim detayları panele yüklenmiştir. Son yükleme tarihi 30 Mart 2025\'tir.',
    dueDate: "2025-03-30",
    createdDate: "2025-03-12",
    commission: "Medya ve İletişim Komisyonu",
    status: "active",
    completedCount: 5,
    totalCount: 20,
    priority: "medium",
    target: "selected",
    selectedWorkshops: [1, 2, 4, 6, 8],
  },
]

export default function EditTaskPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const taskId = Number(params.id)

  const [task, setTask] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: new Date(),
    commission: "",
    status: "active",
    priority: "medium",
    target: "all",
    selectedWorkshops: [] as number[],
  })

  useEffect(() => {
    // Simulate API call to fetch task
    const fetchedTask = tasksData.find((t) => t.id === taskId)

    if (fetchedTask) {
      setTask(fetchedTask)
      setFormData({
        title: fetchedTask.title,
        description: fetchedTask.description,
        dueDate: new Date(fetchedTask.dueDate),
        commission: fetchedTask.commission,
        status: fetchedTask.status,
        priority: fetchedTask.priority,
        target: fetchedTask.target,
        selectedWorkshops: fetchedTask.selectedWorkshops || [],
      })
    }

    setLoading(false)
  }, [taskId])

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

    // Simulate API call to update task
    toast({
      title: "Görev güncellendi",
      description: "Görev başarıyla güncellendi.",
    })

    // Redirect back to tasks page
    router.push("/dashboard/superuser/tasks")
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

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <h2 className="text-xl font-semibold mb-2">Görev bulunamadı</h2>
        <p className="text-muted-foreground mb-4">İstediğiniz görev bulunamadı veya erişim izniniz yok.</p>
        <Button asChild>
          <Link href="/dashboard/superuser/tasks">Görevlere Dön</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/dashboard/superuser/tasks">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Görev Düzenle</h1>
            <p className="text-muted-foreground">Görev bilgilerini güncelleyin</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Görev Bilgileri</CardTitle>
            <CardDescription>Görev içeriğini ve hedef kitlesini düzenleyin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3">
              <Label htmlFor="title">Görev Başlığı</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Görev başlığını girin"
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="description">Görev Açıklaması</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Görev açıklamasını girin"
                className="min-h-[150px]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="due-date">Son Tarih</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dueDate ? format(formData.dueDate, "PPP", { locale: tr }) : <span>Tarih seçin</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dueDate}
                      onSelect={(date) => date && setFormData({ ...formData, dueDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="priority">Öncelik</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Öncelik seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Yüksek</SelectItem>
                    <SelectItem value="medium">Orta</SelectItem>
                    <SelectItem value="low">Düşük</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                  <RadioGroupItem value="completed" id="completed" />
                  <Label htmlFor="completed">Tamamlandı</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-3">
              <Label>Hedef Atölyeler</Label>
              <RadioGroup
                value={formData.target}
                onValueChange={(value) => setFormData({ ...formData, target: value })}
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

            {formData.target === "selected" && (
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
              <Link href="/dashboard/superuser/tasks">İptal</Link>
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
