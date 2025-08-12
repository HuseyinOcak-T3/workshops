"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
import {
  CalendarIcon,
  CheckCircleIcon,
  FilterIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  XCircleIcon,
  AlertCircleIcon,
  ClockIcon,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

// Örnek görev verileri
const tasksData = [
  {
    id: 1,
    title: "Aylık rapor teslimi",
    description: "Tüm atölyelerin aylık faaliyet raporlarını hazırlayıp sisteme yüklemesi",
    dueDate: "2023-05-15",
    status: "pending",
    priority: "high",
    assignedTo: "Tüm Atölyeler",
    createdAt: "2023-05-01",
    createdBy: "Komisyon Başkanı",
  },
  {
    id: 2,
    title: "Malzeme envanteri güncelleme",
    description: "Atölyelerdeki tüm malzemelerin envanterinin çıkarılması ve sisteme girilmesi",
    dueDate: "2023-05-10",
    status: "completed",
    priority: "medium",
    assignedTo: "İstanbul Atölyeleri",
    createdAt: "2023-04-25",
    createdBy: "Malzeme Sorumlusu",
  },
  {
    id: 3,
    title: "Eğitim materyalleri hazırlama",
    description: "Robotik eğitimi için yeni eğitim materyallerinin hazırlanması",
    dueDate: "2023-05-20",
    status: "in-progress",
    priority: "high",
    assignedTo: "Ankara Atölyeleri",
    createdAt: "2023-04-28",
    createdBy: "Eğitim Koordinatörü",
  },
  {
    id: 4,
    title: "Öğrenci performans değerlendirmesi",
    description: "Tüm bursiyerlerin performans değerlendirmelerinin yapılması",
    dueDate: "2023-05-25",
    status: "pending",
    priority: "medium",
    assignedTo: "Tüm Atölyeler",
    createdAt: "2023-05-02",
    createdBy: "Komisyon Başkanı",
  },
  {
    id: 5,
    title: "Yeni eğitmen alımı görüşmeleri",
    description: "Yeni eğitmen adayları ile görüşmelerin yapılması",
    dueDate: "2023-05-12",
    status: "in-progress",
    priority: "high",
    assignedTo: "İzmir Atölyeleri",
    createdAt: "2023-04-30",
    createdBy: "İnsan Kaynakları",
  },
  {
    id: 6,
    title: "Atölye bakım çalışmaları",
    description: "Atölyelerdeki ekipmanların bakımının yapılması",
    dueDate: "2023-05-18",
    status: "pending",
    priority: "low",
    assignedTo: "Bursa Atölyeleri",
    createdAt: "2023-05-03",
    createdBy: "Teknik Sorumlu",
  },
  {
    id: 7,
    title: "Yeni dönem ders programı hazırlama",
    description: "Yaz dönemi için ders programlarının hazırlanması",
    dueDate: "2023-05-30",
    status: "pending",
    priority: "medium",
    assignedTo: "Tüm Atölyeler",
    createdAt: "2023-05-05",
    createdBy: "Eğitim Koordinatörü",
  },
  {
    id: 8,
    title: "Bursiyer memnuniyet anketi",
    description: "Bursiyerlere yönelik memnuniyet anketinin uygulanması",
    dueDate: "2023-05-22",
    status: "pending",
    priority: "low",
    assignedTo: "Tüm Atölyeler",
    createdAt: "2023-05-04",
    createdBy: "Kalite Sorumlusu",
  },
  {
    id: 9,
    title: "Yeni malzeme siparişi",
    description: "İhtiyaç duyulan malzemelerin sipariş edilmesi",
    dueDate: "2023-05-08",
    status: "completed",
    priority: "high",
    assignedTo: "Satın Alma Birimi",
    createdAt: "2023-04-20",
    createdBy: "Malzeme Sorumlusu",
  },
  {
    id: 10,
    title: "Yarışma hazırlıkları",
    description: "Ulusal robotik yarışması için hazırlıkların tamamlanması",
    dueDate: "2023-06-10",
    status: "in-progress",
    priority: "high",
    assignedTo: "Seçili Atölyeler",
    createdAt: "2023-04-15",
    createdBy: "Yarışma Koordinatörü",
  },
]

export default function AdminTasksPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null)

  // Filtreleme fonksiyonu
  const filteredTasks = tasksData.filter((task) => {
    // Arama sorgusu filtresi
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())

    // Öncelik filtresi
    const matchesPriority = selectedPriority === "all" || task.priority === selectedPriority

    // Durum filtresi
    const matchesStatus = selectedStatus === "all" || task.status === selectedStatus

    // Tab filtresi
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && task.status === "pending") ||
      (activeTab === "in-progress" && task.status === "in-progress") ||
      (activeTab === "completed" && task.status === "completed")

    return matchesSearch && matchesPriority && matchesStatus && matchesTab
  })

  const handleDeleteTask = () => {
    // Gerçek uygulamada burada API çağrısı yapılır
    toast({
      title: "Görev silindi",
      description: "Görev başarıyla silindi.",
    })
    setIsDeleteDialogOpen(false)
    setTaskToDelete(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50 border-green-200">
            <CheckCircleIcon className="mr-1 h-3 w-3" />
            Tamamlandı
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 hover:bg-blue-50 border-blue-200">
            <ClockIcon className="mr-1 h-3 w-3" />
            Devam Ediyor
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 hover:bg-yellow-50 border-yellow-200">
            <AlertCircleIcon className="mr-1 h-3 w-3" />
            Beklemede
          </Badge>
        )
      default:
        return null
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50 border-red-200">
            Yüksek
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-600 hover:bg-orange-50 border-orange-200">
            Orta
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50 border-green-200">
            Düşük
          </Badge>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Görev Yönetimi</h2>
        <Link href="/dashboard/admin/tasks/new">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Yeni Görev Oluştur
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">Tüm Görevler</TabsTrigger>
            <TabsTrigger value="pending">Bekleyen</TabsTrigger>
            <TabsTrigger value="in-progress">Devam Eden</TabsTrigger>
            <TabsTrigger value="completed">Tamamlanan</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Görev ara..."
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
                  <Label>Öncelik</Label>
                  <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Öncelik seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Öncelikler</SelectItem>
                      <SelectItem value="high">Yüksek</SelectItem>
                      <SelectItem value="medium">Orta</SelectItem>
                      <SelectItem value="low">Düşük</SelectItem>
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
                      <SelectItem value="pending">Beklemede</SelectItem>
                      <SelectItem value="in-progress">Devam Ediyor</SelectItem>
                      <SelectItem value="completed">Tamamlandı</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sıralama</Label>
                  <Select defaultValue="due-date-asc">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sıralama seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="due-date-asc">Son Tarih (Yakın-Uzak)</SelectItem>
                      <SelectItem value="due-date-desc">Son Tarih (Uzak-Yakın)</SelectItem>
                      <SelectItem value="priority-high">Öncelik (Yüksek-Düşük)</SelectItem>
                      <SelectItem value="priority-low">Öncelik (Düşük-Yüksek)</SelectItem>
                      <SelectItem value="created-new">Oluşturma (Yeni-Eski)</SelectItem>
                      <SelectItem value="created-old">Oluşturma (Eski-Yeni)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Diğer Filtreler</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="overdue" />
                    <label
                      htmlFor="overdue"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Süresi geçmiş görevler
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
              <CardTitle>Görev Listesi</CardTitle>
              <CardDescription>
                Toplam {filteredTasks.length} görev listeleniyor
                {searchQuery && ` (${searchQuery} için arama sonuçları)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Görev Adı</TableHead>
                    <TableHead>Atanan</TableHead>
                    <TableHead>Son Tarih</TableHead>
                    <TableHead>Öncelik</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Oluşturan</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{task.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">{task.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>{task.assignedTo}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                          {formatDate(task.dueDate)}
                        </div>
                      </TableCell>
                      <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                      <TableCell>{getStatusBadge(task.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm">{task.createdBy}</div>
                        <div className="text-xs text-muted-foreground">{formatDate(task.createdAt)}</div>
                      </TableCell>
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
                              <Link href={`/dashboard/commission/tasks/${task.id}`}>Görüntüle</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/commission/tasks/${task.id}/edit`}>Düzenle</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                toast({
                                  title: "Durum güncellendi",
                                  description: "Görev durumu 'Tamamlandı' olarak güncellendi.",
                                })
                              }}
                            >
                              <CheckCircleIcon className="mr-2 h-4 w-4" />
                              <span>Tamamlandı olarak işaretle</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setTaskToDelete(task.id)
                                setIsDeleteDialogOpen(true)
                              }}
                            >
                              <XCircleIcon className="mr-2 h-4 w-4" />
                              <span>Görevi Sil</span>
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

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bekleyen Görevler</CardTitle>
              <CardDescription>Henüz başlanmamış görevler</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Görev Adı</TableHead>
                    <TableHead>Atanan</TableHead>
                    <TableHead>Son Tarih</TableHead>
                    <TableHead>Öncelik</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Oluşturan</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{task.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">{task.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>{task.assignedTo}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                          {formatDate(task.dueDate)}
                        </div>
                      </TableCell>
                      <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                      <TableCell>{getStatusBadge(task.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm">{task.createdBy}</div>
                        <div className="text-xs text-muted-foreground">{formatDate(task.createdAt)}</div>
                      </TableCell>
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
                              <Link href={`/dashboard/commission/tasks/${task.id}`}>Görüntüle</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/commission/tasks/${task.id}/edit`}>Düzenle</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                toast({
                                  title: "Durum güncellendi",
                                  description: "Görev durumu 'Devam Ediyor' olarak güncellendi.",
                                })
                              }}
                            >
                              <ClockIcon className="mr-2 h-4 w-4" />
                              <span>Devam ediyor olarak işaretle</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setTaskToDelete(task.id)
                                setIsDeleteDialogOpen(true)
                              }}
                            >
                              <XCircleIcon className="mr-2 h-4 w-4" />
                              <span>Görevi Sil</span>
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

        <TabsContent value="in-progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Devam Eden Görevler</CardTitle>
              <CardDescription>Şu anda üzerinde çalışılan görevler</CardDescription>
            </CardHeader>
            <CardContent>{/* Benzer tablo yapısı */}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tamamlanan Görevler</CardTitle>
              <CardDescription>Başarıyla tamamlanmış görevler</CardDescription>
            </CardHeader>
            <CardContent>{/* Benzer tablo yapısı */}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Görevi Sil</DialogTitle>
            <DialogDescription>Bu görevi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              İptal
            </Button>
            <Button variant="destructive" onClick={handleDeleteTask}>
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
