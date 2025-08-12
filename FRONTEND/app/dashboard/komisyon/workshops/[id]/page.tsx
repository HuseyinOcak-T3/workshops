"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeftIcon, CalendarIcon, Edit, FileText, Mail, MapPin, MessageSquare, Phone, Users } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

// Workshop data type
type Workshop = {
  id: number
  name: string
  city: string
  district: string
  region: string
  address: string
  phone: string
  email: string
  scholarCount: number
  trainerCount: number
  taskCompletion: number
  status: "active" | "inactive" | "maintenance"
  description: string
  foundedAt: string
  lastMaintenance: string
  manager: {
    id: number
    name: string
    email: string
    phone: string
    title: string
    avatar: string
  }
}

// Scholar data type
type Scholar = {
  id: number
  name: string
  email: string
  phone: string
  attendanceRate: number
  taskCompletion: number
  joinedAt: string
  avatar: string
}

// Trainer data type
type Trainer = {
  id: number
  name: string
  email: string
  phone: string
  specialization: string
  joinedAt: string
  avatar: string
}

// Task data type
type Task = {
  id: number
  title: string
  dueDate: string
  status: "completed" | "in-progress" | "pending"
  assignedTo: string
  priority: "low" | "medium" | "high"
}

// Sample workshop data
const workshopData: Workshop[] = [
  {
    id: 1,
    name: "Pendik Atölyesi",
    city: "İstanbul",
    district: "Pendik",
    region: "Marmara",
    address: "Batı Mah. Erol Kaya Cad. No:42 Pendik/İstanbul",
    phone: "+90 216 555 1234",
    email: "pendik@deneyap.org",
    scholarCount: 24,
    trainerCount: 3,
    taskCompletion: 95,
    status: "active",
    description:
      "Pendik Deneyap Atölyesi, 2019 yılında kurulmuş olup, robotik, kodlama ve yapay zeka alanlarında eğitim vermektedir.",
    foundedAt: "2019-05-15",
    lastMaintenance: "2023-08-10",
    manager: {
      id: 101,
      name: "Ahmet Yılmaz",
      email: "ahmet.yilmaz@deneyap.org",
      phone: "+90 555 123 4567",
      title: "Atölye Sorumlusu",
      avatar: "",
    },
  },
  {
    id: 2,
    name: "Kadıköy Atölyesi",
    city: "İstanbul",
    district: "Kadıköy",
    region: "Marmara",
    address: "Caferağa Mah. Moda Cad. No:120 Kadıköy/İstanbul",
    phone: "+90 216 555 5678",
    email: "kadikoy@deneyap.org",
    scholarCount: 28,
    trainerCount: 4,
    taskCompletion: 88,
    status: "active",
    description:
      "Kadıköy Deneyap Atölyesi, 2020 yılında kurulmuş olup, elektronik, kodlama ve 3D tasarım alanlarında eğitim vermektedir.",
    foundedAt: "2020-02-20",
    lastMaintenance: "2023-07-05",
    manager: {
      id: 102,
      name: "Zeynep Demir",
      email: "zeynep.demir@deneyap.org",
      phone: "+90 555 234 5678",
      title: "Atölye Sorumlusu",
      avatar: "",
    },
  },
  // Diğer atölyeler...
]

// Sample scholars data
const scholarData: Scholar[] = [
  {
    id: 1,
    name: "Ahmet Yılmaz",
    email: "ahmet.yilmaz@example.com",
    phone: "+90 532 123 4567",
    attendanceRate: 95,
    taskCompletion: 92,
    joinedAt: "2022-09-01",
    avatar: "",
  },
  {
    id: 2,
    name: "Ayşe Demir",
    email: "ayse.demir@example.com",
    phone: "+90 533 765 4321",
    attendanceRate: 88,
    taskCompletion: 85,
    joinedAt: "2022-09-01",
    avatar: "",
  },
  {
    id: 3,
    name: "Mehmet Kaya",
    email: "mehmet.kaya@example.com",
    phone: "+90 535 987 6543",
    attendanceRate: 92,
    taskCompletion: 90,
    joinedAt: "2022-09-01",
    avatar: "",
  },
  {
    id: 4,
    name: "Zeynep Şahin",
    email: "zeynep.sahin@example.com",
    phone: "+90 536 234 5678",
    attendanceRate: 97,
    taskCompletion: 94,
    joinedAt: "2022-09-01",
    avatar: "",
  },
  {
    id: 5,
    name: "Mustafa Öztürk",
    email: "mustafa.ozturk@example.com",
    phone: "+90 537 345 6789",
    attendanceRate: 85,
    taskCompletion: 82,
    joinedAt: "2022-09-01",
    avatar: "",
  },
]

