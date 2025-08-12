"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Clock, FileText, Upload, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Sample tasks data
const tasks = [
  {
    id: 1,
    title: "Mart Ayı Bursiyer Yoklamaları",
    description: "Mart ayı için bursiyer yoklamalarını tamamlayın ve sisteme yükleyin.",
    dueDate: "2025-04-05",
    status: "pending",
    commission: "Eğitmen Komisyonu",
  },
  {
    id: 2,
    title: "Proje Şenliği Takım Oluşturma",
    description: "Bahar dönemi proje şenliği için takımları oluşturun ve sisteme girin.",
    dueDate: "2025-03-20",
    status: "pending",
    commission: "Eğitim Programları Komisyonu",
  },
  {
    id: 3,
    title: "Şubat Ayı Eğitmen Yoklamaları",
    description: "Şubat ayı için eğitmen yoklamaları tamamlandı.",
    dueDate: "2025-03-08",
    status: "completed",
    commission: "Eğitmen Komisyonu",
    completedDate: "2025-03-08",
  },
  {
    id: 4,
    title: "Atölye Malzeme İhtiyaç Formu",
    description: "Bahar dönemi için atölye malzeme ihtiyaç listesi formu.",
    dueDate: "2025-02-15",
    status: "completed",
    commission: "Takımlar Komisyonu",
    completedDate: "2025-02-15",
  },
  {
    id: 5,
    title: "Özel İçerik Çalışması",
    description: "Atölye tanıtım videosu ve fotoğraflarının hazırlanması ve sisteme yüklenmesi.",
    dueDate: "2025-03-30",
    status: "pending",
    commission: "Medya ve İletişim Komisyonu",
  },
]

export default function TasksPage() {
  const { toast } = useToast()
  const [selectedTask, setSelectedTask] = useState<(typeof tasks)[0] | null>(null)
  const [activeTab, setActiveTab] = useState("pending")

  const pendingTasks = tasks.filter((task) => task.status === "pending")
  const completedTasks = tasks.filter((task) => task.status === "completed")

  const handleTaskComplete = () => {
    if (!selectedTask) return

    toast({
      title: "Görev tamamlandı",
      description: "Görev tamamlama işlemi başarılı.",
    })

    // Reset selected task
    setSelectedTask(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Görevler</h1>
        <p className="text-muted-foreground">Atanmış görevler ve durumları</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Görev Listesi</CardTitle>
            <CardDescription>Komisyonlar tarafından atanan görevler</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <Tabs defaultValue="pending" onValueChange={setActiveTab}>
              <div className="px-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="pending">Bekleyen</TabsTrigger>
                  <TabsTrigger value="completed">Tamamlanan</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="pending" className="mt-0 pt-4">
                <div className="divide-y">
                  {pendingTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`px-6 py-3 cursor-pointer hover:bg-muted/50 ${selectedTask?.id === task.id ? "bg-muted" : ""}`}
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex flex-col">
                          <span className="font-medium">{task.title}</span>
                          <span className="text-xs text-muted-foreground">
                            Son Tarih: {new Date(task.dueDate).toLocaleDateString("tr-TR")}
                          </span>
                        </div>
                        <Clock className="h-4 w-4 text-yellow-500 mt-1" />
                      </div>
                      <div className="mt-1">
                        <Badge variant="outline" className="text-xs">
                          {task.commission}
                        </Badge>
                      </div>
                    </div>
                  ))}

                  {pendingTasks.length === 0 && (
                    <div className="px-6 py-8 text-center">
                      <p className="text-muted-foreground">Bekleyen görev bulunmuyor.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="mt-0 pt-4">
                <div className="divide-y">
                  {completedTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`px-6 py-3 cursor-pointer hover:bg-muted/50 ${selectedTask?.id === task.id ? "bg-muted" : ""}`}
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex flex-col">
                          <span className="font-medium">{task.title}</span>
                          <span className="text-xs text-muted-foreground">
                            Tamamlandı: {new Date(task.completedDate || "").toLocaleDateString("tr-TR")}
                          </span>
                        </div>
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                      </div>
                      <div className="mt-1">
                        <Badge variant="outline" className="text-xs">
                          {task.commission}
                        </Badge>
                      </div>
                    </div>
                  ))}

                  {completedTasks.length === 0 && (
                    <div className="px-6 py-8 text-center">
                      <p className="text-muted-foreground">Tamamlanan görev bulunmuyor.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          {selectedTask ? (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedTask.title}</CardTitle>
                    <CardDescription>Görev detayları ve tamamlama</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedTask(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-1">
                  <div className="text-sm font-medium">Görev Açıklaması</div>
                  <div className="text-sm text-muted-foreground">{selectedTask.description}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-1">
                    <div className="text-sm font-medium">Komisyon</div>
                    <div className="text-sm text-muted-foreground">{selectedTask.commission}</div>
                  </div>
                  <div className="grid gap-1">
                    <div className="text-sm font-medium">Son Tarih</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(selectedTask.dueDate).toLocaleDateString("tr-TR")}
                    </div>
                  </div>
                </div>

                <div className="grid gap-1">
                  <div className="text-sm font-medium">Durum</div>
                  <div className="flex items-center">
                    {selectedTask.status === "pending" ? (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                        <span>Beklemede</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Tamamlandı</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedTask.status === "pending" && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="grid gap-2">
                      <Label htmlFor="notes">Notlar</Label>
                      <Textarea id="notes" placeholder="Görev hakkında notlarınızı buraya yazabilirsiniz..." />
                    </div>

                    <div className="grid gap-2">
                      <Label>Dosya Yükleme</Label>
                      <div className="border-2 border-dashed rounded-md p-6 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <p className="text-sm font-medium">Dosya yüklemek için tıklayın veya sürükleyin</p>
                          <p className="text-xs text-muted-foreground">
                            PDF, DOCX, XLSX, JPG, PNG formatları desteklenir
                          </p>
                          <Input id="file-upload" type="file" className="hidden" />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById("file-upload")?.click()}
                          >
                            Dosya Seç
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className={`flex ${selectedTask.status === "pending" ? "justify-between" : "justify-end"}`}>
                {selectedTask.status === "pending" && <Button variant="outline">Daha Sonra Tamamla</Button>}

                {selectedTask.status === "pending" ? (
                  <Button onClick={handleTaskComplete}>Görevi Tamamla</Button>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        Raporu Görüntüle
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>PDF olarak indir</DropdownMenuItem>
                      <DropdownMenuItem>Yazdır</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </CardFooter>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[300px] p-6 text-center">
              <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Görev Seçilmedi</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Detaylarını görmek için sol taraftan bir görev seçin.
              </p>
              <Button variant="outline" onClick={() => setActiveTab("pending")}>
                Bekleyen Görevleri Göster
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
