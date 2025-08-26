"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUpIcon,
  SearchIcon,
  MoreHorizontalIcon,
  PlusCircleIcon,
  EditIcon,
  TrashIcon,
  StarIcon,
  BarChart3Icon,
  ThumbsUpIcon,
  ThumbsDownIcon,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function SkillsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterWorkshop, setFilterWorkshop] = useState("all")
  const [isAddSkillDialogOpen, setIsAddSkillDialogOpen] = useState(false)
  const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null)

  // Mock data for workshop skills
  const workshopSkills = [
    {
      id: 1,
      workshopName: "İstanbul Kadıköy Atölyesi",
      region: "İstanbul",
      skills: [
        {
          name: "Fotoğraf Çekimi",
          rating: "good",
          note: "Kompozisyon ve aydınlatma konusunda çok başarılı",
          addedDate: "2024-05-10",
        },
        { name: "Video Montajı", rating: "good", note: "Premiere Pro kullanımında yetkin", addedDate: "2024-05-12" },
        { name: "İletişim", rating: "good", note: "Müşteri ilişkilerinde çok başarılı", addedDate: "2024-05-08" },
        { name: "Ses Kayıt", rating: "bad", note: "Ses kalitesi konusunda gelişim gerekiyor", addedDate: "2024-05-15" },
      ],
      averageRating: 75,
      lastUpdated: "2024-05-15",
    },
    {
      id: 2,
      workshopName: "Ankara Çankaya Atölyesi",
      region: "Ankara",
      skills: [
        { name: "Fotoğraf Çekimi", rating: "good", note: "Yaratıcı açılar buluyor", addedDate: "2024-05-09" },
        { name: "Grafik Tasarım", rating: "good", note: "Adobe Photoshop'ta çok iyi", addedDate: "2024-05-11" },
        { name: "Proje Yönetimi", rating: "bad", note: "Zaman yönetiminde sorunlar yaşıyor", addedDate: "2024-05-13" },
        { name: "Sosyal Medya", rating: "good", note: "İçerik üretiminde başarılı", addedDate: "2024-05-14" },
      ],
      averageRating: 75,
      lastUpdated: "2024-05-14",
    },
    {
      id: 3,
      workshopName: "İzmir Bornova Atölyesi",
      region: "İzmir",
      skills: [
        {
          name: "Video Çekimi",
          rating: "bad",
          note: "Kamera stabilizasyonu konusunda gelişim gerekiyor",
          addedDate: "2024-05-07",
        },
        { name: "İletişim", rating: "good", note: "Takım çalışmasında çok iyi", addedDate: "2024-05-10" },
        { name: "Yaratıcılık", rating: "good", note: "Özgün fikirler üretiyor", addedDate: "2024-05-12" },
      ],
      averageRating: 67,
      lastUpdated: "2024-05-12",
    },
    {
      id: 4,
      workshopName: "Bursa Nilüfer Atölyesi",
      region: "Bursa",
      skills: [
        {
          name: "Fotoğraf Çekimi",
          rating: "good",
          note: "Profesyonel seviyede çekim yapıyor",
          addedDate: "2024-05-08",
        },
        { name: "Video Montajı", rating: "good", note: "After Effects kullanımında yetkin", addedDate: "2024-05-10" },
        { name: "Renk Düzeltme", rating: "good", note: "DaVinci Resolve'da çok başarılı", addedDate: "2024-05-11" },
        { name: "İletişim", rating: "good", note: "Müşteri memnuniyeti çok yüksek", addedDate: "2024-05-13" },
        { name: "Proje Planlama", rating: "good", note: "Detaylı planlama yapıyor", addedDate: "2024-05-14" },
      ],
      averageRating: 100,
      lastUpdated: "2024-05-14",
    },
  ]

  const allSkillTypes = [
    "Fotoğraf Çekimi",
    "Video Çekimi",
    "Video Montajı",
    "Ses Kayıt",
    "Grafik Tasarım",
    "İletişim",
    "Proje Yönetimi",
    "Sosyal Medya",
    "Yaratıcılık",
    "Renk Düzeltme",
    "Proje Planlama",
    "Müşteri İlişkileri",
    "Teknik Destek",
    "Eğitim Verme",
  ]

  const getRatingBadge = (rating: string) => {
    return rating === "good" ? (
      <Badge variant="default" className="gap-1">
        <ThumbsUpIcon className="h-3 w-3" />
        İyi
      </Badge>
    ) : (
      <Badge variant="destructive" className="gap-1">
        <ThumbsDownIcon className="h-3 w-3" />
        Gelişim Gerekli
      </Badge>
    )
  }

  const getRatingColor = (rating: string) => {
    return rating === "good" ? "text-green-600" : "text-red-600"
  }

  const filteredWorkshops = workshopSkills.filter((workshop) => {
    const matchesSearch =
      workshop.workshopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workshop.skills.some((skill) => skill.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFilter = filterWorkshop === "all" || workshop.region === filterWorkshop
    return matchesSearch && matchesFilter
  })

  const AddSkillDialog = () => {
    const [skillData, setSkillData] = useState({
      skillName: "",
      rating: "good",
      note: "",
    })

    const handleSaveSkill = () => {
      // API call would be made here
      console.log("Skill data:", skillData, "Workshop:", selectedWorkshop)
      setIsAddSkillDialogOpen(false)
      setSelectedWorkshop(null)
      setSkillData({ skillName: "", rating: "good", note: "" })
    }

    return (
      <Dialog open={isAddSkillDialogOpen} onOpenChange={setIsAddSkillDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yeni Yetenek Ekle</DialogTitle>
            <DialogDescription>{selectedWorkshop?.workshopName} için yeni bir yetenek ekleyin</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="skillName">Yetenek Adı</Label>
              <Select
                value={skillData.skillName}
                onValueChange={(value) => setSkillData((prev) => ({ ...prev, skillName: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Yetenek seçin" />
                </SelectTrigger>
                <SelectContent>
                  {allSkillTypes.map((skill) => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Değerlendirme</Label>
              <Select
                value={skillData.rating}
                onValueChange={(value) => setSkillData((prev) => ({ ...prev, rating: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Değerlendirme seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="good">İyi</SelectItem>
                  <SelectItem value="bad">Gelişim Gerekli</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Detaylı Not</Label>
              <Textarea
                id="note"
                placeholder="Yetenek hakkında detaylı açıklama..."
                value={skillData.note}
                onChange={(e) => setSkillData((prev) => ({ ...prev, note: e.target.value }))}
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsAddSkillDialogOpen(false)}>
                İptal
              </Button>
              <Button onClick={handleSaveSkill}>Yetenek Ekle</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Yetenek Yönetimi</h2>
          <p className="text-muted-foreground">Atölyelerin yeteneklerini ekleyin, değerlendirin ve takip edin</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Atölye</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workshopSkills.length}</div>
            <p className="text-xs text-muted-foreground">Yetenek takibi yapılan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Yetenek</CardTitle>
            <StarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workshopSkills.reduce((sum, workshop) => sum + workshop.skills.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Kayıtlı yetenek</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">İyi Değerlendirme</CardTitle>
            <ThumbsUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workshopSkills.reduce(
                (sum, workshop) => sum + workshop.skills.filter((skill) => skill.rating === "good").length,
                0,
              )}
            </div>
            <p className="text-xs text-muted-foreground">İyi olarak değerlendirilen</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ortalama Başarı</CardTitle>
            <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                workshopSkills.reduce((sum, workshop) => sum + workshop.averageRating, 0) / workshopSkills.length,
              )}
              %
            </div>
            <p className="text-xs text-muted-foreground">Genel başarı oranı</p>
          </CardContent>
        </Card>
      </div>

      {/* Skills Management */}
      <Card>
        <CardHeader>
          <CardTitle>Atölye Yetenekleri</CardTitle>
          <CardDescription>
            Atölyelerin yeteneklerini görüntüleyin, düzenleyin ve yeni yetenekler ekleyin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Atölye veya yetenek ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Bölge: {filterWorkshop === "all" ? "Tümü" : filterWorkshop}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterWorkshop("all")}>Tümü</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterWorkshop("İstanbul")}>İstanbul</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterWorkshop("Ankara")}>Ankara</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterWorkshop("İzmir")}>İzmir</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterWorkshop("Bursa")}>Bursa</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Workshop Skills Cards */}
          <div className="space-y-6">
            {filteredWorkshops.map((workshop) => (
              <Card key={workshop.id} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{workshop.workshopName}</CardTitle>
                      <CardDescription>
                        {workshop.region} • {workshop.skills.length} yetenek • Son güncelleme: {workshop.lastUpdated}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-sm font-medium">Başarı Oranı</div>
                        <div className="text-2xl font-bold">{workshop.averageRating}%</div>
                      </div>
                      <Progress value={workshop.averageRating} className="w-20 h-2" />
                      <Button
                        onClick={() => {
                          setSelectedWorkshop(workshop)
                          setIsAddSkillDialogOpen(true)
                        }}
                        size="sm"
                        className="gap-1"
                      >
                        <PlusCircleIcon className="h-4 w-4" />
                        Yetenek Ekle
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {workshop.skills.map((skill, skillIndex) => (
                      <div key={skillIndex} className="p-4 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{skill.name}</h4>
                          {getRatingBadge(skill.rating)}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{skill.note}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Eklenme: {skill.addedDate}</span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreHorizontalIcon className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <EditIcon className="mr-2 h-3 w-3" />
                                Düzenle
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <TrashIcon className="mr-2 h-3 w-3" />
                                Sil
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                  {workshop.skills.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <StarIcon className="h-8 w-8 mx-auto mb-2" />
                      <p>Henüz yetenek eklenmemiş</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredWorkshops.length === 0 && (
            <div className="text-center py-8">
              <TrendingUpIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Atölye bulunamadı</h3>
              <p className="text-muted-foreground mb-4">Arama kriterlerinize uygun atölye bulunamadı.</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setFilterWorkshop("all")
                }}
              >
                Filtreleri Temizle
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AddSkillDialog />
    </div>
  )
}
