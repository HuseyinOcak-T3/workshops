"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { FilterIcon, MapPinIcon, MoreHorizontalIcon, PlusIcon, SearchIcon, UsersIcon } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

// Örnek atölye verileri
const workshopsData = [
  {
    id: 1,
    name: "İstanbul Kadıköy Atölyesi",
    city: "İstanbul",
    district: "Kadıköy",
    region: "Marmara",
    manager: "Ahmet Yılmaz",
    scholarCount: 28,
    trainerCount: 3,
    taskCompletion: 92,
    status: "active",
    lastActive: "2 saat önce",
  },
  {
    id: 2,
    name: "İstanbul Beşiktaş Atölyesi",
    city: "İstanbul",
    district: "Beşiktaş",
    region: "Marmara",
    manager: "Zeynep Kaya",
    scholarCount: 24,
    trainerCount: 2,
    taskCompletion: 85,
    status: "active",
    lastActive: "1 gün önce",
  },
  {
    id: 3,
    name: "Ankara Çankaya Atölyesi",
    city: "Ankara",
    district: "Çankaya",
    region: "İç Anadolu",
    manager: "Mehmet Demir",
    scholarCount: 32,
    trainerCount: 4,
    taskCompletion: 78,
    status: "active",
    lastActive: "3 saat önce",
  },
  {
    id: 4,
    name: "İzmir Bornova Atölyesi",
    city: "İzmir",
    district: "Bornova",
    region: "Ege",
    manager: "Ayşe Şahin",
    scholarCount: 26,
    trainerCount: 3,
    taskCompletion: 90,
    status: "active",
    lastActive: "5 saat önce",
  },
  {
    id: 5,
    name: "Bursa Nilüfer Atölyesi",
    city: "Bursa",
    district: "Nilüfer",
    region: "Marmara",
    manager: "Ali Yıldız",
    scholarCount: 22,
    trainerCount: 2,
    taskCompletion: 88,
    status: "active",
    lastActive: "1 gün önce",
  },
  {
    id: 6,
    name: "Antalya Muratpaşa Atölyesi",
    city: "Antalya",
    district: "Muratpaşa",
    region: "Akdeniz",
    manager: "Fatma Öztürk",
    scholarCount: 20,
    trainerCount: 2,
    taskCompletion: 82,
    status: "active",
    lastActive: "2 gün önce",
  },
  {
    id: 7,
    name: "Adana Seyhan Atölyesi",
    city: "Adana",
    district: "Seyhan",
    region: "Akdeniz",
    manager: "Mustafa Aydın",
    scholarCount: 18,
    trainerCount: 2,
    taskCompletion: 75,
    status: "maintenance",
    lastActive: "3 gün önce",
  },
  {
    id: 8,
    name: "Konya Selçuklu Atölyesi",
    city: "Konya",
    district: "Selçuklu",
    region: "İç Anadolu",
    manager: "Elif Yılmaz",
    scholarCount: 24,
    trainerCount: 3,
    taskCompletion: 80,
    status: "active",
    lastActive: "1 gün önce",
  },
  {
    id: 9,
    name: "Trabzon Ortahisar Atölyesi",
    city: "Trabzon",
    district: "Ortahisar",
    region: "Karadeniz",
    manager: "Hasan Kara",
    scholarCount: 16,
    trainerCount: 2,
    taskCompletion: 70,
    status: "inactive",
    lastActive: "5 gün önce",
  },
  {
    id: 10,
    name: "Gaziantep Şahinbey Atölyesi",
    city: "Gaziantep",
    district: "Şahinbey",
    region: "Güneydoğu Anadolu",
    manager: "Merve Çelik",
    scholarCount: 22,
    trainerCount: 2,
    taskCompletion: 85,
    status: "active",
    lastActive: "1 gün önce",
  },
]

