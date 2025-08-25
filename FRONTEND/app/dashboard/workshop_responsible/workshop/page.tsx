// "use client"
// ###burasııı
// ## ekipman durumu ile alaklı yerlere not düşülecek (kullanılmayacak)

// import type React from "react"

// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Progress } from "@/components/ui/progress"
// import { Separator } from "@/components/ui/separator"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { useToast } from "@/components/ui/use-toast"
// import { Building2, CalendarDays, Edit, FileText, MapPin, Phone, Users } from "lucide-react"
// import Link from "next/link"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// // Sample workshop data
// const workshopData = {
//   id: 1,
//   name: "İstanbul - Pendik Atölyesi",
//   address: "Batı Mahallesi, Erol Kaya Caddesi No:125, Pendik, İstanbul",
//   phone: "+90 216 555 1234",
//   email: "pendik@deneyap.org",
//   type: "Teknoloji Atölyesi",
//   status: "active",
//   region: "Marmara Bölgesi",
//   city: "İstanbul",
//   district: "Pendik",
//   establishmentDate: "2022-09-01",
//   lastMaintenanceDate: "2023-12-15",
//   capacity: 120,
//   currentScholarCount: 85,
//   currentTrainerCount: 3,
//   attendanceRate: 85,
//   equipmentStatus: 92,
//   responsiblePerson: {
//     id: 1,
//     name: "Ahmet Yılmaz",
//     title: "Atölye Sorumlusu",
//     phone: "+90 555 123 4567",
//     email: "ahmet.yilmaz@deneyap.org",
//     image: "/placeholder.svg?height=40&width=40",
//   },
//   trainers: [
//     {
//       id: 1,
//       name: "Prof. Dr. Ahmet Arslan",
//       subject: "Robotik",
//       status: "active",
//     },
//     {
//       id: 2,
//       name: "Doç. Dr. Ayşe Yılmaz",
//       subject: "Yazılım",
//       status: "active",
//     },
//     {
//       id: 3,
//       name: "Dr. Mehmet Kaya",
//       subject: "Elektronik",
//       status: "active",
//     },
//   ],
//   equipment: [
//     { id: 1, name: "3D Yazıcı", count: 5, status: "working" },
//     { id: 2, name: "Robotik Kit", count: 30, status: "working" },
//     { id: 3, name: "Bilgisayar", count: 25, status: "working" },
//     { id: 4, name: "Arduino Set", count: 40, status: "working" },
//     { id: 5, name: "Elektronik Devre Kiti", count: 35, status: "working" },
//     { id: 6, name: "Drone Kit", count: 10, status: "working" },
//   ],
//   upcomingEvents: [
//     {
//       id: 1,
//       title: "Mart Ayı Yoklama Son Tarihi",
//       date: "2025-04-05",
//       type: "deadline",
//     },
//     {
//       id: 2,
//       title: "Atölye Eğitmen Toplantısı",
//       date: "2025-03-22",
//       type: "meeting",
//     },
//     {
//       id: 3,
//       title: "Robotik Takımı Çalışması",
//       date: "2025-03-15",
//       type: "event",
//     },
//   ],
// }

// export default function UserWorkshopPage() {
//   const { toast } = useToast()
//   const [activeTab, setActiveTab] = useState("overview")
//   const [equipmentDialogOpen, setEquipmentDialogOpen] = useState(false)
//   const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false)

//   const handleEquipmentRequest = (e: React.FormEvent) => {
//     e.preventDefault()
//     toast({
//       title: "Malzeme talebi oluşturuldu",
//       description: "Malzeme talep formunuz başarıyla gönderildi.",
//     })
//     setEquipmentDialogOpen(false)
//   }

//   const handleMaintenanceRequest = (e: React.FormEvent) => {
//     e.preventDefault()
//     toast({
//       title: "Bakım talebi oluşturuldu",
//       description: "Bakım talep formunuz başarıyla gönderildi.",
//     })
//     setMaintenanceDialogOpen(false)
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Atölye Bilgileri</h1>
//           <p className="text-muted-foreground">Atölye detayları ve yönetimi</p>
//         </div>

//         <div className="flex items-center gap-2">
//           <Button variant="outline" asChild>
//             <Link href="/dashboard/workshop_responsible/workshop/edit">
//               <Edit className="mr-2 h-4 w-4" />
//               Düzenle
//             </Link>
//           </Button>
//           <Button asChild>
//             <Link href="/dashboard/workshop_responsible/workshop/reports">
//               <FileText className="mr-2 h-4 w-4" />
//               Raporlar
//             </Link>
//           </Button>
//         </div>
//       </div>

