"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeftIcon,
  PlusCircleIcon,
  SearchIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  FilterIcon,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Progress } from "@/components/ui/progress"

export default function WorkshopTasksPage() {
  const params = useParams()
  const workshopId = params.id
  const [activeTab, setActiveTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  // Örnek atölye bilgisi
  const workshop = {
    id: workshopId,
    name: "İstanbul Kadıköy Atölyesi",
    region: "İstanbul",
    manager: "Ahmet Yılmaz",
  }

  // Örnek görev istatistikleri
  const taskStats = {
    total: 24,
    completed: 15,
    inProgress: 6,
    pending: 3,
    completionRate: 62.5,
  }

  // Örnek görevler
  const tasks = [
    {
      id: 1,
      title: "Aylık rapor teslimi",
      description: "Atölyenin aylık faaliyet raporunu hazırlayıp sisteme yükleyin.",
      dueDate: "2023-05-15",
      status: "pending",
      priority: "high",
      commission: "Eğitim Komisyonu",
      createdAt: "2023-05-01",
      completedAt: null,
    },
    {
      id: 2,
      title: "Malzeme envanteri güncelleme",
      description: "Atölyedeki tüm malzemelerin envanterini güncelleyin ve eksikleri belirleyin.",
      dueDate: "2023-05-10",
      status: "completed",
      priority: "medium",
      commission: "Teknik Komisyon",
      createdAt: "2023-04-25",
      completedAt: "2023-05-08",
    },
    {
      id: 3,
      title: "Eğitim materyalleri hazırlama",
      description: "Önümüzdeki ay için eğitim materyallerini hazırlayın.",
      dueDate: "2023-05-20",
      status: "in-progress",
      priority: "high",
      commission: "İçerik Komisyonu",
      createdAt: "2023-04-30",
      completedAt: null,
    },
    {
      id: 4,
      title: "Öğrenci performans değerlendirmesi",
      description: "Tüm bursiyerlerin performans değerlendirmesini yapın ve raporlayın.",
      dueDate: "2023-05-25",
      status: "pending",
      priority: "medium",
      commission: "Eğitim Komisyonu",
      createdAt: "2023-05-02",
      completedAt: null,
    },
    {
      id: 5,
      title: "Atölye temizliği ve düzeni",
      description: "Atölyenin genel temizlik ve düzenini sağlayın.",
      dueDate: "2023-05-05",
      status: "completed",
      priority: "low",
      commission: "Yönetim Komisyonu",
      createdAt: "2023-04-28",
      completedAt: "2023-05-04",
    },
  ]

  // Filtreleme işlemi
  const filteredTasks = tasks.filter((task) => {
    // Arama filtresi
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.commission.toLowerCase().includes(searchQuery.toLowerCase())

    // Durum filtresi
    const matchesStatus = statusFilter === "all" || task.status === statusFilter

    // Öncelik filtresi
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

    // Aktif/tamamlanan sekmesi filtresi
    const matchesTab =
      activeTab === "active" ? task.status === "pending" || task.status === "in-progress" : task.status === "completed"

    return matchesSearch && matchesStatus && matchesPriority && matchesTab
  })

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/superadmin/workshops/${workshopId}`}>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{workshop.name} - Görevler</h2>
            <p className="text-muted-foreground">
              {workshop.region} • {workshop.manager}
            </p>
          </div>
        </div>
        <Link href="/dashboard/superuser/tasks/new">
          <Button className="gap-1">
            <PlusCircleIcon className="h-4 w-4" />
            Yeni Görev Oluştur
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Görev</CardTitle>
            <FilterIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tamamlanan</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Devam Eden</CardTitle>
            <ClockIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bekleyen</CardTitle>
            <AlertCircleIcon className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.pending}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Görev Tamamlama Oranı</CardTitle>
          <CardDescription>Atölyenin görev tamamlama performansı</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Tamamlama Oranı</span>
              <span className="text-sm font-medium">{taskStats.completionRate}%</span>
            </div>
            <Progress value={taskStats.completionRate} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Görev Listesi</CardTitle>
          <CardDescription>Atölyeye atanan tüm görevleri görüntüleyin ve yönetin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Görev ara..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Durum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="pending">Bekleyen</SelectItem>
                  <SelectItem value="in-progress">Devam Eden</SelectItem>
                  <SelectItem value="completed">Tamamlanan</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Öncelik" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Öncelikler</SelectItem>
                  <SelectItem value="high">Yüksek</SelectItem>
                  <SelectItem value="medium">Orta</SelectItem>
                  <SelectItem value="low">Düşük</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">Aktif Görevler</TabsTrigger>
              <TabsTrigger value="completed">Tamamlanan Görevler</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="mt-4 space-y-4">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <Card key={task.id} className="overflow-hidden">
                    <div
                      className={`h-1 ${
                        task.priority === "high"
                          ? "bg-red-500"
                          : task.priority === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                    />
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{task.title}</h3>
                            <Badge
                              variant={
                                task.status === "completed"
                                  ? "default"
                                  : task.status === "in-progress"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {task.status === "completed"
                                ? "Tamamlandı"
                                : task.status === "in-progress"
                                  ? "Devam Ediyor"
                                  : "Bekliyor"}
                            </Badge>
                            <Badge
                              variant={
                                task.priority === "high"
                                  ? "destructive"
                                  : task.priority === "medium"
                                    ? "default"
                                    : "outline"
                              }
                            >
                              {task.priority === "high" ? "Yüksek" : task.priority === "medium" ? "Orta" : "Düşük"}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">{task.description}</p>
                          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                            <span>Komisyon: {task.commission}</span>
                            <span>•</span>
                            <span>Son Tarih: {task.dueDate}</span>
                            <span>•</span>
                            <span>Oluşturulma: {task.createdAt}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 md:flex-col md:items-end">
                          <Link href={`/dashboard/superadmin/tasks/${task.id}`}>
                            <Button variant="outline" size="sm">
                              Görüntüle
                            </Button>
                          </Link>
                          <Link href={`/dashboard/superadmin/tasks/${task.id}/edit`}>
                            <Button size="sm">Düzenle</Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Gösterilecek görev bulunamadı.</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="completed" className="mt-4 space-y-4">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <Card key={task.id} className="overflow-hidden">
                    <div
                      className={`h-1 ${
                        task.priority === "high"
                          ? "bg-red-500"
                          : task.priority === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                    />
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{task.title}</h3>
                            <Badge
                              variant={
                                task.status === "completed"
                                  ? "default"
                                  : task.status === "in-progress"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {task.status === "completed"
                                ? "Tamamlandı"
                                : task.status === "in-progress"
                                  ? "Devam Ediyor"
                                  : "Bekliyor"}
                            </Badge>
                            <Badge
                              variant={
                                task.priority === "high"
                                  ? "destructive"
                                  : task.priority === "medium"
                                    ? "default"
                                    : "outline"
                              }
                            >
                              {task.priority === "high" ? "Yüksek" : task.priority === "medium" ? "Orta" : "Düşük"}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">{task.description}</p>
                          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                            <span>Komisyon: {task.commission}</span>
                            <span>•</span>
                            <span>Son Tarih: {task.dueDate}</span>
                            <span>•</span>
                            <span>Tamamlanma: {task.completedAt}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 md:flex-col md:items-end">
                          <Link href={`/dashboard/superadmin/tasks/${task.id}`}>
                            <Button variant="outline" size="sm">
                              Görüntüle
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Gösterilecek görev bulunamadı.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