export default function AdminWorkshopsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [workshopToDelete, setWorkshopToDelete] = useState<number | null>(null)

  // Bölgeleri çıkar
  const regions = Array.from(new Set(workshopsData.map((workshop) => workshop.region)))

  // Filtreleme fonksiyonu
  const filteredWorkshops = workshopsData.filter((workshop) => {
    // Arama sorgusu filtresi
    const matchesSearch =
      workshop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workshop.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workshop.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workshop.district.toLowerCase().includes(searchQuery.toLowerCase())

    // Bölge filtresi
    const matchesRegion = selectedRegion === "all" || workshop.region === selectedRegion

    // Durum filtresi
    const matchesStatus = selectedStatus === "all" || workshop.status === selectedStatus

    // Tab filtresi
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "high-performance" && workshop.taskCompletion >= 85) ||
      (activeTab === "low-performance" && workshop.taskCompletion < 75) ||
      (activeTab === "maintenance" && workshop.status === "maintenance") ||
      (activeTab === "inactive" && workshop.status === "inactive")

    return matchesSearch && matchesRegion && matchesStatus && matchesTab
  })

  const handleDeleteWorkshop = () => {
    // Gerçek uygulamada burada API çağrısı yapılır
    toast({
      title: "Atölye silindi",
      description: "Atölye başarıyla silindi.",
    })
    setIsDeleteDialogOpen(false)
    setWorkshopToDelete(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50 border-green-200">
            Aktif
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50 border-red-200">
            Pasif
          </Badge>
        )
      case "maintenance":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 hover:bg-yellow-50 border-yellow-200">
            Bakımda
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Atölye Yönetimi</h2>
        <Link href="/dashboard/admin/workshops/new">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Yeni Atölye Ekle
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">Tüm Atölyeler</TabsTrigger>
            <TabsTrigger value="high-performance">Yüksek Performans</TabsTrigger>
            <TabsTrigger value="low-performance">Düşük Performans</TabsTrigger>
            <TabsTrigger value="maintenance">Bakımda</TabsTrigger>
            <TabsTrigger value="inactive">Pasif</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Atölye ara..."
                className="w-[200px] pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
              <FilterIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {showFilters && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-6">
                <div className="space-y-2">
                  <Label>Bölge</Label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Bölge seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Bölgeler</SelectItem>
                      {regions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Durum</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Durum seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Durumlar</SelectItem>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="inactive">Pasif</SelectItem>
                      <SelectItem value="maintenance">Bakımda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sıralama</Label>
                  <Select defaultValue="name-asc">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sıralama seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name-asc">İsim (A-Z)</SelectItem>
                      <SelectItem value="name-desc">İsim (Z-A)</SelectItem>
                      <SelectItem value="performance-high">Performans (Yüksek-Düşük)</SelectItem>
                      <SelectItem value="performance-low">Performans (Düşük-Yüksek)</SelectItem>
                      <SelectItem value="scholars-high">Bursiyer Sayısı (Çok-Az)</SelectItem>
                      <SelectItem value="scholars-low">Bursiyer Sayısı (Az-Çok)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Diğer Filtreler</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="has-trainers" />
                    <label
                      htmlFor="has-trainers"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Eğitmeni olanlar
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Atölye Listesi</CardTitle>
              <CardDescription>
                Toplam {filteredWorkshops.length} atölye listeleniyor
                {searchQuery && ` (${searchQuery} için arama sonuçları)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Atölye Adı</TableHead>
                    <TableHead>Konum</TableHead>
                    <TableHead>Sorumlu</TableHead>
                    <TableHead>Bursiyer/Eğitmen</TableHead>
                    <TableHead>Performans</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Son Aktivite</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkshops.map((workshop) => (
                    <TableRow key={workshop.id}>
                      <TableCell className="font-medium">{workshop.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                          {workshop.district}, {workshop.city}
                        </div>
                      </TableCell>
                      <TableCell>{workshop.manager}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <UsersIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                          {workshop.scholarCount}/{workshop.trainerCount}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={workshop.taskCompletion} className="h-2 w-[60px]" />
                          <span className="text-sm">%{workshop.taskCompletion}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(workshop.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{workshop.lastActive}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Menüyü aç</span>
                              <MoreHorizontalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/commission/workshops/${workshop.id}`}>Görüntüle</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/commission/workshops/${workshop.id}/edit`}>Düzenle</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/commission/workshops/${workshop.id}/tasks`}>Görevler</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setWorkshopToDelete(workshop.id)
                                setIsDeleteDialogOpen(true)
                              }}
                            >
                              Sil
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="high-performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Yüksek Performanslı Atölyeler</CardTitle>
              <CardDescription>Görev tamamlama oranı %85 ve üzeri olan atölyeler</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Atölye Adı</TableHead>
                    <TableHead>Konum</TableHead>
                    <TableHead>Sorumlu</TableHead>
                    <TableHead>Bursiyer/Eğitmen</TableHead>
                    <TableHead>Performans</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Son Aktivite</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkshops.map((workshop) => (
                    <TableRow key={workshop.id}>
                      <TableCell className="font-medium">{workshop.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                          {workshop.district}, {workshop.city}
                        </div>
                      </TableCell>
                      <TableCell>{workshop.manager}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <UsersIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                          {workshop.scholarCount}/{workshop.trainerCount}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={workshop.taskCompletion} className="h-2 w-[60px]" />
                          <span className="text-sm">%{workshop.taskCompletion}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(workshop.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{workshop.lastActive}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Menüyü aç</span>
                              <MoreHorizontalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/commission/workshops/${workshop.id}`}>Görüntüle</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/commission/workshops/${workshop.id}/edit`}>Düzenle</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/commission/workshops/${workshop.id}/tasks`}>Görevler</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setWorkshopToDelete(workshop.id)
                                setIsDeleteDialogOpen(true)
                              }}
                            >
                              Sil
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="low-performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Düşük Performanslı Atölyeler</CardTitle>
              <CardDescription>Görev tamamlama oranı %75'in altında olan atölyeler</CardDescription>
            </CardHeader>
            <CardContent>{/* Benzer tablo yapısı */}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bakımdaki Atölyeler</CardTitle>
              <CardDescription>Bakım veya onarım sürecinde olan atölyeler</CardDescription>
            </CardHeader>
            <CardContent>{/* Benzer tablo yapısı */}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pasif Atölyeler</CardTitle>
              <CardDescription>Şu anda aktif olmayan atölyeler</CardDescription>
            </CardHeader>
            <CardContent>{/* Benzer tablo yapısı */}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atölyeyi Sil</DialogTitle>
            <DialogDescription>
              Bu atölyeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              İptal
            </Button>
            <Button variant="destructive" onClick={handleDeleteWorkshop}>
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