//       <div className="grid gap-6 md:grid-cols-7">
//         <Card className="md:col-span-5">
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <div>
//                 <CardTitle>{workshopData.name}</CardTitle>
//                 <CardDescription>{workshopData.type}</CardDescription>
//               </div>
//               <Badge variant={workshopData.status === "active" ? "default" : "secondary"}>
//                 {workshopData.status === "active" ? "Aktif" : "Pasif"}
//               </Badge>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <Tabs defaultValue="overview" onValueChange={setActiveTab}>
//               <TabsList className="grid w-full grid-cols-4">
//                 <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
//                 <TabsTrigger value="trainers">Eğitmenler</TabsTrigger>
//                 <TabsTrigger value="equipment">Ekipmanlar</TabsTrigger>
//                 <TabsTrigger value="events">Etkinlikler</TabsTrigger>
//               </TabsList>

//               <TabsContent value="overview" className="mt-6 space-y-6">
//                 <div className="grid gap-6 md:grid-cols-3">
//                   <Card>
//                     <CardHeader className="pb-2">
//                       <CardTitle className="text-sm font-medium">Bursiyer Sayısı</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="text-2xl font-bold">{workshopData.currentScholarCount}</div>
//                       <p className="text-xs text-muted-foreground">Kapasite: {workshopData.capacity}</p>
//                       <Progress
//                         value={(workshopData.currentScholarCount / workshopData.capacity) * 100}
//                         className="h-2 mt-2"
//                       />
//                     </CardContent>
//                   </Card>

//                   <Card>
//                     <CardHeader className="pb-2">
//                       <CardTitle className="text-sm font-medium">Yoklama Oranı</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="text-2xl font-bold">%{workshopData.attendanceRate}</div>
//                       <Progress value={workshopData.attendanceRate} className="h-2 mt-2" />
//                     </CardContent>
//                   </Card>

//                   <Card>
//                     <CardHeader className="pb-2">
//                       <CardTitle className="text-sm font-medium">Ekipman Durumu</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="text-2xl font-bold">%{workshopData.equipmentStatus}</div>
//                       <Progress value={workshopData.equipmentStatus} className="h-2 mt-2" />
//                     </CardContent>
//                   </Card>
//                 </div>

//                 <div className="grid gap-6 md:grid-cols-2">
//                   <div>
//                     <h3 className="text-lg font-medium mb-4">Atölye Bilgileri</h3>
//                     <div className="space-y-4">
//                       <div className="flex items-start gap-2">
//                         <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
//                         <div>
//                           <p className="font-medium">Adres</p>
//                           <p className="text-sm text-muted-foreground">{workshopData.address}</p>
//                         </div>
//                       </div>

//                       <div className="flex items-start gap-2">
//                         <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
//                         <div>
//                           <p className="font-medium">İletişim</p>
//                           <p className="text-sm text-muted-foreground">{workshopData.phone}</p>
//                           <p className="text-sm text-muted-foreground">{workshopData.email}</p>
//                         </div>
//                       </div>

