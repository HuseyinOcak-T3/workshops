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

// Sample scholars data
const scholarsData = [
  {
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
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Ayşe Demir",
    grade: "9. Sınıf",
    school: "Pendik Anadolu Lisesi",
    attendanceRate: 88,
    status: "active",
    joinDate: "2023-09-01",
    parentName: "Fatma Demir",
    parentPhone: "+90 555 222 3344",
    parentEmail: "fatma.demir@example.com",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Mehmet Kaya",
    grade: "11. Sınıf",
    school: "Kartal Fen Lisesi",
    attendanceRate: 92,
    status: "active",
    joinDate: "2023-09-01",
    parentName: "Ali Kaya",
    parentPhone: "+90 555 333 4455",
    parentEmail: "ali.kaya@example.com",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Zeynep Çelik",
    grade: "10. Sınıf",
    school: "Pendik Anadolu Lisesi",
    attendanceRate: 85,
    status: "active",
    joinDate: "2023-09-01",
    parentName: "Ayşe Çelik",
    parentPhone: "+90 555 444 5566",
    parentEmail: "ayse.celik@example.com",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Mustafa Şahin",
    grade: "9. Sınıf",
    school: "Tuzla Anadolu Lisesi",
    attendanceRate: 78,
    status: "inactive",
    joinDate: "2023-09-01",
    parentName: "Hasan Şahin",
    parentPhone: "+90 555 555 6677",
    parentEmail: "hasan.sahin@example.com",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 6,
    name: "Elif Yıldız",
    grade: "11. Sınıf",
    school: "Kartal Anadolu Lisesi",
    attendanceRate: 90,
    status: "active",
    joinDate: "2023-09-01",
    parentName: "Zeynep Yıldız",
    parentPhone: "+90 555 666 7788",
    parentEmail: "zeynep.yildiz@example.com",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 7,
    name: "Ali Öztürk",
    grade: "10. Sınıf",
    school: "Pendik Fen Lisesi",
    attendanceRate: 93,
    status: "active",
    joinDate: "2023-09-01",
    parentName: "Mustafa Öztürk",
    parentPhone: "+90 555 777 8899",
    parentEmail: "mustafa.ozturk@example.com",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 8,
    name: "Selin Aydın",
    grade: "9. Sınıf",
    school: "Pendik Anadolu Lisesi",
    attendanceRate: 82,
    status: "inactive",
    joinDate: "2023-09-01",
    parentName: "Ahmet Aydın",
    parentPhone: "+90 555 888 9900",
    parentEmail: "ahmet.aydin@example.com",
    image: "/placeholder.svg?height=40&width=40",
  },
]

