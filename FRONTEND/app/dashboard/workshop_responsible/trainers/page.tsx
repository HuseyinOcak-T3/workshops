"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Download, FileText, Filter, Mail, Phone, Search, User, UserPlus } from "lucide-react"
import Link from "next/link"

// Sample trainers data
const trainersData = [
  {
    id: 1,
    name: "Prof. Dr. Ahmet Arslan",
    title: "Profesör",
    subject: "Robotik",
    university: "İstanbul Teknik Üniversitesi",
    department: "Bilgisayar Mühendisliği",
    phone: "+90 555 111 2233",
    email: "ahmet.arslan@example.com",
    status: "active",
    joinDate: "2023-09-01",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Doç. Dr. Ayşe Yılmaz",
    title: "Doçent",
    subject: "Yazılım",
    university: "Boğaziçi Üniversitesi",
    department: "Bilgisayar Mühendisliği",
    phone: "+90 555 222 3344",
    email: "ayse.yilmaz@example.com",
    status: "active",
    joinDate: "2023-09-01",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Dr. Mehmet Kaya",
    title: "Doktor Öğretim Üyesi",
    subject: "Elektronik",
    university: "Yıldız Teknik Üniversitesi",
    department: "Elektronik ve Haberleşme Mühendisliği",
    phone: "+90 555 333 4455",
    email: "mehmet.kaya@example.com",
    status: "active",
    joinDate: "2023-09-01",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Dr. Zeynep Demir",
    title: "Doktor Öğretim Üyesi",
    subject: "Yapay Zeka",
    university: "İstanbul Üniversitesi",
    department: "Bilgisayar Mühendisliği",
    phone: "+90 555 444 5566",
    email: "zeynep.demir@example.com",
    status: "leave",
    joinDate: "2023-09-01",
    image: "/placeholder.svg?height=40&width=40",
  },
]