//                       <div className="flex items-start gap-2">
//                         <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
//                         <div>
//                           <p className="font-medium">Bölge Bilgisi</p>
//                           <p className="text-sm text-muted-foreground">
//                             {workshopData.region} / {workshopData.city} / {workshopData.district}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="flex items-start gap-2">
//                         <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5" />
//                         <div>
//                           <p className="font-medium">Tarihler</p>
//                           <p className="text-sm text-muted-foreground">
//                             Kuruluş: {new Date(workshopData.establishmentDate).toLocaleDateString("tr-TR")}
//                           </p>
//                           <p className="text-sm text-muted-foreground">
//                             Son Bakım: {new Date(workshopData.lastMaintenanceDate).toLocaleDateString("tr-TR")}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div>
//                     <h3 className="text-lg font-medium mb-4">Hızlı İşlemler</h3>
//                     <div className="space-y-4">
//                       <Dialog open={equipmentDialogOpen} onOpenChange={setEquipmentDialogOpen}>
//                         <DialogTrigger asChild>
//                           <Button className="w-full">Malzeme Talebi Oluştur</Button>
//                         </DialogTrigger>
//                         <DialogContent className="sm:max-w-[600px]">
//                           <form onSubmit={handleEquipmentRequest}>
//                             <DialogHeader>
//                               <DialogTitle>Malzeme Talebi Oluştur</DialogTitle>
//                               <DialogDescription>
//                                 Atölyeniz için ihtiyaç duyduğunuz malzemeleri talep edin.
//                               </DialogDescription>
//                             </DialogHeader>
//                             <div className="grid gap-4 py-4">
//                               <div className="grid gap-2">
//                                 <Label htmlFor="equipment-name">Malzeme Adı</Label>
//                                 <Input id="equipment-name" placeholder="Talep edilen malzeme adı" required />
//                               </div>
//                               <div className="grid grid-cols-2 gap-4">
//                                 <div className="grid gap-2">
//                                   <Label htmlFor="equipment-quantity">Adet</Label>
//                                   <Input id="equipment-quantity" type="number" min="1" placeholder="Adet" required />
//                                 </div>
//                                 <div className="grid gap-2">
//                                   <Label htmlFor="equipment-priority">Öncelik</Label>
//                                   <Select defaultValue="normal">
//                                     <SelectTrigger id="equipment-priority">
//                                       <SelectValue placeholder="Öncelik seçin" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                       <SelectItem value="low">Düşük</SelectItem>
//                                       <SelectItem value="normal">Normal</SelectItem>
//                                       <SelectItem value="high">Yüksek</SelectItem>
//                                       <SelectItem value="urgent">Acil</SelectItem>
//                                     </SelectContent>
//                                   </Select>
//                                 </div>
//                               </div>
//                               <div className="grid gap-2">
//                                 <Label htmlFor="equipment-reason">Gerekçe</Label>
//                                 <Textarea id="equipment-reason" placeholder="Malzeme talep gerekçesi" required />
//                               </div>
//                               <div className="grid gap-2">
//                                 <Label htmlFor="equipment-notes">Ek Notlar</Label>
//                                 <Textarea id="equipment-notes" placeholder="Varsa ek notlar" />
//                               </div>
//                             </div>
//                             <DialogFooter>
//                               <Button type="submit">Talebi Gönder</Button>
//                             </DialogFooter>
//                           </form>
//                         </DialogContent>
//                       </Dialog>

//                       <Dialog open={maintenanceDialogOpen} onOpenChange={setMaintenanceDialogOpen}>
//                         <DialogTrigger asChild>
//                           <Button className="w-full" variant="outline">
//                             Bakım Talebi Oluştur
//                           </Button>
//                         </DialogTrigger>
//                         <DialogContent className="sm:max-w-[600px]">
//                           <form onSubmit={handleMaintenanceRequest}>
//                             <DialogHeader>
//                               <DialogTitle>Bakım Talebi Oluştur</DialogTitle>
//                               <DialogDescription>
//                                 Atölyenizdeki ekipmanlar için bakım talebi oluşturun.
//                               </DialogDescription>
//                             </DialogHeader>
//                             <div className="grid gap-4 py-4">
//                               <div className="grid gap-2">
//                                 <Label htmlFor="maintenance-equipment">Ekipman</Label>
//                                 <Select defaultValue="">
//                                   <SelectTrigger id="maintenance-equipment">
//                                     <SelectValue placeholder="Ekipman seçin" />
//                                   </SelectTrigger>
//                                   <SelectContent>
//                                     <SelectItem value="3d-printer">3D Yazıcı</SelectItem>
//                                     <SelectItem value="robotics-kit">Robotik Kit</SelectItem>
//                                     <SelectItem value="computer">Bilgisayar</SelectItem>
//                                     <SelectItem value="arduino">Arduino Set</SelectItem>
//                                     <SelectItem value="electronics">Elektronik Devre Kiti</SelectItem>
//                                   </SelectContent>
//                                 </Select>
//                               </div>
//                               <div className="grid gap-2">
//                                 <Label htmlFor="maintenance-issue">Sorun Açıklaması</Label>
//                                 <Textarea id="maintenance-issue" placeholder="Sorun detayları" required />
//                               </div>
//                               <div className="grid gap-2">
//                                 <Label htmlFor="maintenance-priority">Öncelik</Label>
//                                 <Select defaultValue="normal">
//                                   <SelectTrigger id="maintenance-priority">
//                                     <SelectValue placeholder="Öncelik seçin" />
//                                   </SelectTrigger>
//                                   <SelectContent>
//                                     <SelectItem value="low">Düşük</SelectItem>
//                                     <SelectItem value="normal">Normal</SelectItem>
//                                     <SelectItem value="high">Yüksek</SelectItem>
//                                     <SelectItem value="urgent">Acil</SelectItem>
//                                   </SelectContent>
//                                 </Select>
//                               </div>
//                               <div className="grid gap-2">
//                                 <Label htmlFor="maintenance-notes">Ek Notlar</Label>
//                                 <Textarea id="maintenance-notes" placeholder="Varsa ek notlar" />
//                               </div>
//                             </div>
//                             <DialogFooter>
//                               <Button type="submit">Talebi Gönder</Button>
//                             </DialogFooter>
//                           </form>
//                         </DialogContent>
//                       </Dialog>

