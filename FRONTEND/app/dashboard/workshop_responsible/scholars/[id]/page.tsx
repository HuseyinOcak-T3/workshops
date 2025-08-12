"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Calendar, Download, Edit, FileText, Mail, Phone, User, Users } from "lucide-react"
import Link from "next/link"

// Sample scholar data
const scholarData = {
  id: 1,
  name: "Ahmet Yılmaz",
  grade: "10. Sınıf",
  school: "Pendik Fen Lisesi",
  attendanceRate: 95,
  status: "active",
  joinDate: "2023-09-01",
  parentName: "Mehmet Yılmaz",
  parentPhone: "+90 555 111 2233",
  parentEmail: "mehmet.yilmaz@example.com",
  image: "/placeholder.svg?height=100&width=100",
  address: "Batı Mahallesi, Pendik, İstanbul",
  birthDate: "2008-05-15",
  interests: ["Robotik", "Yazılım", "Elektronik"],
  achievements: [
    { id: 1, title: "Teknofest Robotik Yarışması", date: "2024-09-15", description: "3. lük ödülü" },
    { id: 2, title: "Kodlama Maratonu", date: "2024-06-10", description: "Birincilik ödülü" },
  ],
  notes: "Robotik alanında çok yetenekli. Yazılım konusunda kendini geliştiriyor.",
  attendance: [
    { id: 1, date: "2025-03-01", status: "present" },
    { id: 2, date: "2025-03-08", status: "present" },
    { id: 3, date: "2025-03-15", status: "absent", reason: "Hastalık" },
    { id: 4, date: "2025-03-22", status: "present" },
    { id: 5, date: "2025-03-29", status: "present" },
  ],
  tasks: [
    { id: 1, title: "Arduino ile LED Kontrolü", dueDate: "2025-03-10", status: "completed", grade: 90 },
    { id: 2, title: "Basit Robot Kolu Tasarımı", dueDate: "2025-03-20", status: "completed", grade: 85 },
    { id: 3, title: "Sensör Verisi Okuma", dueDate: "2025-04-05", status: "in-progress" },
  ],
}