export default function TrainersPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTrainer, setSelectedTrainer] = useState<(typeof trainersData)[0] | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterSubject, setFilterSubject] = useState("all")

  const handleAddTrainer = () => {
    toast({
      title: "Eğitmen eklendi",
      description: "Yeni eğitmen başarıyla eklendi.",
    })
  }

  const handleContactTrainer = () => {
    toast({
      title: "Eğitmen ile iletişime geçildi",
      description: "Eğitmene mesaj gönderildi.",
    })
  }

  // Filter trainers based on search term and filters
  const filteredTrainers = trainersData.filter((trainer) => {
    const matchesSearch =
      trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.university.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || trainer.status === filterStatus
    const matchesSubject = filterSubject === "all" || trainer.subject === filterSubject

    return matchesSearch && matchesStatus && matchesSubject
  })

  const activeTrainers = filteredTrainers.filter((trainer) => trainer.status === "active")
  const leaveTrainers = filteredTrainers.filter((trainer) => trainer.status === "leave")

  // Get unique subjects for filter
  const subjects = [...new Set(trainersData.map((trainer) => trainer.subject))]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Eğitmenler</h1>
          <p className="text-muted-foreground">Atölyenizdeki eğitmenleri yönetin</p>
        </div>

        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Eğitmen Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Yeni Eğitmen Ekle</DialogTitle>
                <DialogDescription>Atölyenize yeni bir eğitmen ekleyin.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Ad Soyad</Label>
                    <Input id="name" placeholder="Eğitmen adı soyadı" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="title">Ünvan</Label>
                    <Input id="title" placeholder="Akademik ünvan" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="subject">Uzmanlık Alanı</Label>
                    <Input id="subject" placeholder="Uzmanlık alanı" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="university">Üniversite</Label>
                    <Input id="university" placeholder="Üniversite adı" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Bölüm</Label>
                  <Input id="department" placeholder="Bölüm adı" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input id="phone" placeholder="Telefon numarası" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">E-posta</Label>
                    <Input id="email" type="email" placeholder="E-posta adresi" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notlar</Label>
                  <Textarea id="notes" placeholder="Eğitmen hakkında ek bilgiler" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddTrainer}>
                  Eğitmen Ekle
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" asChild>
            <Link href="/dashboard/workshop_responsible/trainers/schedule">
              <FileText className="mr-2 h-4 w-4" />
              Ders Programı
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Eğitmen Listesi</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-3 w-3" />
                  Filtrele
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-3 w-3" />
                  Dışa Aktar
                </Button>
              </div>
            </div>
            <CardDescription>Atölyenizdeki tüm eğitmenler</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Eğitmen ara..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Durum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="leave">İzinli</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Alan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Alanlar</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">Tümü ({filteredTrainers.length})</TabsTrigger>
                <TabsTrigger value="active">Aktif ({activeTrainers.length})</TabsTrigger>
                <TabsTrigger value="leave">İzinli ({leaveTrainers.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Eğitmen</TableHead>
                        <TableHead>Alan</TableHead>
                        <TableHead>Üniversite</TableHead>
                        <TableHead>Durum</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTrainers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4">
                            Eğitmen bulunamadı
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTrainers.map((trainer) => (
                          <TableRow
                            key={trainer.id}
                            className="cursor-pointer"
                            onClick={() => setSelectedTrainer(trainer)}
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={trainer.image} alt={trainer.name} />
                                  <AvatarFallback>{trainer.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{trainer.name}</div>
                                  <div className="text-xs text-muted-foreground">{trainer.title}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{trainer.subject}</TableCell>
                            <TableCell>{trainer.university}</TableCell>
                            <TableCell>
                              <Badge variant={trainer.status === "active" ? "outline" : "secondary"}>
                                {trainer.status === "active" ? "Aktif" : "İzinli"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="active" className="mt-4">
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Eğitmen</TableHead>
                        <TableHead>Alan</TableHead>
                        <TableHead>Üniversite</TableHead>
                        <TableHead>Durum</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeTrainers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4">
                            Aktif eğitmen bulunamadı
                          </TableCell>
                        </TableRow>
                      ) : (
                        activeTrainers.map((trainer) => (
                          <TableRow
                            key={trainer.id}
                            className="cursor-pointer"
                            onClick={() => setSelectedTrainer(trainer)}
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={trainer.image} alt={trainer.name} />
                                  <AvatarFallback>{trainer.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{trainer.name}</div>
                                  <div className="text-xs text-muted-foreground">{trainer.title}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{trainer.subject}</TableCell>
                            <TableCell>{trainer.university}</TableCell>
                            <TableCell>
                              <Badge variant="outline">Aktif</Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="leave" className="mt-4">
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Eğitmen</TableHead>
                        <TableHead>Alan</TableHead>
                        <TableHead>Üniversite</TableHead>
                        <TableHead>Durum</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaveTrainers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4">
                            İzinli eğitmen bulunamadı
                          </TableCell>
                        </TableRow>
                      ) : (
                        leaveTrainers.map((trainer) => (
                          <TableRow
                            key={trainer.id}
                            className="cursor-pointer"
                            onClick={() => setSelectedTrainer(trainer)}
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={trainer.image} alt={trainer.name} />
                                  <AvatarFallback>{trainer.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{trainer.name}</div>
                                  <div className="text-xs text-muted-foreground">{trainer.title}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{trainer.subject}</TableCell>
                            <TableCell>{trainer.university}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">İzinli</Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Eğitmen Detayları</CardTitle>
            <CardDescription>Seçili eğitmen bilgileri</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedTrainer ? (
              <div className="space-y-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={selectedTrainer.image} alt={selectedTrainer.name} />
                    <AvatarFallback>{selectedTrainer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold">{selectedTrainer.name}</h3>
                  <p className="text-muted-foreground mt-1">{selectedTrainer.title}</p>
                  <Badge className="mt-2" variant={selectedTrainer.status === "active" ? "outline" : "secondary"}>
                    {selectedTrainer.status === "active" ? "Aktif" : "İzinli"}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Uzmanlık Alanı</h4>
                    <p className="text-sm text-muted-foreground">{selectedTrainer.subject}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Üniversite</h4>
                    <p className="text-sm text-muted-foreground">{selectedTrainer.university}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Bölüm</h4>
                    <p className="text-sm text-muted-foreground">{selectedTrainer.department}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">İletişim Bilgileri</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-sm">{selectedTrainer.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-sm">{selectedTrainer.email}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Katılım Tarihi</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedTrainer.joinDate).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <User className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Eğitmen Seçilmedi</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Detaylarını görmek için listeden bir eğitmen seçin.
                </p>
              </div>
            )}
          </CardContent>
          {selectedTrainer && (
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full" asChild>
                <Link href={`/dashboard/workshop_responsible/trainers/${selectedTrainer.id}`}>
                  <User className="mr-2 h-4 w-4" />
                  Detaylı Görüntüle
                </Link>
              </Button>
              <Button className="w-full" variant="outline" onClick={handleContactTrainer}>
                <Mail className="mr-2 h-4 w-4" />
                İletişime Geç
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}