// Sample trainers data
const trainerData: Trainer[] = [
  {
    id: 1,
    name: "Prof. Dr. Emre Yıldız",
    email: "emre.yildiz@example.com",
    phone: "+90 532 987 6543",
    specialization: "Robotik ve Yapay Zeka",
    joinedAt: "2019-05-15",
    avatar: "",
  },
  {
    id: 2,
    name: "Doç. Dr. Selin Aksoy",
    email: "selin.aksoy@example.com",
    phone: "+90 533 876 5432",
    specialization: "Elektronik ve Gömülü Sistemler",
    joinedAt: "2019-06-01",
    avatar: "",
  },
  {
    id: 3,
    name: "Dr. Öğr. Üyesi Burak Aydın",
    email: "burak.aydin@example.com",
    phone: "+90 535 765 4321",
    specialization: "Yazılım ve Mobil Uygulama Geliştirme",
    joinedAt: "2020-01-15",
    avatar: "",
  },
]

// Sample tasks data
const taskData: Task[] = [
  {
    id: 1,
    title: "Arduino ile Akıllı Ev Sistemi Projesi",
    dueDate: "2023-12-15",
    status: "in-progress",
    assignedTo: "Robotik Grubu",
    priority: "high",
  },
  {
    id: 2,
    title: "Mobil Uygulama Geliştirme Eğitimi",
    dueDate: "2023-11-30",
    status: "completed",
    assignedTo: "Yazılım Grubu",
    priority: "medium",
  },
  {
    id: 3,
    title: "3D Yazıcı Bakımı",
    dueDate: "2023-12-05",
    status: "pending",
    assignedTo: "Teknik Ekip",
    priority: "low",
  },
  {
    id: 4,
    title: "Yapay Zeka Projesi Sunumu",
    dueDate: "2023-12-20",
    status: "in-progress",
    assignedTo: "Yapay Zeka Grubu",
    priority: "high",
  },
  {
    id: 5,
    title: "Elektronik Devre Tasarımı Atölyesi",
    dueDate: "2023-12-10",
    status: "in-progress",
    assignedTo: "Elektronik Grubu",
    priority: "medium",
  },
]