export default function ScholarDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [contactDialogOpen, setContactDialogOpen] = useState(false)

  const handleContactParent = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Mesaj gönderildi",
      description: "Veli bilgilendirme mesajı başarıyla gönderildi.",
    })
    setContactDialogOpen(false)
  }

  const handleAddNote = () => {
    toast({
      title: "Not eklendi",
      description: "Bursiyer hakkındaki notunuz kaydedildi.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/workshop_responsible/scholars">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bursiyer Detayları</h1>
            <p className="text-muted-foreground">Bursiyer bilgileri ve performans takibi</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/workshop_responsible/scholars/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Düzenle
            </Link>
          </Button>
          <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Mail className="mr-2 h-4 w-4" />
                Veli ile İletişime Geç
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <form onSubmit={handleContactParent}>
                <DialogHeader>
                  <DialogTitle>Veli ile İletişime Geç</DialogTitle>
                  <DialogDescription>
                    {scholarData.parentName} ile iletişime geçmek için aşağıdaki formu doldurun.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="contact-subject">Konu</Label>
                    <Input id="contact-subject" placeholder="Mesaj konusu" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contact-message">Mesaj</Label>
                    <Textarea id="contact-message" placeholder="Mesajınız" rows={5} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contact-method">İletişim Yöntemi</Label>
                    <Select defaultValue="email">
                      <SelectTrigger id="contact-method">
                        <SelectValue placeholder="İletişim yöntemi seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">E-posta</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="both">Her İkisi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Mesaj Gönder</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Bursiyer Bilgileri</CardTitle>
            <CardDescription>Kişisel bilgiler ve iletişim</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={scholarData.image} alt={scholarData.name} />
                <AvatarFallback>{scholarData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold">{scholarData.name}</h3>
              <p className="text-muted-foreground mt-1">
                {scholarData.grade} - {scholarData.school}
              </p>
              <Badge className="mt-2" variant={scholarData.status === "active" ? "outline" : "secondary"}>
                {scholarData.status === "active" ? "Aktif" : "Devam Etmiyor"}
              </Badge>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Kişisel Bilgiler</p>
                  <p className="text-sm text-muted-foreground">
                    Doğum Tarihi: {new Date(scholarData.birthDate).toLocaleDateString("tr-TR")}
                  </p>
                  <p className="text-sm text-muted-foreground">Adres: {scholarData.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Katılım Bilgileri</p>
                  <p className="text-sm text-muted-foreground">
                    Başlangıç: {new Date(scholarData.joinDate).toLocaleDateString("tr-TR")}
                  </p>
                  <p className="text-sm text-muted-foreground">Yoklama Oranı: %{scholarData.attendanceRate}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Veli Bilgileri</p>
                  <p className="text-sm text-muted-foreground">{scholarData.parentName}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span>{scholarData.parentPhone}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span>{scholarData.parentEmail}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-medium mb-2">İlgi Alanları</p>
                <div className="flex flex-wrap gap-2">
                  {scholarData.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full" variant="outline" onClick={handleAddNote}>
              <FileText className="mr-2 h-4 w-4" />
              Not Ekle
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-8">
          <CardHeader>
            <CardTitle>Performans ve Takip</CardTitle>
            <CardDescription>Bursiyer performans ve katılım bilgileri</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
                <TabsTrigger value="attendance">Yoklama</TabsTrigger>
                <TabsTrigger value="tasks">Görevler</TabsTrigger>
                <TabsTrigger value="achievements">Başarılar</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Yoklama Oranı</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">%{scholarData.attendanceRate}</div>
                      <Progress value={scholarData.attendanceRate} className="h-2 mt-2" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Görev Tamamlama</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        %
                        {Math.round(
                          (scholarData.tasks.filter((t) => t.status === "completed").length /
                            scholarData.tasks.length) *
                            100,
                        )}
                      </div>
                      <Progress
                        value={Math.round(
                          (scholarData.tasks.filter((t) => t.status === "completed").length /
                            scholarData.tasks.length) *
                            100,
                        )}
                        className="h-2 mt-2"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Ortalama Not</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {Math.round(
                          scholarData.tasks.filter((t) => t.grade).reduce((acc, curr) => acc + (curr.grade || 0), 0) /
                            scholarData.tasks.filter((t) => t.grade).length,
                        )}
                      </div>
                      <Progress
                        value={Math.round(
                          scholarData.tasks.filter((t) => t.grade).reduce((acc, curr) => acc + (curr.grade || 0), 0) /
                            scholarData.tasks.filter((t) => t.grade).length,
                        )}
                        className="h-2 mt-2"
                      />
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Notlar</h3>
                  <Card>
                    <CardContent className="p-4">
                      <p>{scholarData.notes}</p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Son Görevler</h3>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="#tasks" onClick={() => setActiveTab("tasks")}>
                        Tümünü Görüntüle
                      </Link>
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {scholarData.tasks.slice(0, 2).map((task) => (
                      <Card key={task.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">{task.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                Teslim: {new Date(task.dueDate).toLocaleDateString("tr-TR")}
                              </p>
                            </div>
                            <Badge
                              variant={
                                task.status === "completed"
                                  ? "outline"
                                  : task.status === "in-progress"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {task.status === "completed"
                                ? "Tamamlandı"
                                : task.status === "in-progress"
                                  ? "Devam Ediyor"
                                  : "Beklemede"}
                            </Badge>
                          </div>
                          {task.grade && (
                            <div className="mt-2 text-sm">
                              <span className="font-medium">Not: </span>
                              <span>{task.grade}/100</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="attendance" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Yoklama Kayıtları</h3>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Dışa Aktar
                    </Button>
                  </div>

                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tarih</TableHead>
                          <TableHead>Durum</TableHead>
                          <TableHead>Açıklama</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scholarData.attendance.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>{new Date(record.date).toLocaleDateString("tr-TR")}</TableCell>
                            <TableCell>
                              <Badge variant={record.status === "present" ? "outline" : "destructive"}>
                                {record.status === "present" ? "Katıldı" : "Katılmadı"}
                              </Badge>
                            </TableCell>
                            <TableCell>{record.reason || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Toplam Ders: {scholarData.attendance.length}
                      </span>
                      <span className="text-sm text-muted-foreground ml-4">
                        Katılım: {scholarData.attendance.filter((a) => a.status === "present").length}
                      </span>
                      <span className="text-sm text-muted-foreground ml-4">
                        Devamsızlık: {scholarData.attendance.filter((a) => a.status === "absent").length}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Yoklama Oranı: </span>
                      <span>%{scholarData.attendanceRate}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tasks" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Görevler</h3>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Dışa Aktar
                    </Button>
                  </div>

                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Görev</TableHead>
                          <TableHead>Teslim Tarihi</TableHead>
                          <TableHead>Durum</TableHead>
                          <TableHead>Not</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scholarData.tasks.map((task) => (
                          <TableRow key={task.id}>
                            <TableCell className="font-medium">{task.title}</TableCell>
                            <TableCell>{new Date(task.dueDate).toLocaleDateString("tr-TR")}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  task.status === "completed"
                                    ? "outline"
                                    : task.status === "in-progress"
                                      ? "default"
                                      : "secondary"
                                }
                              >
                                {task.status === "completed"
                                  ? "Tamamlandı"
                                  : task.status === "in-progress"
                                    ? "Devam Ediyor"
                                    : "Beklemede"}
                              </Badge>
                            </TableCell>
                            <TableCell>{task.grade || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-muted-foreground">Toplam Görev: {scholarData.tasks.length}</span>
                      <span className="text-sm text-muted-foreground ml-4">
                        Tamamlanan: {scholarData.tasks.filter((t) => t.status === "completed").length}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Ortalama Not: </span>
                      <span>
                        {Math.round(
                          scholarData.tasks.filter((t) => t.grade).reduce((acc, curr) => acc + (curr.grade || 0), 0) /
                            scholarData.tasks.filter((t) => t.grade).length,
                        )}
                        /100
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="achievements" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Başarılar ve Sertifikalar</h3>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Dışa Aktar
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {scholarData.achievements.length === 0 ? (
                      <Card>
                        <CardContent className="p-6 text-center">
                          <p className="text-muted-foreground">Henüz başarı kaydı bulunmamaktadır.</p>
                        </CardContent>
                      </Card>
                    ) : (
                      scholarData.achievements.map((achievement) => (
                        <Card key={achievement.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">{achievement.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(achievement.date).toLocaleDateString("tr-TR")}
                                </p>
                                <p className="mt-2">{achievement.description}</p>
                              </div>
                              <Badge variant="outline">Başarı</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>

                  <div className="flex justify-center">
                    <Button variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      Yeni Başarı Ekle
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
