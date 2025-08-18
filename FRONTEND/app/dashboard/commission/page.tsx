"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  CalendarIcon,
  CheckCircleIcon,
  ClipboardListIcon,
  FileTextIcon,
  BarChart3Icon,
  UsersIcon,
  BellIcon,
  PlusCircleIcon,
} from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Örnek veriler
  const stats = {
    totalWorkshops: 24,
    activeWorkshops: 18,
    totalTasks: 156,
    completedTasks: 89,
    pendingTasks: 42,
    inProgressTasks: 25,
    totalAnnouncements: 32,
    totalScholars: 450,
    totalTrainers: 36,
  }

  // Örnek görevler
  const recentTasks = [
    {
      id: 1,
      title: "Aylık rapor teslimi",
      dueDate: "2023-05-15",
      status: "pending",
      priority: "high",
      assignedTo: "Tüm Atölyeler",
    },
    {
      id: 2,
      title: "Malzeme envanteri güncelleme",
      dueDate: "2023-05-10",
      status: "completed",
      priority: "medium",
      assignedTo: "İstanbul Atölyeleri",
    },
    {
      id: 3,
      title: "Eğitim materyalleri hazırlama",
      dueDate: "2023-05-20",
      status: "in-progress",
      priority: "high",
      assignedTo: "Ankara Atölyeleri",
    },
    {
      id: 4,
      title: "Öğrenci performans değerlendirmesi",
      dueDate: "2023-05-25",
      status: "pending",
      priority: "medium",
      assignedTo: "Tüm Atölyeler",
    },
  ]

  // Örnek duyurular
  const recentAnnouncements = [
    { id: 1, title: "Yaz dönemi programı açıklandı", date: "2023-05-01", type: "general" },
    { id: 2, title: "Yeni eğitim materyalleri yüklendi", date: "2023-04-28", type: "education" },
    { id: 3, title: "Sistem bakımı hakkında bilgilendirme", date: "2023-04-25", type: "system" },
  ]

  // Örnek atölyeler
  const workshops = [
    {
      id: 1,
      name: "İstanbul Kadıköy Atölyesi",
      region: "İstanbul",
      taskCompletion: 85,
      scholarCount: 28,
      trainerCount: 2,
    },
    { id: 2, name: "Ankara Çankaya Atölyesi", region: "Ankara", taskCompletion: 92, scholarCount: 32, trainerCount: 3 },
    { id: 3, name: "İzmir Bornova Atölyesi", region: "İzmir", taskCompletion: 78, scholarCount: 25, trainerCount: 2 },
    { id: 4, name: "Bursa Nilüfer Atölyesi", region: "Bursa", taskCompletion: 80, scholarCount: 22, trainerCount: 2 },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Komisyon Yönetim Paneli</h2>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/admin/tasks/new">
            <Button className="gap-1">
              <PlusCircleIcon className="h-4 w-4" />
              Görev Ata
            </Button>
          </Link>
          <Link href="/announcements/new">
            <Button variant="outline" className="gap-1">
              <BellIcon className="h-4 w-4" />
              Duyuru Oluştur
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="tasks">Görevler</TabsTrigger>
          <TabsTrigger value="workshops">Atölyeler</TabsTrigger>
          <TabsTrigger value="announcements">Duyurular</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Atölye</CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalWorkshops}</div>
                <p className="text-xs text-muted-foreground">{stats.activeWorkshops} aktif atölye</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Görev</CardTitle>
                <ClipboardListIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTasks}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.completedTasks} tamamlandı, {stats.pendingTasks} bekliyor
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Bursiyer</CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalScholars}</div>
                <p className="text-xs text-muted-foreground">{stats.totalTrainers} eğitmen</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Duyurular</CardTitle>
                <BellIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAnnouncements}</div>
                <p className="text-xs text-muted-foreground">Son 30 günde</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Son Görevler</CardTitle>
                <CardDescription>Son atanan görevler ve durumları</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <div className="font-medium">{task.title}</div>
                        <div className="text-sm text-muted-foreground">
                          Son Tarih: {task.dueDate} • {task.assignedTo}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`px-2 py-1 rounded-full text-xs ${
                            task.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : task.status === "in-progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {task.status === "completed"
                            ? "Tamamlandı"
                            : task.status === "in-progress"
                              ? "Devam Ediyor"
                              : "Bekliyor"}
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs ${
                            task.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : task.priority === "medium"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {task.priority === "high" ? "Yüksek" : task.priority === "medium" ? "Orta" : "Düşük"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/dashboard/admin/tasks">
                    <Button variant="outline" className="w-full">
                      Tüm Görevleri Görüntüle
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Son Duyurular</CardTitle>
                <CardDescription>Son yayınlanan duyurular</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAnnouncements.map((announcement) => (
                    <div key={announcement.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <div className="font-medium">{announcement.title}</div>
                        <div className="text-sm text-muted-foreground">{announcement.date}</div>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs ${
                          announcement.type === "general"
                            ? "bg-purple-100 text-purple-800"
                            : announcement.type === "education"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {announcement.type === "general"
                          ? "Genel"
                          : announcement.type === "education"
                            ? "Eğitim"
                            : "Sistem"}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/dashboard/admin/announcements">
                    <Button variant="outline" className="w-full">
                      Tüm Duyuruları Görüntüle
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Atölye Performansları</CardTitle>
                <CardDescription>Atölyelerin görev tamamlama oranları</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workshops.map((workshop) => (
                    <div key={workshop.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{workshop.name}</div>
                        <div className="text-sm text-muted-foreground">{workshop.taskCompletion}%</div>
                      </div>
                      <Progress value={workshop.taskCompletion} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {workshop.region} • {workshop.scholarCount} bursiyer • {workshop.trainerCount} eğitmen
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/dashboard/admin/workshops">
                    <Button variant="outline" className="w-full">
                      Tüm Atölyeleri Görüntüle
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Hızlı Erişim</CardTitle>
                <CardDescription>Sık kullanılan sayfalara hızlı erişim</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href="/dashboard/admin/tasks">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <ClipboardListIcon className="h-4 w-4" />
                      Görev Yönetimi
                    </Button>
                  </Link>
                  <Link href="/dashboard/admin/workshops">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <UsersIcon className="h-4 w-4" />
                      Atölye Yönetimi
                    </Button>
                  </Link>
                  <Link href="/dashboard/admin/announcements">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <BellIcon className="h-4 w-4" />
                      Duyuru Yönetimi
                    </Button>
                  </Link>
                  <Link href="/dashboard/admin/reports">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <FileTextIcon className="h-4 w-4" />
                      Raporlar
                    </Button>
                  </Link>
                  <Link href="/dashboard/admin/calendar">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Takvim
                    </Button>
                  </Link>
                  <Link href="/dashboard/admin/messages">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <FileTextIcon className="h-4 w-4" />
                      Mesajlar
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Görev Yönetimi</CardTitle>
              <CardDescription>Atölyelere atanan görevleri yönetin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Görev Durumu</h3>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircleIcon className="h-5 w-5 text-green-600" />
                          <span className="font-medium">Tamamlanan</span>
                        </div>
                        <div className="text-2xl font-bold mt-1">{stats.completedTasks}</div>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <ClipboardListIcon className="h-5 w-5 text-yellow-600" />
                          <span className="font-medium">Bekleyen</span>
                        </div>
                        <div className="text-2xl font-bold mt-1">{stats.pendingTasks}</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <BarChart3Icon className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">Devam Eden</span>
                        </div>
                        <div className="text-2xl font-bold mt-1">{stats.inProgressTasks}</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Link href="/dashboard/admin/tasks/new">
                      <Button className="gap-1">
                        <PlusCircleIcon className="h-4 w-4" />
                        Yeni Görev Oluştur
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="mt-6">
                  <Link href="/dashboard/admin/tasks">
                    <Button variant="outline" className="w-full">
                      Görev Yönetimi Sayfasına Git
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workshops" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Atölye Yönetimi</CardTitle>
              <CardDescription>Atölyeleri ve performanslarını yönetin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {workshops.slice(0, 4).map((workshop) => (
                    <Card key={workshop.id} className="p-4">
                      <div className="font-medium">{workshop.name}</div>
                      <div className="text-sm text-muted-foreground mb-2">{workshop.region}</div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm">Görev Tamamlama</div>
                        <div className="text-sm font-medium">{workshop.taskCompletion}%</div>
                      </div>
                      <Progress value={workshop.taskCompletion} className="h-2 mb-2" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <div>{workshop.scholarCount} bursiyer</div>
                        <div>{workshop.trainerCount} eğitmen</div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Link href={`/dashboard/commission/workshops/${workshop.id}`}>
                          <Button variant="outline" size="sm">
                            Görüntüle
                          </Button>
                        </Link>
                        <Link href={`/dashboard/commission/workshops/${workshop.id}/edit`}>
                          <Button size="sm">Düzenle</Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/dashboard/admin/workshops">
                    <Button variant="outline" className="w-full">
                      Tüm Atölyeleri Görüntüle
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Duyuru Yönetimi</CardTitle>
              <CardDescription>Sistem duyurularını yönetin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium">Son Duyurular</h3>
                  <Link href="/announcements/new">
                    <Button className="gap-1">
                      <PlusCircleIcon className="h-4 w-4" />
                      Yeni Duyuru
                    </Button>
                  </Link>
                </div>
                <div className="space-y-2">
                  {recentAnnouncements.map((announcement) => (
                    <div key={announcement.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{announcement.title}</div>
                        <div className="text-sm text-muted-foreground">{announcement.date}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`px-2 py-1 rounded-full text-xs ${
                            announcement.type === "general"
                              ? "bg-purple-100 text-purple-800"
                              : announcement.type === "education"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {announcement.type === "general"
                            ? "Genel"
                            : announcement.type === "education"
                              ? "Eğitim"
                              : "Sistem"}
                        </div>
                        <Button variant="outline" size="sm">
                          Düzenle
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/dashboard/admin/announcements">
                    <Button variant="outline" className="w-full">
                      Tüm Duyuruları Görüntüle
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
