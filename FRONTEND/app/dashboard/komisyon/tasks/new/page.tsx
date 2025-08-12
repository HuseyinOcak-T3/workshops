"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CalendarIcon, ArrowLeftIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function NewTaskPage() {
  const [date, setDate] = useState<Date>()
  const [assignmentType, setAssignmentType] = useState("all")
  const [selectedWorkshops, setSelectedWorkshops] = useState<string[]>([])

  // Örnek atölyeler
  const workshops = [
    { id: "1", name: "İstanbul Kadıköy Atölyesi", region: "İstanbul" },
    { id: "2", name: "İstanbul Beşiktaş Atölyesi", region: "İstanbul" },
    { id: "3", name: "Ankara Çankaya Atölyesi", region: "Ankara" },
    { id: "4", name: "İzmir Bornova Atölyesi", region: "İzmir" },
    { id: "5", name: "Bursa Nilüfer Atölyesi", region: "Bursa" },
    { id: "6", name: "Antalya Muratpaşa Atölyesi", region: "Antalya" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form gönderme işlemi burada yapılacak
    console.log("Form submitted")
  }

  const toggleWorkshop = (workshopId: string) => {
    if (selectedWorkshops.includes(workshopId)) {
      setSelectedWorkshops(selectedWorkshops.filter((id) => id !== workshopId))
    } else {
      setSelectedWorkshops([...selectedWorkshops, workshopId])
    }
  }

  const selectAllWorkshops = () => {
    setSelectedWorkshops(workshops.map((w) => w.id))
  }

  const clearWorkshops = () => {
    setSelectedWorkshops([])
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/admin/tasks">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Yeni Görev Oluştur</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Görev Bilgileri</CardTitle>
              <CardDescription>Görev detaylarını ve atanacak atölyeleri belirleyin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Görev Başlığı</Label>
                <Input id="title" placeholder="Görev başlığını girin" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Görev Açıklaması</Label>
                <Textarea
                  id="description"
                  placeholder="Görev açıklamasını detaylı bir şekilde yazın"
                  className="min-h-32"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="commission">Komisyon</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Komisyon seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="education">Eğitim Komisyonu</SelectItem>
                      <SelectItem value="technical">Teknik Komisyon</SelectItem>
                      <SelectItem value="content">İçerik Komisyonu</SelectItem>
                      <SelectItem value="management">Yönetim Komisyonu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Öncelik</Label>
                  <Select>
                    <SelectTrigger>
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
              <div className="space-y-2">
                <Label>Son Tarih</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Tarih seçin"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Atölye Ataması</CardTitle>
              <CardDescription>Görevi atayacağınız atölyeleri seçin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Atama Türü</Label>
                <RadioGroup
                  defaultValue="all"
                  value={assignmentType}
                  onValueChange={setAssignmentType}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all" className="font-normal">
                      Tüm Atölyelere Ata
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="select" id="select" />
                    <Label htmlFor="select" className="font-normal">
                      Seçili Atölyelere Ata
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {assignmentType === "select" && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Atölyeler</Label>
                    <div className="space-x-2">
                      <Button type="button" variant="outline" size="sm" onClick={selectAllWorkshops}>
                        Tümünü Seç
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={clearWorkshops}>
                        Temizle
                      </Button>
                    </div>
                  </div>
                  <div className="border rounded-md p-2 max-h-64 overflow-y-auto space-y-2">
                    {workshops.map((workshop) => (
                      <div key={workshop.id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md">
                        <Checkbox
                          id={`workshop-${workshop.id}`}
                          checked={selectedWorkshops.includes(workshop.id)}
                          onCheckedChange={() => toggleWorkshop(workshop.id)}
                        />
                        <Label htmlFor={`workshop-${workshop.id}`} className="font-normal cursor-pointer flex-1">
                          <div>{workshop.name}</div>
                          <div className="text-xs text-muted-foreground">{workshop.region}</div>
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">{selectedWorkshops.length} atölye seçildi</div>
                </div>
              )}

              <div className="space-y-2 pt-4 border-t">
                <Label>Bildirim Ayarları</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="notify-workshop" defaultChecked />
                    <Label htmlFor="notify-workshop" className="font-normal">
                      Atölye sorumlularına bildirim gönder
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="notify-email" defaultChecked />
                    <Label htmlFor="notify-email" className="font-normal">
                      E-posta bildirimi gönder
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href="/dashboard/admin/tasks">
                <Button variant="outline">İptal</Button>
              </Link>
              <Button type="submit">Görevi Oluştur</Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}