//                       <Button className="w-full" variant="outline" asChild>
//                         <Link href="/dashboard/workshop_responsible/workshop/inventory">Envanter Yönetimi</Link>
//                       </Button>
//                       <Button className="w-full" variant="outline" asChild>
//                         <Link href="/dashboard/workshop_responsible/scholars">Bursiyer Yönetimi</Link>
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </TabsContent>

//               <TabsContent value="trainers" className="mt-6">
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <h3 className="text-lg font-medium">Eğitmenler ({workshopData.trainers.length})</h3>
//                     <Button variant="outline" size="sm" asChild>
//                       <Link href="/dashboard/workshop_responsible/trainers">Tüm Eğitmenler</Link>
//                     </Button>
//                   </div>

//                   <div className="border rounded-lg">
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead>Eğitmen</TableHead>
//                           <TableHead>Alan</TableHead>
//                           <TableHead>Durum</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {workshopData.trainers.map((trainer) => (
//                           <TableRow key={trainer.id}>
//                             <TableCell className="font-medium">{trainer.name}</TableCell>
//                             <TableCell>{trainer.subject}</TableCell>
//                             <TableCell>
//                               <Badge variant={trainer.status === "active" ? "outline" : "secondary"}>
//                                 {trainer.status === "active" ? "Aktif" : "İzinli"}
//                               </Badge>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </div>
//                 </div>
//               </TabsContent>

//               <TabsContent value="equipment" className="mt-6">
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <h3 className="text-lg font-medium">Ekipmanlar</h3>
//                     <Button variant="outline" size="sm" asChild>
//                       <Link href="/dashboard/workshop_responsible/workshop/inventory">Envanter Yönetimi</Link>
//                     </Button>
//                   </div>

//                   <div className="border rounded-lg">
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead>Ekipman</TableHead>
//                           <TableHead>Adet</TableHead>
//                           <TableHead>Durum</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {workshopData.equipment.map((item) => (
//                           <TableRow key={item.id}>
//                             <TableCell className="font-medium">{item.name}</TableCell>
//                             <TableCell>{item.count}</TableCell>
//                             <TableCell>
//                               <Badge variant={item.status === "working" ? "outline" : "destructive"}>
//                                 {item.status === "working" ? "Çalışıyor" : "Arızalı"}
//                               </Badge>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </div>
//                 </div>
//               </TabsContent>

//               <TabsContent value="events" className="mt-6">
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <h3 className="text-lg font-medium">Yaklaşan Etkinlikler</h3>
//                     <Button variant="outline" size="sm" asChild>
//                       <Link href="/dashboard/workshop_responsible/calendar">Takvimi Görüntüle</Link>
//                     </Button>
//                   </div>

//                   <div className="space-y-3">
//                     {workshopData.upcomingEvents.map((event) => (
//                       <Card key={event.id}>
//                         <CardContent className="p-4">
//                           <div className="flex items-start justify-between">
//                             <div>
//                               <h4 className="font-medium">{event.title}</h4>
//                               <p className="text-sm text-muted-foreground">
//                                 {new Date(event.date).toLocaleDateString("tr-TR")}
//                               </p>
//                             </div>
//                             <Badge
//                               variant={
//                                 event.type === "deadline"
//                                   ? "destructive"
//                                   : event.type === "meeting"
//                                     ? "default"
//                                     : "secondary"
//                               }
//                             >
//                               {event.type === "deadline"
//                                 ? "Son Tarih"
//                                 : event.type === "meeting"
//                                   ? "Toplantı"
//                                   : "Etkinlik"}
//                             </Badge>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     ))}
//                   </div>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </CardContent>
//         </Card>

