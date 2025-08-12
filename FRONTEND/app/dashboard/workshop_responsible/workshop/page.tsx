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
import { useToast } from "@/components/ui/use-toast"
import { Building2, CalendarDays, Edit, FileText, MapPin, Phone, Users } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample workshop data
const workshopData = {
  id: 1,
  name: "İstanbul - Pendik Atölyesi",
  address: "Batı Mahallesi, Erol Kaya Caddesi No:125, Pendik, İstanbul",
  phone: "+90 216 555 1234",
  email: "pendik@deneyap.org",
  type: "Teknoloji Atölyesi",
  status: "active",
  region: "Marmara Bölgesi",
  city: "İstanbul",
  district: "Pendik",
  establishmentDate: "2022-09-01",
  lastMaintenanceDate: "2023-12-15",
  capacity: 120,
  currentScholarCount: 85,
  currentTrainerCount: 3,
  attendanceRate: 85,
  equipmentStatus: 92,
  responsiblePerson: {
    id: 1,
    name: "Ahmet Yılmaz",
    title: "Atölye Sorumlusu",
    phone: "+90 555 123 4567",
    email: "ahmet.yilmaz@deneyap.org",
    image: "/placeholder.svg?height=40&width=40",
  },
  trainers: [
    {
      id: 1,
      name: "Prof. Dr. Ahmet Arslan",
      subject: "Robotik",
      status: "active",
    },
    {
      id: 2,
      name: "Doç. Dr. Ayşe Yılmaz",
      subject: "Yazılım",
      status: "active",
    },
    {
      id: 3,
      name: "Dr. Mehmet Kaya",
      subject: "Elektronik",
      status: "active",
    },
  ],
  equipment: [
    { id: 1, name: "3D Yazıcı", count: 5, status: "working" },
    { id: 2, name: "Robotik Kit", count: 30, status: "working" },
    { id: 3, name: "Bilgisayar", count: 25, status: "working" },
    { id: 4, name: "Arduino Set", count: 40, status: "working" },
    { id: 5, name: "Elektronik Devre Kiti", count: 35, status: "working" },
    { id: 6, name: "Drone Kit", count: 10, status: "working" },
  ],
  upcomingEvents: [
    {
      id: 1,
      title: "Mart Ayı Yoklama Son Tarihi",
      date: "2025-04-05",
      type: "deadline",
    },
    {
      id: 2,
      title: "Atölye Eğitmen Toplantısı",
      date: "2025-03-22",
      type: "meeting",
    },
    {
      id: 3,
      title: "Robotik Takımı Çalışması",
      date: "2025-03-15",
      type: "event",
    },
  ],
}