export default function AdminWorkshopDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [scholars, setScholars] = useState<Scholar[]>([])
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [sendingMessage, setSendingMessage] = useState(false)

  useEffect(() => {
    // Simulating API call to get workshop details
    const workshopId = Number(params.id)
    const foundWorkshop = workshopData.find((w) => w.id === workshopId)

    if (foundWorkshop) {
      setWorkshop(foundWorkshop)
      setScholars(scholarData)
      setTrainers(trainerData)
      setTasks(taskData)
    }

    setLoading(false)
  }, [params.id])

  const handleSendMessage = async () => {
    if (!message.trim()) return

    setSendingMessage(true)

    // Simulating API call to send message
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Mesaj gönderildi",
      description: `${workshop?.manager.name} kişisine mesajınız iletildi.`,
    })

    // Mesaj gönderildikten sonra chat ekranına yeni mesaj eklenebilir
    // Bu kısım gerçek bir uygulamada backend ile entegre edilmelidir

    setMessage("")
    setSendingMessage(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Yükleniyor...</div>
  }

  if (!workshop) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Atölye bulunamadı</h1>
        <Button asChild>
          <Link href="/dashboard/admin/workshops">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Atölye Listesine Dön
          </Link>
        </Button>
      </div>
    )
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

  const getTaskStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50 border-green-200">
            Tamamlandı
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 hover:bg-blue-50 border-blue-200">
            Devam Ediyor
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 hover:bg-yellow-50 border-yellow-200">
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
          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 hover:bg-yellow-50 border-yellow-200">
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Button variant="outline" size="sm" asChild className="mb-4">
            <Link href="/dashboard/admin/workshops">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Atölye Listesine Dön
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{workshop.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              {workshop.district}, {workshop.city} ({workshop.region})
            </p>
            {getStatusBadge(workshop.status)}
          </div>
        </div>
        <Button asChild>
          <Link href={`/dashboard/commission/workshops/${workshop.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Atölyeyi Düzenle
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bursiyer Sayısı</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workshop.scholarCount}</div>
            <p className="text-xs text-muted-foreground">Aktif bursiyer</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eğitmen Sayısı</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workshop.trainerCount}</div>
            <p className="text-xs text-muted-foreground">Aktif eğitmen</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Görev Tamamlama</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">%{workshop.taskCompletion}</div>
            <Progress value={workshop.taskCompletion} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kuruluş Tarihi</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDate(workshop.foundedAt)}</div>
            <p className="text-xs text-muted-foreground">Son bakım: {formatDate(workshop.lastMaintenance)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Atölye Bilgileri</CardTitle>
            <CardDescription>Atölye hakkında detaylı bilgiler</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">İletişim Bilgileri</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-start">
                    <div className="w-24 flex-shrink-0 text-sm font-medium">Adres:</div>
                    <div className="text-sm">{workshop.address}</div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-24 flex-shrink-0 text-sm font-medium">Telefon:</div>
                    <div className="text-sm">{workshop.phone}</div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-24 flex-shrink-0 text-sm font-medium">E-posta:</div>
                    <div className="text-sm">{workshop.email}</div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium">Açıklama</h3>
                <p className="mt-2 text-sm">{workshop.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atölye Sorumlusu</CardTitle>
            <CardDescription>İletişim bilgileri ve mesaj gönderme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={workshop.manager.avatar} alt={workshop.manager.name} />
                <AvatarFallback>
                  {workshop.manager.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-medium">{workshop.manager.name}</h3>
                <p className="text-sm text-muted-foreground">{workshop.manager.title}</p>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${workshop.manager.email}`} className="text-sm hover:underline">
                      {workshop.manager.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${workshop.manager.phone}`} className="text-sm hover:underline">
                      {workshop.manager.phone}
                    </a>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="mt-4" variant="outline">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      İletişime Geç
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Atölye Sorumlusu ile İletişim</DialogTitle>
                      <DialogDescription>
                        {workshop.manager.name} ile iletişime geçmek için bir yöntem seçin.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Tabs defaultValue="chat">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="chat">Mesajlaşma</TabsTrigger>
                          <TabsTrigger value="email">E-posta Gönder</TabsTrigger>
                        </TabsList>
                        <TabsContent value="chat" className="space-y-4 mt-4">
                          <div className="flex items-center gap-3 mb-4">
                            <Avatar>
                              <AvatarFallback>
                                {workshop.manager.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{workshop.manager.name}</div>
                              <div className="text-sm text-muted-foreground">{workshop.manager.title}</div>
                            </div>
                          </div>

                          <div className="border rounded-md p-4 h-[200px] overflow-y-auto flex flex-col gap-2">
                            <div className="bg-muted p-2 rounded-md self-start max-w-[80%]">
                              <p className="text-sm">Merhaba, size nasıl yardımcı olabilirim?</p>
                              <span className="text-xs text-muted-foreground">10:30</span>
                            </div>
                            <div className="bg-primary text-primary-foreground p-2 rounded-md self-end max-w-[80%]">
                              <p className="text-sm">Merhaba, atölyenizle ilgili birkaç sorum olacaktı.</p>
                              <span className="text-xs text-primary-foreground/70">10:31</span>
                            </div>
                            <div className="bg-muted p-2 rounded-md self-start max-w-[80%]">
                              <p className="text-sm">Tabii, sorularınızı yanıtlamaktan memnuniyet duyarım.</p>
                              <span className="text-xs text-muted-foreground">10:32</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Textarea
                              placeholder="Mesajınızı yazın..."
                              className="min-h-[80px]"
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                            />
                            <Button
                              className="self-end"
                              onClick={handleSendMessage}
                              disabled={sendingMessage || !message.trim()}
                            >
                              {sendingMessage ? "..." : "Gönder"}
                            </Button>
                          </div>
                        </TabsContent>

                        <TabsContent value="email" className="space-y-4 mt-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {workshop.manager.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{workshop.manager.name}</div>
                              <div className="text-sm text-muted-foreground">{workshop.manager.email}</div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label htmlFor="subject" className="text-sm font-medium">
                              Konu
                            </label>
                            <input id="subject" className="w-full p-2 border rounded-md" placeholder="E-posta konusu" />
                          </div>

                          <div className="space-y-2">
                            <label htmlFor="email-message" className="text-sm font-medium">
                              Mesaj
                            </label>
                            <Textarea
                              id="email-message"
                              placeholder="E-posta mesajınızı buraya yazın..."
                              className="min-h-[150px]"
                            />
                          </div>

                          <Button
                            className="w-full"
                            onClick={() => {
                              toast({
                                title: "E-posta gönderildi",
                                description: `${workshop.manager.name} kişisine e-postanız başarıyla gönderildi.`,
                              })
                            }}
                          >
                            E-posta Gönder
                          </Button>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="scholars">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scholars">Bursiyerler</TabsTrigger>
          <TabsTrigger value="trainers">Eğitmenler</TabsTrigger>
          <TabsTrigger value="tasks">Görevler</TabsTrigger>
        </TabsList>
        <TabsContent value="scholars" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Bursiyerler</CardTitle>
              <CardDescription>Atölyeye kayıtlı bursiyerler listesi</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>İsim</TableHead>
                    <TableHead>E-posta</TableHead>
                    <TableHead>Katılım Oranı</TableHead>
                    <TableHead>Görev Tamamlama</TableHead>
                    <TableHead>Katılım Tarihi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scholars.map((scholar) => (
                    <TableRow key={scholar.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={scholar.avatar} alt={scholar.name} />
                            <AvatarFallback>
                              {scholar.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>{scholar.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>{scholar.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={scholar.attendanceRate} className="h-2 w-20" />
                          <span>%{scholar.attendanceRate}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={scholar.taskCompletion} className="h-2 w-20" />
                          <span>%{scholar.taskCompletion}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(scholar.joinedAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="trainers" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Eğitmenler</CardTitle>
              <CardDescription>Atölyede görev yapan eğitmenler listesi</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>İsim</TableHead>
                    <TableHead>E-posta</TableHead>
                    <TableHead>Uzmanlık Alanı</TableHead>
                    <TableHead>Başlangıç Tarihi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainers.map((trainer) => (
                    <TableRow key={trainer.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={trainer.avatar} alt={trainer.name} />
                            <AvatarFallback>
                              {trainer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>{trainer.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>{trainer.email}</TableCell>
                      <TableCell>{trainer.specialization}</TableCell>
                      <TableCell>{formatDate(trainer.joinedAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tasks" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Görevler</CardTitle>
              <CardDescription>Atölyeye atanmış görevler listesi</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Görev Adı</TableHead>
                    <TableHead>Atanan Grup</TableHead>
                    <TableHead>Son Tarih</TableHead>
                    <TableHead>Öncelik</TableHead>
                    <TableHead>Durum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>{task.assignedTo}</TableCell>
                      <TableCell>{formatDate(task.dueDate)}</TableCell>
                      <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                      <TableCell>{getTaskStatusBadge(task.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
