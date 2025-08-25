"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePicker } from "@/components/ui/date-picker"
import { ArrowLeftIcon, UploadIcon, LinkIcon, SaveIcon, SendIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NewContentWorkPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: null as Date | null,
    pdfFile: null as File | null,
    driveLink: "",
    instructions: "",
    priority: "medium",
    contentType: "mixed",
    selectedWorkshops: [] as string[],
  })

  // Mock data for workshops
  const workshops = [
    { id: "1", name: "İstanbul Kadıköy Atölyesi", region: "İstanbul" },
    { id: "2", name: "İstanbul Üsküdar Atölyesi", region: "İstanbul" },
    { id: "3", name: "Ankara Çankaya Atölyesi", region: "Ankara" },
    { id: "4", name: "Ankara Keçiören Atölyesi", region: "Ankara" },
    { id: "5", name: "İzmir Bornova Atölyesi", region: "İzmir" },
    { id: "6", name: "İzmir Karşıyaka Atölyesi", region: "İzmir" },
    { id: "7", name: "Bursa Nilüfer Atölyesi", region: "Bursa" },
    { id: "8", name: "Antalya Muratpaşa Atölyesi", region: "Antalya" },
  ]

  const regions = ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya"]

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault()

    // API call would be made here
    console.log("Form data:", { ...formData, isDraft })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Redirect back to content works list
    router.push("/dashboard/admin/commission/content-works")
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setFormData((prev) => ({ ...prev, pdfFile: file }))
    }
  }

  const handleWorkshopSelection = (workshopId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      selectedWorkshops: checked
        ? [...prev.selectedWorkshops, workshopId]
        : prev.selectedWorkshops.filter((id) => id !== workshopId),
    }))
  }

  const selectAllWorkshopsInRegion = (region: string) => {
    const regionWorkshops = workshops.filter((w) => w.region === region).map((w) => w.id)
    setFormData((prev) => ({
      ...prev,
      selectedWorkshops: [...new Set([...prev.selectedWorkshops, ...regionWorkshops])],
    }))
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin/commission/content-works">
          <Button variant="outline" size="icon">
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Yeni İçerik Çalışması</h2>
          <p className="text-muted-foreground">Atölyelere gönderilecek yeni bir içerik çalışması oluşturun</p>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Temel Bilgiler</CardTitle>
                <CardDescription>İçerik çalışmasının temel bilgilerini girin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Çalışma Başlığı *</Label>
                  <Input
                    id="title"
                    placeholder="Örn: Mayıs Ayı Proje Tanıtım Videosu"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Açıklama *</Label>
                  <Textarea
                    id="description"
                    placeholder="İçerik çalışmasının detaylı açıklaması..."
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contentType">İçerik Türü</Label>
                    <Select
                      value={formData.contentType}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, contentType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="İçerik türü seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="photo">Fotoğraf</SelectItem>
                        <SelectItem value="mixed">Video + Fotoğraf</SelectItem>
                        <SelectItem value="document">Döküman</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Öncelik</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Öncelik seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Düşük</SelectItem>
                        <SelectItem value="medium">Orta</SelectItem>
                        <SelectItem value="high">Yüksek</SelectItem>
                        <SelectItem value="urgent">Acil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Son Teslim Tarihi *</Label>
                  <DatePicker
                    date={formData.dueDate}
                    onDateChange={(date) => setFormData((prev) => ({ ...prev, dueDate: date }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Özel Talimatlar</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Atölyelere özel talimatlar ve notlar..."
                    value={formData.instructions}
                    onChange={(e) => setFormData((prev) => ({ ...prev, instructions: e.target.value }))}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dosya ve Bağlantılar</CardTitle>
                <CardDescription>PDF dosyası ve Drive klasör bağlantısı ekleyin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pdfFile">PDF Dosyası</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="pdfFile"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                    />
                    <UploadIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  {formData.pdfFile && (
                    <p className="text-sm text-muted-foreground">Seçilen dosya: {formData.pdfFile.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driveLink">Drive Klasör Bağlantısı *</Label>
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="driveLink"
                      type="url"
                      placeholder="https://drive.google.com/folder/..."
                      value={formData.driveLink}
                      onChange={(e) => setFormData((prev) => ({ ...prev, driveLink: e.target.value }))}
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Atölyelerin içerik yükleyeceği Drive klasörünün bağlantısını girin
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workshop Selection Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Atölye Seçimi</CardTitle>
                <CardDescription>İçerik çalışmasını gönderilecek atölyeleri seçin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {regions.map((region) => (
                    <div key={region} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">{region}</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => selectAllWorkshopsInRegion(region)}
                        >
                          Tümünü Seç
                        </Button>
                      </div>
                      <div className="space-y-2 pl-4">
                        {workshops
                          .filter((workshop) => workshop.region === region)
                          .map((workshop) => (
                            <div key={workshop.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={workshop.id}
                                checked={formData.selectedWorkshops.includes(workshop.id)}
                                onCheckedChange={(checked) => handleWorkshopSelection(workshop.id, checked as boolean)}
                              />
                              <Label htmlFor={workshop.id} className="text-sm font-normal cursor-pointer">
                                {workshop.name}
                              </Label>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Seçilen atölye sayısı: {formData.selectedWorkshops.length}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <Button type="submit" className="w-full gap-2">
                    <SendIcon className="h-4 w-4" />
                    Gönder ve Yayınla
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-2 bg-transparent"
                    onClick={(e) => handleSubmit(e as any, true)}
                  >
                    <SaveIcon className="h-4 w-4" />
                    Taslak Olarak Kaydet
                  </Button>
                  <Link href="/dashboard/admin/commission/content-works">
                    <Button type="button" variant="ghost" className="w-full">
                      İptal
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
