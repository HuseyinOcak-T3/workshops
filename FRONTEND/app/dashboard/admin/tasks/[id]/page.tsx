"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  ArrowLeft,
  BarChart3,
  CalendarIcon,
  CheckCircle,
  Clock,
  Download,
  FileEdit,
  FileText,
  Shield,
  Trash,
} from "lucide-react"
import Link from "next/link"

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
  },
]

// Sample workshop completion data
const workshopCompletionData = [
  { id: 1, name: "İstanbul - Pendik Atölyesi", region: "Marmara", completed: true, completionDate: "2025-03-15" },
  { id: 2, name: "İstanbul - Kadıköy Atölyesi", region: "Marmara", completed: true, completionDate: "2025-03-16" },
  { id: 3, name: "Ankara - Çankaya Atölyesi", region: "İç Anadolu", completed: true, completionDate: "2025-03-15" },
  { id: 4, name: "İzmir - Bornova Atölyesi", region: "Ege", completed: false, completionDate: null },
  { id: 5, name: "Antalya - Muratpaşa Atölyesi", region: "Akdeniz", completed: true, completionDate: "2025-03-17" },
  { id: 6, name: "Bursa - Nilüfer Atölyesi", region: "Marmara", completed: true, completionDate: "2025-03-15" },
  { id: 7, name: "Trabzon - Merkez Atölyesi", region: "Karadeniz", completed: false, completionDate: null },
  { id: 8, name: "Diyarbakır - Merkez Atölyesi", region: "Güneydoğu Anadolu", completed: false, completionDate: null },
]

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const taskId = Number(params.id)

  const [task, setTask] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"details" | "analytics">("details")
  const [showWorkshops, setShowWorkshops] = useState(false)

  useEffect(() => {
    // Simulate API call to fetch task
    const fetchedTask = tasksData.find((t) => t.id === taskId)

    if (fetchedTask) {
      setTask(fetchedTask)
    }

    setLoading(false)
  }, [taskId])

  const handleDeleteTask = () => {
    // Simulate API call to delete task
    toast({
      title: "Görev silindi",
      description: "Görev başarıyla silindi.",
    })

    // Redirect back to tasks page
    router.push("/dashboard/superuser/tasks")
  }

  const handleArchiveTask = () => {
    // Simulate API call to archive/unarchive task
    const newStatus = task.status === "active" ? "completed" : "active"
    setTask({ ...task, status: newStatus })

    toast({
      title: newStatus === "active" ? "Görev aktifleştirildi" : "Görev arşivlendi",
      description: newStatus === "active" ? "Görev başarıyla aktifleştirildi." : "Görev başarıyla arşivlendi.",
    })
  }

  const handleDownloadReport = () => {
    toast({
      title: "Rapor indiriliyor",
      description: "Görev raporu indiriliyor, lütfen bekleyin.",
    })

    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Rapor indirildi",
        description: "Görev raporu başarıyla indirildi.",
      })
    }, 1500)
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
            <h1 className="text-3xl font-bold tracking-tight">Görev Detayı</h1>
            <p className="text-muted-foreground">Görev bilgileri ve tamamlanma istatistikleri</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/superadmin/tasks/${taskId}/edit`}>
              <FileEdit className="mr-2 h-4 w-4" />
              Düzenle
            </Link>
          </Button>
          <Button variant="outline" onClick={handleArchiveTask}>
            {task.status === "active" ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Arşivle
              </>
            ) : (
              <>
                <Clock className="mr-2 h-4 w-4" />
                Aktifleştir
              </>
            )}
          </Button>
          <Button variant="destructive" onClick={handleDeleteTask}>
            <Trash className="mr-2 h-4 w-4" />
            Sil
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {task.title}
                  <Badge
                    variant={
                      task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "outline"
                    }
                  >
                    {task.priority === "high"
                      ? "Yüksek Öncelik"
                      : task.priority === "medium"
                        ? "Orta Öncelik"
                        : "Düşük Öncelik"}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {task.commission} • Oluşturulma: {new Date(task.createdDate).toLocaleDateString("tr-TR")}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${viewMode === "details" ? "bg-muted" : ""}`}
                  onClick={() => setViewMode("details")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Detaylar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${viewMode === "analytics" ? "bg-muted" : ""}`}
                  onClick={() => setViewMode("analytics")}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analiz
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {viewMode === "details" ? (
              <>
                <div>
                  <h3 className="text-sm font-medium mb-2">Görev Açıklaması</h3>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Durum</h3>
                    <div className="flex items-center">
                      {task.status === "active" ? (
                        <>
                          <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                          <span className="text-sm">Devam Ediyor</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          <span className="text-sm">Tamamlandı</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Son Tarih</h3>
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{new Date(task.dueDate).toLocaleDateString("tr-TR")}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Komisyon</h3>
                    <div className="flex items-center">
                      <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{task.commission}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Tamamlanma Durumu</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>
                        {task.completedCount} / {task.totalCount} Atölye
                      </span>
                      <span className="font-medium">%{Math.round((task.completedCount / task.totalCount) * 100)}</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${(task.completedCount / task.totalCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Atölye Detayları</h3>
                  <Button variant="outline" size="sm" onClick={() => setShowWorkshops(!showWorkshops)}>
                    {showWorkshops ? "Atölye Detaylarını Gizle" : "Atölye Bazlı Durumu Görüntüle"}
                  </Button>
                </div>

                {showWorkshops && (
                  <div className="border rounded-lg p-4 mt-2">
                    <h4 className="font-medium mb-3">Atölye Bazlı Tamamlanma Durumu</h4>
                    <div className="space-y-4">
                      {workshopCompletionData.map((workshop) => (
                        <div key={workshop.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-2 w-2 rounded-full ${workshop.completed ? "bg-green-500" : "bg-red-500"}`}
                            ></div>
                            <span className="text-sm">{workshop.name}</span>
                            <span className="text-xs text-muted-foreground">({workshop.region})</span>
                          </div>
                          <div className="text-sm">
                            {workshop.completed ? (
                              <span className="text-green-600">
                                Tamamlandı: {new Date(workshop.completionDate!).toLocaleDateString("tr-TR")}
                              </span>
                            ) : (
                              <span className="text-red-600">Tamamlanmadı</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Bölgelere Göre Görev Tamamlama Oranı</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] flex items-end gap-2">
                        <div className="flex-1 h-[80%] bg-primary/20 rounded-t relative">
                          <div className="absolute bottom-0 w-full h-[75%] bg-primary rounded-t"></div>
                          <div className="absolute -top-6 w-full text-center text-xs">Marmara</div>
                          <div className="absolute -bottom-6 w-full text-center text-xs font-medium">%75</div>
                        </div>
                        <div className="flex-1 h-[80%] bg-primary/20 rounded-t relative">
                          <div className="absolute bottom-0 w-full h-[82%] bg-primary rounded-t"></div>
                          <div className="absolute -top-6 w-full text-center text-xs">İç Anadolu</div>
                          <div className="absolute -bottom-6 w-full text-center text-xs font-medium">%82</div>
                        </div>
                        <div className="flex-1 h-[80%] bg-primary/20 rounded-t relative">
                          <div className="absolute bottom-0 w-full h-[78%] bg-primary rounded-t"></div>
                          <div className="absolute -top-6 w-full text-center text-xs">Ege</div>
                          <div className="absolute -bottom-6 w-full text-center text-xs font-medium">%78</div>
                        </div>
                        <div className="flex-1 h-[80%] bg-primary/20 rounded-t relative">
                          <div className="absolute bottom-0 w-full h-[65%] bg-primary rounded-t"></div>
                          <div className="absolute -top-6 w-full text-center text-xs">Akdeniz</div>
                          <div className="absolute -bottom-6 w-full text-center text-xs font-medium">%65</div>
                        </div>
                        <div className="flex-1 h-[80%] bg-primary/20 rounded-t relative">
                          <div className="absolute bottom-0 w-full h-[72%] bg-primary rounded-t"></div>
                          <div className="absolute -top-6 w-full text-center text-xs">Karadeniz</div>
                          <div className="absolute -bottom-6 w-full text-center text-xs font-medium">%72</div>
                        </div>
                        <div className="flex-1 h-[80%] bg-primary/20 rounded-t relative">
                          <div className="absolute bottom-0 w-full h-[60%] bg-primary rounded-t"></div>
                          <div className="absolute -top-6 w-full text-center text-xs">Doğu A.</div>
                          <div className="absolute -bottom-6 w-full text-center text-xs font-medium">%60</div>
                        </div>
                        <div className="flex-1 h-[80%] bg-primary/20 rounded-t relative">
                          <div className="absolute bottom-0 w-full h-[68%] bg-primary rounded-t"></div>
                          <div className="absolute -top-6 w-full text-center text-xs">G.doğu A.</div>
                          <div className="absolute -bottom-6 w-full text-center text-xs font-medium">%68</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Zaman Analizi</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span>Son 7 gün</span>
                            <span>%25 artış</span>
                          </div>
                          <Progress value={65} className="h-2" />
                          <div className="text-xs text-right">18/28 atölye</div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span>Son 3 gün</span>
                            <span>%10 artış</span>
                          </div>
                          <Progress value={35} className="h-2" />
                          <div className="text-xs text-right">10/28 atölye</div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span>Son 24 saat</span>
                            <span>%5 artış</span>
                          </div>
                          <Progress value={15} className="h-2" />
                          <div className="text-xs text-right">4/28 atölye</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Tamamlanma Trendi</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[150px] flex items-center justify-center">
                        <div className="relative w-full h-24">
                          {/* Simplified line chart */}
                          <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
                            <path
                              d="M0,80 C20,70 40,60 60,50 C80,40 100,35 120,30 C140,25 160,20 180,15 C200,10 220,8 240,5 C260,3 280,2 300,0"
                              fill="none"
                              stroke="hsl(var(--primary))"
                              strokeWidth="2"
                            />
                            <path
                              d="M0,80 C20,70 40,60 60,50 C80,40 100,35 120,30 C140,25 160,20 180,15 C200,10 220,8 240,5 C260,3 280,2 300,0"
                              fill="hsl(var(--primary) / 0.1)"
                              strokeWidth="0"
                              d="M0,100 L0,80 C20,70 40,60 60,50 C80,40 100,35 120,30 C140,25 160,20 180,15 C200,10 220,8 240,5 C260,3 280,2 300,0 L300,100 Z"
                            />
                          </svg>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/superadmin/tasks/${taskId}/edit`}>
                <FileEdit className="mr-2 h-4 w-4" />
                Görevi Düzenle
              </Link>
            </Button>

            <Button onClick={handleDownloadReport}>
              <Download className="mr-2 h-4 w-4" />
              Rapor İndir
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Görev İstatistikleri</CardTitle>
            <CardDescription>Tamamlanma ve performans verileri</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Genel Durum</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="border rounded-lg p-3">
                  <div className="text-2xl font-bold">{task.completedCount}</div>
                  <div className="text-xs text-muted-foreground">Tamamlanan</div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="text-2xl font-bold">{task.totalCount - task.completedCount}</div>
                  <div className="text-xs text-muted-foreground">Bekleyen</div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">
                    %{Math.round((task.completedCount / task.totalCount) * 100)}
                  </div>
                  <div className="text-xs text-muted-foreground">Tamamlanma Oranı</div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="text-2xl font-bold">
                    {Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                  </div>
                  <div className="text-xs text-muted-foreground">Kalan Gün</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Bölgesel Tamamlanma</h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Marmara</span>
                    <span className="font-medium">%75</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>İç Anadolu</span>
                    <span className="font-medium">%82</span>
                  </div>
                  <Progress value={82} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Ege</span>
                    <span className="font-medium">%78</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Akdeniz</span>
                    <span className="font-medium">%65</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Zaman Çizelgesi</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-lg text-center min-w-16">
                    <div className="font-bold text-primary">{new Date(task.createdDate).getDate()}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(task.createdDate).toLocaleString("tr-TR", { month: "short" }).toUpperCase()}
                    </div>
                  </div>
                  <div className="text-sm">Görev oluşturuldu</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-lg text-center min-w-16">
                    <div className="font-bold text-primary">{new Date(task.dueDate).getDate()}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(task.dueDate).toLocaleString("tr-TR", { month: "short" }).toUpperCase()}
                    </div>
                  </div>
                  <div className="text-sm">Son tarih</div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Tabs defaultValue="daily" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="daily">Günlük</TabsTrigger>
                <TabsTrigger value="weekly">Haftalık</TabsTrigger>
                <TabsTrigger value="monthly">Aylık</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