//         <Card className="md:col-span-2">
//           <CardHeader>
//             <CardTitle>Atölye Sorumlusu</CardTitle>
//             <CardDescription>Atölye sorumlusu bilgileri</CardDescription>
//           </CardHeader>
//           <CardContent className="flex flex-col items-center text-center">
//             <Avatar className="h-24 w-24 mb-4">
//               <AvatarImage src={workshopData.responsiblePerson.image} alt={workshopData.responsiblePerson.name} />
//               <AvatarFallback>{workshopData.responsiblePerson.name.charAt(0)}</AvatarFallback>
//             </Avatar>
//             <h3 className="text-xl font-bold">{workshopData.responsiblePerson.name}</h3>
//             <p className="text-muted-foreground mt-1">{workshopData.responsiblePerson.title}</p>

//             <Separator className="my-4" />

//             <div className="w-full space-y-2 text-left">
//               <div className="flex items-center">
//                 <Phone className="h-4 w-4 text-muted-foreground mr-2" />
//                 <span className="text-sm">{workshopData.responsiblePerson.phone}</span>
//               </div>
//               <div className="flex items-center">
//                 <FileText className="h-4 w-4 text-muted-foreground mr-2" />
//                 <span className="text-sm">{workshopData.responsiblePerson.email}</span>
//               </div>
//             </div>
//           </CardContent>
//           <CardFooter className="flex flex-col gap-2">
//             <Button className="w-full" variant="outline" asChild>
//               <Link href="/dashboard/workshop_responsible/messages">
//                 <Users className="mr-2 h-4 w-4" />
//                 Mesajlar
//               </Link>
//             </Button>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   )
// }
"use client";

/**
 * - /api/workshops/:id'den veri çekiyor (id URL'den gelir, yoksa 1).
 * - "Ekipman Durumu" KPI'ı şimdilik gösterilmiyor (bilgi notu).
 * - Malzeme ve Bakım formları gerçek POST endpointlerine bağlı:
 *     POST /api/equipment-requests
 *     POST /api/maintenance-requests
 * - shadcn Select native <select> olmadığı için form gönderimine
 *   değerleri aktarmak üzere hidden input kullanıldı.
 */

import type React from "react";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Building2, CalendarDays, Edit, FileText, MapPin, Phone, Users } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ---------- Tipler ----------
type Trainer = { id: number; name: string; subject: string; status: "active" | "onleave" };
type Equipment = { id: number; name: string; count: number; status: "working" | "faulty" };
type EventItem = { id: number; title: string; date: string; type: "deadline" | "meeting" | "event" };
type EquipmentReq = { id:number; name:string; quantity:number; priority:string; created_at:string };
type MaintenanceReq = { id:number; equipment_name:string; issue:string; priority:string; created_at:string };

type ResponsiblePerson = {
  id: number;
  name: string;
  title: string;
  phone: string;
  email: string;
  image?: string;
};
type Workshop = {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  type: string;
  status: "active" | "inactive";
  region: string;
  city: string;
  district: string;
  establishmentDate: string;
  lastMaintenanceDate: string | null;
  capacity: number;
  currentScholarCount: number;
  attendanceRate: number;
  responsiblePerson: ResponsiblePerson;
  trainers?: Trainer[];
  equipment?: Equipment[];
  upcomingEvents?: EventItem[];
};

const API_BASE = "/api";