export default function ScholarsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedScholar, setSelectedScholar] = useState<(typeof scholarsData)[0] | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterGrade, setFilterGrade] = useState("all")

  const handleAddScholar = () => {
    toast({
      title: "Bursiyer eklendi",
      description: "Yeni bursiyer başarıyla eklendi.",
    })
  }

  const handleContactParent = () => {
    toast({
      title: "Veli ile iletişime geçildi",
      description: "Veli bilgilendirme mesajı gönderildi.",
    })
  }

  // Filter scholars based on search term and filters
  const filteredScholars = scholarsData.filter((scholar) => {
    const matchesSearch =
      scholar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholar.school.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || scholar.status === filterStatus
    const matchesGrade = filterGrade === "all" || scholar.grade === filterGrade

    return matchesSearch && matchesStatus && matchesGrade
  })

  const activeScholars = filteredScholars.filter((scholar) => scholar.status === "active")
  const inactiveScholars = filteredScholars.filter((scholar) => scholar.status === "inactive")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bursiyerler</h1>
          <p className="text-muted-foreground">Atölyenizdeki bursiyerleri yönetin</p>
        </div>

        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Bursiyer Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Yeni Bursiyer Ekle</DialogTitle>
                <DialogDescription>Atölyenize yeni bir bursiyer ekleyin.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Ad Soyad</Label>
                    <Input id="name" placeholder="Bursiyer adı soyadı" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="grade">Sınıf</Label>
                    <Select>
                      <SelectTrigger id="grade">
                        <SelectValue placeholder="Sınıf seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9. Sınıf">9. Sınıf</SelectItem>
                        <SelectItem value="10. Sınıf">10. Sınıf</SelectItem>
                        <SelectItem value="11. Sınıf">11. Sınıf</SelectItem>
                        <SelectItem value="12. Sınıf">12. Sınıf</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="school">Okul</Label>
                  <Input id="school" placeholder="Okul adı" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="parent-name">Veli Adı Soyadı</Label>
                    <Input id="parent-name" placeholder="Veli adı soyadı" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="parent-phone">Veli Telefon</Label>
                    <Input id="parent-phone" placeholder="Veli telefon numarası" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="parent-email">Veli E-posta</Label>
                  <Input id="parent-email" type="email" placeholder="Veli e-posta adresi" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notlar</Label>
                  <Textarea id="notes" placeholder="Bursiyer hakkında ek bilgiler" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddScholar}>
                  Bursiyer Ekle
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" asChild>
            <Link href="/dashboard/workshop_responsible/scholars/reports">
              <FileText className="mr-2 h-4 w-4" />
              Raporlar
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Bursiyer Listesi</CardTitle>
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
            <CardDescription>Atölyenizdeki tüm bursiyerler</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Bursiyer ara..."
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
                  <SelectItem value="inactive">Devam Etmiyor</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterGrade} onValueChange={setFilterGrade}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sınıf" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Sınıflar</SelectItem>
                  <SelectItem value="9. Sınıf">9. Sınıf</SelectItem>
                  <SelectItem value="10. Sınıf">10. Sınıf</SelectItem>
                  <SelectItem value="11. Sınıf">11. Sınıf</SelectItem>
                  <SelectItem value="12. Sınıf">12. Sınıf</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">Tümü ({filteredScholars.length})</TabsTrigger>
                <TabsTrigger value="active">Aktif ({activeScholars.length})</TabsTrigger>
                <TabsTrigger value="inactive">Devam Etmiyor ({inactiveScholars.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bursiyer</TableHead>
                        <TableHead>Sınıf</TableHead>
                        <TableHead>Okul</TableHead>
                        <TableHead>Yoklama</TableHead>
                        <TableHead>Durum</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredScholars.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            Bursiyer bulunamadı
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredScholars.map((scholar) => (
                          <TableRow
                            key={scholar.id}
                            className="cursor-pointer"
                            onClick={() => setSelectedScholar(scholar)}
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={scholar.image} alt={scholar.name} />
                                  <AvatarFallback>{scholar.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="font-medium">{scholar.name}</div>
                              </div>
                            </TableCell>
                            <TableCell>{scholar.grade}</TableCell>
                            <TableCell>{scholar.school}</TableCell>
                            <TableCell>%{scholar.attendanceRate}</TableCell>
                            <TableCell>
                              <Badge variant={scholar.status === "active" ? "outline" : "secondary"}>
                                {scholar.status === "active" ? "Aktif" : "Devam Etmiyor"}
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
                        <TableHead>Bursiyer</TableHead>
                        <TableHead>Sınıf</TableHead>
                        <TableHead>Okul</TableHead>
                        <TableHead>Yoklama</TableHead>
                        <TableHead>Durum</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeScholars.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            Aktif bursiyer bulunamadı
                          </TableCell>
                        </TableRow>
                      ) : (
                        activeScholars.map((scholar) => (
                          <TableRow
                            key={scholar.id}
                            className="cursor-pointer"
                            onClick={() => setSelectedScholar(scholar)}
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={scholar.image} alt={scholar.name} />
                                  <AvatarFallback>{scholar.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="font-medium">{scholar.name}</div>
                              </div>
                            </TableCell>
                            <TableCell>{scholar.grade}</TableCell>
                            <TableCell>{scholar.school}</TableCell>
                            <TableCell>%{scholar.attendanceRate}</TableCell>
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

              <TabsContent value="inactive" className="mt-4">
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bursiyer</TableHead>
                        <TableHead>Sınıf</TableHead>
                        <TableHead>Okul</TableHead>
                        <TableHead>Yoklama</TableHead>
                        <TableHead>Durum</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inactiveScholars.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            Devam etmeyen bursiyer bulunamadı
                          </TableCell>
                        </TableRow>
                      ) : (
                        inactiveScholars.map((scholar) => (
                          <TableRow
                            key={scholar.id}
                            className="cursor-pointer"
                            onClick={() => setSelectedScholar(scholar)}
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={scholar.image} alt={scholar.name} />
                                  <AvatarFallback>{scholar.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="font-medium">{scholar.name}</div>
                              </div>
                            </TableCell>
                            <TableCell>{scholar.grade}</TableCell>
                            <TableCell>{scholar.school}</TableCell>
                            <TableCell>%{scholar.attendanceRate}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">Devam Etmiyor</Badge>
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
            <CardTitle>Bursiyer Detayları</CardTitle>
            <CardDescription>Seçili bursiyer bilgileri</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedScholar ? (
              <div className="space-y-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={selectedScholar.image} alt={selectedScholar.name} />
                    <AvatarFallback>{selectedScholar.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold">{selectedScholar.name}</h3>
                  <p className="text-muted-foreground mt-1">
                    {selectedScholar.grade} - {selectedScholar.school}
                  </p>
                  <Badge className="mt-2" variant={selectedScholar.status === "active" ? "outline" : "secondary"}>
                    {selectedScholar.status === "active" ? "Aktif" : "Devam Etmiyor"}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Yoklama Oranı</h4>
                    <div className="flex items-center justify-between">
                      <span>%{selectedScholar.attendanceRate}</span>
                      <Badge variant={selectedScholar.attendanceRate >= 85 ? "outline" : "secondary"}>
                        {selectedScholar.attendanceRate >= 85 ? "İyi" : "Düşük"}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Katılım Tarihi</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedScholar.joinDate).toLocaleDateString("tr-TR")}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Veli Bilgileri</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-sm">{selectedScholar.parentName}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-sm">{selectedScholar.parentPhone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-sm">{selectedScholar.parentEmail}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <User className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Bursiyer Seçilmedi</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Detaylarını görmek için listeden bir bursiyer seçin.
                </p>
              </div>
            )}
          </CardContent>
          {selectedScholar && (
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full" asChild>
                <Link href={`/dashboard/workshop_responsible/scholars/${selectedScholar.id}`}>
                  <User className="mr-2 h-4 w-4" />
                  Detaylı Görüntüle
                </Link>
              </Button>
              <Button className="w-full" variant="outline" onClick={handleContactParent}>
                <Mail className="mr-2 h-4 w-4" />
                Veli ile İletişime Geç
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}