export default function UserWorkshopPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [equipmentDialogOpen, setEquipmentDialogOpen] = useState(false)
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false)

  const handleEquipmentRequest = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Malzeme talebi oluşturuldu",
      description: "Malzeme talep formunuz başarıyla gönderildi.",
    })
    setEquipmentDialogOpen(false)
  }

  const handleMaintenanceRequest = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Bakım talebi oluşturuldu",
      description: "Bakım talep formunuz başarıyla gönderildi.",
    })
    setMaintenanceDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Atölye Bilgileri</h1>
          <p className="text-muted-foreground">Atölye detayları ve yönetimi</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/workshop_responsible/workshop/edit">
              <Edit className="mr-2 h-4 w-4" />
              Düzenle
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/workshop_responsible/workshop/reports">
              <FileText className="mr-2 h-4 w-4" />
              Raporlar
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{workshopData.name}</CardTitle>
                <CardDescription>{workshopData.type}</CardDescription>
              </div>
              <Badge variant={workshopData.status === "active" ? "default" : "secondary"}>
                {workshopData.status === "active" ? "Aktif" : "Pasif"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
                <TabsTrigger value="trainers">Eğitmenler</TabsTrigger>
                <TabsTrigger value="equipment">Ekipmanlar</TabsTrigger>
                <TabsTrigger value="events">Etkinlikler</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Bursiyer Sayısı</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{workshopData.currentScholarCount}</div>
                      <p className="text-xs text-muted-foreground">Kapasite: {workshopData.capacity}</p>
                      <Progress
                        value={(workshopData.currentScholarCount / workshopData.capacity) * 100}
                        className="h-2 mt-2"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Yoklama Oranı</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">%{workshopData.attendanceRate}</div>
                      <Progress value={workshopData.attendanceRate} className="h-2 mt-2" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Ekipman Durumu</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">%{workshopData.equipmentStatus}</div>
                      <Progress value={workshopData.equipmentStatus} className="h-2 mt-2" />
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Atölye Bilgileri</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Adres</p>
                          <p className="text-sm text-muted-foreground">{workshopData.address}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">İletişim</p>
                          <p className="text-sm text-muted-foreground">{workshopData.phone}</p>
                          <p className="text-sm text-muted-foreground">{workshopData.email}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Bölge Bilgisi</p>
                          <p className="text-sm text-muted-foreground">
                            {workshopData.region} / {workshopData.city} / {workshopData.district}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Tarihler</p>
                          <p className="text-sm text-muted-foreground">
                            Kuruluş: {new Date(workshopData.establishmentDate).toLocaleDateString("tr-TR")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Son Bakım: {new Date(workshopData.lastMaintenanceDate).toLocaleDateString("tr-TR")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Hızlı İşlemler</h3>
                    <div className="space-y-4">
                      <Dialog open={equipmentDialogOpen} onOpenChange={setEquipmentDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="w-full">Malzeme Talebi Oluştur</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <form onSubmit={handleEquipmentRequest}>
                            <DialogHeader>
                              <DialogTitle>Malzeme Talebi Oluştur</DialogTitle>
                              <DialogDescription>
                                Atölyeniz için ihtiyaç duyduğunuz malzemeleri talep edin.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="equipment-name">Malzeme Adı</Label>
                                <Input id="equipment-name" placeholder="Talep edilen malzeme adı" required />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="equipment-quantity">Adet</Label>
                                  <Input id="equipment-quantity" type="number" min="1" placeholder="Adet" required />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="equipment-priority">Öncelik</Label>
                                  <Select defaultValue="normal">
                                    <SelectTrigger id="equipment-priority">
                                      <SelectValue placeholder="Öncelik seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="low">Düşük</SelectItem>
                                      <SelectItem value="normal">Normal</SelectItem>
                                      <SelectItem value="high">Yüksek</SelectItem>
                                      <SelectItem value="urgent">Acil</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="equipment-reason">Gerekçe</Label>
                                <Textarea id="equipment-reason" placeholder="Malzeme talep gerekçesi" required />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="equipment-notes">Ek Notlar</Label>
                                <Textarea id="equipment-notes" placeholder="Varsa ek notlar" />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit">Talebi Gönder</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>

                      <Dialog open={maintenanceDialogOpen} onOpenChange={setMaintenanceDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="w-full" variant="outline">
                            Bakım Talebi Oluştur
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <form onSubmit={handleMaintenanceRequest}>
                            <DialogHeader>
                              <DialogTitle>Bakım Talebi Oluştur</DialogTitle>
                              <DialogDescription>
                                Atölyenizdeki ekipmanlar için bakım talebi oluşturun.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="maintenance-equipment">Ekipman</Label>
                                <Select defaultValue="">
                                  <SelectTrigger id="maintenance-equipment">
                                    <SelectValue placeholder="Ekipman seçin" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="3d-printer">3D Yazıcı</SelectItem>
                                    <SelectItem value="robotics-kit">Robotik Kit</SelectItem>
                                    <SelectItem value="computer">Bilgisayar</SelectItem>
                                    <SelectItem value="arduino">Arduino Set</SelectItem>
                                    <SelectItem value="electronics">Elektronik Devre Kiti</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="maintenance-issue">Sorun Açıklaması</Label>
                                <Textarea id="maintenance-issue" placeholder="Sorun detayları" required />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="maintenance-priority">Öncelik</Label>
                                <Select defaultValue="normal">
                                  <SelectTrigger id="maintenance-priority">
                                    <SelectValue placeholder="Öncelik seçin" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="low">Düşük</SelectItem>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="high">Yüksek</SelectItem>
                                    <SelectItem value="urgent">Acil</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="maintenance-notes">Ek Notlar</Label>
                                <Textarea id="maintenance-notes" placeholder="Varsa ek notlar" />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit">Talebi Gönder</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>

                      <Button className="w-full" variant="outline" asChild>
                        <Link href="/dashboard/workshop_responsible/workshop/inventory">Envanter Yönetimi</Link>
                      </Button>
                      <Button className="w-full" variant="outline" asChild>
                        <Link href="/dashboard/workshop_responsible/scholars">Bursiyer Yönetimi</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="trainers" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Eğitmenler ({workshopData.trainers.length})</h3>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard/workshop_responsible/trainers">Tüm Eğitmenler</Link>
                    </Button>
                  </div>

                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Eğitmen</TableHead>
                          <TableHead>Alan</TableHead>
                          <TableHead>Durum</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {workshopData.trainers.map((trainer) => (
                          <TableRow key={trainer.id}>
                            <TableCell className="font-medium">{trainer.name}</TableCell>
                            <TableCell>{trainer.subject}</TableCell>
                            <TableCell>
                              <Badge variant={trainer.status === "active" ? "outline" : "secondary"}>
                                {trainer.status === "active" ? "Aktif" : "İzinli"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="equipment" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Ekipmanlar</h3>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard/workshop_responsible/workshop/inventory">Envanter Yönetimi</Link>
                    </Button>
                  </div>

                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ekipman</TableHead>
                          <TableHead>Adet</TableHead>
                          <TableHead>Durum</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {workshopData.equipment.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.count}</TableCell>
                            <TableCell>
                              <Badge variant={item.status === "working" ? "outline" : "destructive"}>
                                {item.status === "working" ? "Çalışıyor" : "Arızalı"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="events" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Yaklaşan Etkinlikler</h3>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard/workshop_responsible/calendar">Takvimi Görüntüle</Link>
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {workshopData.upcomingEvents.map((event) => (
                      <Card key={event.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">{event.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(event.date).toLocaleDateString("tr-TR")}
                              </p>
                            </div>
                            <Badge
                              variant={
                                event.type === "deadline"
                                  ? "destructive"
                                  : event.type === "meeting"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {event.type === "deadline"
                                ? "Son Tarih"
                                : event.type === "meeting"
                                  ? "Toplantı"
                                  : "Etkinlik"}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Atölye Sorumlusu</CardTitle>
            <CardDescription>Atölye sorumlusu bilgileri</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={workshopData.responsiblePerson.image} alt={workshopData.responsiblePerson.name} />
              <AvatarFallback>{workshopData.responsiblePerson.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-bold">{workshopData.responsiblePerson.name}</h3>
            <p className="text-muted-foreground mt-1">{workshopData.responsiblePerson.title}</p>

            <Separator className="my-4" />

            <div className="w-full space-y-2 text-left">
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-sm">{workshopData.responsiblePerson.phone}</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-sm">{workshopData.responsiblePerson.email}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full" variant="outline" asChild>
              <Link href="/dashboard/workshop_responsible/messages">
                <Users className="mr-2 h-4 w-4" />
                Mesajlar
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