export default function UserWorkshopPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [equipmentDialogOpen, setEquipmentDialogOpen] = useState(false);
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false);

  // --- Dinamik veri state'i ---
  const sp = useSearchParams();
  const workshopId = Number(sp.get("id") ?? 1);

  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [recentEq, setRecentEq] = useState<EquipmentReq[]>([]);
  const [recentMaint, setRecentMaint] = useState<MaintenanceReq[]>([]);

  useEffect(() => {
  if (!workshop) return;
  (async () => {
    try {
      const [eqRes, mRes] = await Promise.all([
        fetch(`/api/equipment-requests/list?workshop=${workshop.id}`),
        fetch(`/api/maintenance-requests/list?workshop=${workshop.id}`),
      ]);
      if (eqRes.ok) setRecentEq((await eqRes.json()).slice(0,5));
      if (mRes.ok) setRecentMaint((await mRes.json()).slice(0,5));
    } catch {}
  })();
}, [workshop]);


  useEffect(() => {
    let aborted = false;
    async function run() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/workshops/${workshopId}`, { credentials: "include" });
        if (!res.ok) throw new Error(await res.text());
        const json = (await res.json()) as Workshop;
        if (!aborted) setWorkshop(json);
      } catch (e: any) {
        if (!aborted) setError(e?.message ?? "Bilinmeyen hata");
      } finally {
        if (!aborted) setLoading(false);
      }
    }
    run();
    return () => {
      aborted = true;
    };
  }, [workshopId]);

  // --- POST: Malzeme Talebi ---
  const [equipmentSubmitting, setEquipmentSubmitting] = useState(false);
  async function submitEquipmentRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!workshop) return;
    const fd = new FormData(e.currentTarget);
    const payload = {
      workshop: workshop.id,
      name: fd.get("equipment-name"),
      quantity: Number(fd.get("equipment-quantity")),
      priority: (fd.get("equipment-priority") as string) || "normal",
      reason: fd.get("equipment-reason"),
      notes: (fd.get("equipment-notes") as string) || "",
    };

    try {
      setEquipmentSubmitting(true);
      const res = await fetch(`${API_BASE}/equipment-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());

      toast({ title: "Malzeme talebi oluşturuldu", description: "Talebiniz başarıyla kaydedildi." });
      setEquipmentDialogOpen(false);
      e.currentTarget.reset();
    } catch (err: any) {
      toast({ title: "Talep oluşturulamadı", description: err?.message ?? "Bilinmeyen hata", variant: "destructive" });
    } finally {
      setEquipmentSubmitting(false);
    }
  }

  // --- POST: Bakım Talebi ---
  const [maintenanceSubmitting, setMaintenanceSubmitting] = useState(false);
  async function submitMaintenanceRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!workshop) return;
    const fd = new FormData(e.currentTarget);
    const payload = {
      workshop: workshop.id,
      equipment_name: (fd.get("maintenance-equipment") as string) || "",
      issue: fd.get("maintenance-issue"),
      priority: (fd.get("maintenance-priority") as string) || "normal",
      notes: (fd.get("maintenance-notes") as string) || "",
    };

    try {
      setMaintenanceSubmitting(true);
      const res = await fetch(`${API_BASE}/maintenance-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());

      toast({ title: "Bakım talebi oluşturuldu", description: "Talebiniz başarıyla kaydedildi." });
      setMaintenanceDialogOpen(false);
      e.currentTarget.reset();
    } catch (err: any) {
      toast({ title: "Talep oluşturulamadı", description: err?.message ?? "Bilinmeyen hata", variant: "destructive" });
    } finally {
      setMaintenanceSubmitting(false);
    }
  }

  // --- Yükleniyor / Hata ---
  if (loading) return <div className="p-6">Yükleniyor…</div>;
  if (error) return <div className="p-6 text-red-600">Hata: {error}</div>;
  if (!workshop) return null;

  const trainers = workshop.trainers ?? [];
  const equipment = workshop.equipment ?? [];
  const events = workshop.upcomingEvents ?? [];
  const capacityPct = Math.min(100, (workshop.currentScholarCount / Math.max(1, workshop.capacity)) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Atölye Bilgileri</h1>
          <p className="text-muted-foreground">Atölye detayları ve yönetimi</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/workshop_responsible/workshop/edit?id=${workshop.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Düzenle
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/workshop_responsible/workshop/reports?id=${workshop.id}`}>
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
                <CardTitle>{workshop.name}</CardTitle>
                <CardDescription>{workshop.type}</CardDescription>
              </div>
              <Badge variant={workshop.status === "active" ? "default" : "secondary"}>
                {workshop.status === "active" ? "Aktif" : "Pasif"}
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
                      <div className="text-2xl font-bold">{workshop.currentScholarCount}</div>
                      <p className="text-xs text-muted-foreground">Kapasite: {workshop.capacity}</p>
                      <Progress value={capacityPct} className="h-2 mt-2" />
                    </CardContent>
                  </Card>

                  

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Yoklama Oranı</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">%{workshop.attendanceRate}</div>
                      <Progress value={workshop.attendanceRate} className="h-2 mt-2" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Son Talepler</CardTitle>
                      <CardDescription>En son gönderilen 5 talep</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Malzeme</h4>
                        <div className="border rounded-lg overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Ad</TableHead>
                                <TableHead>Adet</TableHead>
                                <TableHead>Öncelik</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {recentEq.map(r => (
                                <TableRow key={r.id}>
                                  <TableCell className="font-medium">{r.name}</TableCell>
                                  <TableCell>{r.quantity}</TableCell>
                                  <TableCell>
                                    <Badge variant={r.priority === "urgent" ? "destructive" : "outline"}>{r.priority}</Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                              {recentEq.length === 0 && (
                                <TableRow><TableCell colSpan={3} className="text-muted-foreground">Kayıt yok</TableCell></TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Bakım</h4>
                        <div className="border rounded-lg">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Ekipman</TableHead>
                                <TableHead>Öncelik</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {recentMaint.map(r => (
                                <TableRow key={r.id}>
                                  <TableCell className="font-medium">{r.equipment_name || "-"}</TableCell>
                                  <TableCell>
                                    <Badge variant={r.priority === "urgent" ? "destructive" : "outline"}>{r.priority}</Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                              {recentMaint.length === 0 && (
                                <TableRow><TableCell colSpan={2} className="text-muted-foreground">Kayıt yok</TableCell></TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-end">
                      <div className="flex gap-2">
                        <Button variant="outline" asChild>
                          <Link href={`/dashboard/workshop_responsible/workshop/inventory?id=${workshop.id}`}>Envanter</Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link href={`/dashboard/workshop_responsible/workshop/requests?workshopId=${workshop.id}`}>Tüm Talepler</Link>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>


                  

                  {/* Ekipman Durumu metrik kartı şimdilik kullanılmıyor */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Ekipman Durumu</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">Bu metrik şimdilik kullanılmıyor.</div>
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
                          <p className="text-sm text-muted-foreground">{workshop.address}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">İletişim</p>
                          <p className="text-sm text-muted-foreground">{workshop.phone}</p>
                          <p className="text-sm text-muted-foreground">{workshop.email}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Bölge Bilgisi</p>
                          <p className="text-sm text-muted-foreground">
                            {workshop.region} / {workshop.city} / {workshop.district}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Tarihler</p>
                          <p className="text-sm text-muted-foreground">
                            Kuruluş: {new Date(workshop.establishmentDate).toLocaleDateString("tr-TR")}
                          </p>
                          {workshop.lastMaintenanceDate && (
                            <p className="text-sm text-muted-foreground">
                              Son Bakım: {new Date(workshop.lastMaintenanceDate).toLocaleDateString("tr-TR")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Hızlı İşlemler</h3>
                    <div className="space-y-4">
                      {/* Malzeme Talebi */}
                      <Dialog open={equipmentDialogOpen} onOpenChange={setEquipmentDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="w-full">Malzeme Talebi Oluştur</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <form onSubmit={submitEquipmentRequest}>
                            <DialogHeader>
                              <DialogTitle>Malzeme Talebi Oluştur</DialogTitle>
                              <DialogDescription>Atölyeniz için ihtiyaç duyduğunuz malzemeleri talep edin.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="equipment-name">Malzeme Adı</Label>
                                <Input id="equipment-name" name="equipment-name" placeholder="Talep edilen malzeme adı" required />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="equipment-quantity">Adet</Label>
                                  <Input id="equipment-quantity" name="equipment-quantity" type="number" min={1} placeholder="Adet" required />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="equipment-priority">Öncelik</Label>
                                  <Select
                                    defaultValue="normal"
                                    onValueChange={(v) => {
                                      const hidden = document.getElementById("equipment-priority-hidden") as HTMLInputElement | null;
                                      if (hidden) hidden.value = v;
                                    }}
                                  >
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
                                  <input type="hidden" id="equipment-priority-hidden" name="equipment-priority" defaultValue="normal" />
                                </div>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="equipment-reason">Gerekçe</Label>
                                <Textarea id="equipment-reason" name="equipment-reason" placeholder="Malzeme talep gerekçesi" required />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="equipment-notes">Ek Notlar</Label>
                                <Textarea id="equipment-notes" name="equipment-notes" placeholder="Varsa ek notlar" />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit" disabled={equipmentSubmitting}>
                                {equipmentSubmitting ? "Gönderiliyor..." : "Talebi Gönder"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>

                      {/* Bakım Talebi */}
                      <Dialog open={maintenanceDialogOpen} onOpenChange={setMaintenanceDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="w-full" variant="outline">
                            Bakım Talebi Oluştur
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <form onSubmit={submitMaintenanceRequest}>
                            <DialogHeader>
                              <DialogTitle>Bakım Talebi Oluştur</DialogTitle>
                              <DialogDescription>Atölyenizdeki ekipmanlar için bakım talebi oluşturun.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="maintenance-equipment">Ekipman</Label>
                                <Select
                                  defaultValue=""
                                  onValueChange={(v) => {
                                    const hidden = document.getElementById("maintenance-equipment-hidden") as HTMLInputElement | null;
                                    if (hidden) hidden.value = v;
                                  }}
                                >
                                  <SelectTrigger id="maintenance-equipment">
                                    <SelectValue placeholder="Ekipman seçin" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {/* Backend'den ekipman listesi geldiğinde dinamikleştirilebilir */}
                                    <SelectItem value="3D Yazıcı">3D Yazıcı</SelectItem>
                                    <SelectItem value="Robotik Kit">Robotik Kit</SelectItem>
                                    <SelectItem value="Bilgisayar">Bilgisayar</SelectItem>
                                    <SelectItem value="Arduino Set">Arduino Set</SelectItem>
                                    <SelectItem value="Elektronik Devre Kiti">Elektronik Devre Kiti</SelectItem>
                                  </SelectContent>
                                </Select>
                                <input type="hidden" id="maintenance-equipment-hidden" name="maintenance-equipment" defaultValue="" />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="maintenance-issue">Sorun Açıklaması</Label>
                                <Textarea id="maintenance-issue" name="maintenance-issue" placeholder="Sorun detayları" required />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="maintenance-priority">Öncelik</Label>
                                <Select
                                  defaultValue="normal"
                                  onValueChange={(v) => {
                                    const hidden = document.getElementById("maintenance-priority-hidden") as HTMLInputElement | null;
                                    if (hidden) hidden.value = v;
                                  }}
                                >
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
                                <input type="hidden" id="maintenance-priority-hidden" name="maintenance-priority" defaultValue="normal" />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="maintenance-notes">Ek Notlar</Label>
                                <Textarea id="maintenance-notes" name="maintenance-notes" placeholder="Varsa ek notlar" />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit" disabled={maintenanceSubmitting}>
                                {maintenanceSubmitting ? "Gönderiliyor..." : "Talebi Gönder"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>

                      <Button className="w-full" variant="outline" asChild>
                        <Link href={`/dashboard/workshop_responsible/workshop/inventory?id=${workshop.id}`}>
                          Envanter Yönetimi
                        </Link>
                      </Button>
                      <Button className="w-full" variant="outline" asChild>
                        <Link href={`/dashboard/workshop_responsible/scholars?workshopId=${workshop.id}`}>
                          Bursiyer Yönetimi
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="trainers" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Eğitmenler ({trainers.length})</h3>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/workshop_responsible/trainers?workshopId=${workshop.id}`}>
                        Tüm Eğitmenler
                      </Link>
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
                        {trainers.map((trainer) => (
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
                      <Link href={`/dashboard/workshop_responsible/workshop/inventory?id=${workshop.id}`}>
                        Envanter Yönetimi
                      </Link>
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
                        {equipment.map((item) => (
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
                      <Link href={`/dashboard/workshop_responsible/calendar?workshopId=${workshop.id}`}>
                        Takvimi Görüntüle
                      </Link>
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {events.map((event) => (
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
                                event.type === "deadline" ? "destructive" : event.type === "meeting" ? "default" : "secondary"
                              }
                            >
                              {event.type === "deadline" ? "Son Tarih" : event.type === "meeting" ? "Toplantı" : "Etkinlik"}
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
              <AvatarImage
                src={workshop.responsiblePerson.image ?? "/placeholder.svg?height=40&width=40"}
                alt={workshop.responsiblePerson.name}
              />
              <AvatarFallback>{workshop.responsiblePerson.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-bold">{workshop.responsiblePerson.name}</h3>
            <p className="text-muted-foreground mt-1">{workshop.responsiblePerson.title}</p>

            <Separator className="my-4" />

            <div className="w-full space-y-2 text-left">
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-sm">{workshop.responsiblePerson.phone}</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-sm">{workshop.responsiblePerson.email}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full" variant="outline" asChild>
              <Link href={`/dashboard/workshop_responsible/messages?workshopId=${workshop.id}`}>
                <Users className="mr-2 h-4 w-4" />
                Mesajlar
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
