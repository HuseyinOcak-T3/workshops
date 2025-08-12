"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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
import { ArrowLeft, Download, Edit, Filter, Plus, Search, Trash } from "lucide-react"
import Link from "next/link"

// Sample inventory data
const inventoryData = [
  { id: 1, name: "3D Yazıcı", category: "Donanım", count: 5, status: "working", lastMaintenance: "2024-12-15" },
  { id: 2, name: "Robotik Kit", category: "Eğitim Kiti", count: 30, status: "working", lastMaintenance: "2024-11-20" },
  { id: 3, name: "Bilgisayar", category: "Donanım", count: 25, status: "working", lastMaintenance: "2024-10-05" },
  { id: 4, name: "Arduino Set", category: "Eğitim Kiti", count: 40, status: "working", lastMaintenance: "2024-12-10" },
  {
    id: 5,
    name: "Elektronik Devre Kiti",
    category: "Eğitim Kiti",
    count: 35,
    status: "working",
    lastMaintenance: "2024-11-15",
  },
  { id: 6, name: "Drone Kit", category: "Eğitim Kiti", count: 10, status: "working", lastMaintenance: "2024-09-25" },
  { id: 7, name: "Lehim İstasyonu", category: "Donanım", count: 8, status: "working", lastMaintenance: "2024-10-15" },
  { id: 8, name: "Raspberry Pi", category: "Donanım", count: 15, status: "working", lastMaintenance: "2024-11-05" },
  { id: 9, name: "Sensör Kiti", category: "Eğitim Kiti", count: 20, status: "working", lastMaintenance: "2024-12-01" },
  {
    id: 10,
    name: "Projeksiyon Cihazı",
    category: "Donanım",
    count: 2,
    status: "maintenance",
    lastMaintenance: "2024-08-10",
  },
]

// Sample consumables data
const consumablesData = [
  { id: 1, name: "3D Yazıcı Filamenti (PLA)", category: "Sarf Malzeme", count: 50, unit: "adet", threshold: 10 },
  { id: 2, name: "Jumper Kablo", category: "Elektronik", count: 200, unit: "adet", threshold: 50 },
  { id: 3, name: "Breadboard", category: "Elektronik", count: 30, unit: "adet", threshold: 5 },
  { id: 4, name: "LED (Çeşitli)", category: "Elektronik", count: 500, unit: "adet", threshold: 100 },
  { id: 5, name: "Direnç Seti", category: "Elektronik", count: 20, unit: "set", threshold: 5 },
  { id: 6, name: "Kondansatör Seti", category: "Elektronik", count: 15, unit: "set", threshold: 3 },
  { id: 7, name: "Lehim Teli", category: "Sarf Malzeme", count: 10, unit: "makara", threshold: 2 },
  { id: 8, name: "Arduino Shield (Çeşitli)", category: "Elektronik", count: 25, unit: "adet", threshold: 5 },
  { id: 9, name: "Servo Motor", category: "Elektronik", count: 40, unit: "adet", threshold: 10 },
  { id: 10, name: "DC Motor", category: "Elektronik", count: 35, unit: "adet", threshold: 10 },
]

export default function InventoryPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false)
  const [addConsumableDialogOpen, setAddConsumableDialogOpen] = useState(false)

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Ekipman eklendi",
      description: "Yeni ekipman başarıyla envantere eklendi.",
    })
    setAddItemDialogOpen(false)
  }

  const handleAddConsumable = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Sarf malzeme eklendi",
      description: "Yeni sarf malzeme başarıyla envantere eklendi.",
    })
    setAddConsumableDialogOpen(false)
  }

  // Filter inventory based on search term and filters
  const filteredInventory = inventoryData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || item.category === filterCategory
    const matchesStatus = filterStatus === "all" || item.status === filterStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  // Filter consumables based on search term and category filter
  const filteredConsumables = consumablesData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || item.category === filterCategory

    return matchesSearch && matchesCategory
  })

  // Get low stock consumables
  const lowStockConsumables = consumablesData.filter((item) => item.count <= item.threshold)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/workshop_responsible/workshop">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Envanter Yönetimi</h1>
            <p className="text-muted-foreground">Atölye ekipman ve sarf malzeme envanteri</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={addItemDialogOpen} onOpenChange={setAddItemDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ekipman Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <form onSubmit={handleAddItem}>
                <DialogHeader>
                  <DialogTitle>Yeni Ekipman Ekle</DialogTitle>
                  <DialogDescription>Atölye envanterine yeni bir ekipman ekleyin.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="item-name">Ekipman Adı</Label>
                    <Input id="item-name" placeholder="Ekipman adı" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="item-category">Kategori</Label>
                      <Select defaultValue="Donanım">
                        <SelectTrigger id="item-category">
                          <SelectValue placeholder="Kategori seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Donanım">Donanım</SelectItem>
                          <SelectItem value="Eğitim Kiti">Eğitim Kiti</SelectItem>
                          <SelectItem value="Elektronik">Elektronik</SelectItem>
                          <SelectItem value="Diğer">Diğer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="item-count">Adet</Label>
                      <Input id="item-count" type="number" min="1" placeholder="Adet" required />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="item-status">Durum</Label>
                    <Select defaultValue="working">
                      <SelectTrigger id="item-status">
                        <SelectValue placeholder="Durum seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="working">Çalışıyor</SelectItem>
                        <SelectItem value="maintenance">Bakımda</SelectItem>
                        <SelectItem value="broken">Arızalı</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="item-notes">Notlar</Label>
                    <Textarea id="item-notes" placeholder="Ekipman hakkında ek bilgiler" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Ekipman Ekle</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={addConsumableDialogOpen} onOpenChange={setAddConsumableDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Sarf Malzeme Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <form onSubmit={handleAddConsumable}>
                <DialogHeader>
                  <DialogTitle>Yeni Sarf Malzeme Ekle</DialogTitle>
                  <DialogDescription>Atölye envanterine yeni bir sarf malzeme ekleyin.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="consumable-name">Malzeme Adı</Label>
                    <Input id="consumable-name" placeholder="Malzeme adı" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="consumable-category">Kategori</Label>
                      <Select defaultValue="Sarf Malzeme">
                        <SelectTrigger id="consumable-category">
                          <SelectValue placeholder="Kategori seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Sarf Malzeme">Sarf Malzeme</SelectItem>
                          <SelectItem value="Elektronik">Elektronik</SelectItem>
                          <SelectItem value="Kırtasiye">Kırtasiye</SelectItem>
                          <SelectItem value="Diğer">Diğer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="consumable-count">Miktar</Label>
                      <Input id="consumable-count" type="number" min="1" placeholder="Miktar" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="consumable-unit">Birim</Label>
                      <Input id="consumable-unit" placeholder="adet, kg, litre vb." required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="consumable-threshold">Kritik Eşik</Label>
                      <Input id="consumable-threshold" type="number" min="1" placeholder="Kritik eşik" required />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="consumable-notes">Notlar</Label>
                    <Textarea id="consumable-notes" placeholder="Malzeme hakkında ek bilgiler" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Sarf Malzeme Ekle</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-9">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Envanter Listesi</CardTitle>
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
            <CardDescription>Atölyenizdeki tüm ekipman ve sarf malzemeler</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Envanter ara..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Kategoriler</SelectItem>
                  <SelectItem value="Donanım">Donanım</SelectItem>
                  <SelectItem value="Eğitim Kiti">Eğitim Kiti</SelectItem>
                  <SelectItem value="Elektronik">Elektronik</SelectItem>
                  <SelectItem value="Sarf Malzeme">Sarf Malzeme</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Durum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="working">Çalışıyor</SelectItem>
                  <SelectItem value="maintenance">Bakımda</SelectItem>
                  <SelectItem value="broken">Arızalı</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs defaultValue="equipment">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="equipment">Ekipmanlar</TabsTrigger>
                <TabsTrigger value="consumables">Sarf Malzemeler</TabsTrigger>
              </TabsList>

              <TabsContent value="equipment" className="mt-4">
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ekipman</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Adet</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead>Son Bakım</TableHead>
                        <TableHead className="text-right">İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInventory.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4">
                            Ekipman bulunamadı
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredInventory.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.count}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  item.status === "working"
                                    ? "outline"
                                    : item.status === "maintenance"
                                      ? "default"
                                      : "destructive"
                                }
                              >
                                {item.status === "working"
                                  ? "Çalışıyor"
                                  : item.status === "maintenance"
                                    ? "Bakımda"
                                    : "Arızalı"}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(item.lastMaintenance).toLocaleDateString("tr-TR")}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="consumables" className="mt-4">
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Malzeme</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Miktar</TableHead>
                        <TableHead>Birim</TableHead>
                        <TableHead>Kritik Eşik</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead className="text-right">İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredConsumables.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4">
                            Sarf malzeme bulunamadı
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredConsumables.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.count}</TableCell>
                            <TableCell>{item.unit}</TableCell>
                            <TableCell>{item.threshold}</TableCell>
                            <TableCell>
                              <Badge variant={item.count <= item.threshold ? "destructive" : "outline"}>
                                {item.count <= item.threshold ? "Kritik Seviye" : "Yeterli"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
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

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Envanter Özeti</CardTitle>
            <CardDescription>Hızlı bakış ve kritik seviyeler</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Ekipman Durumu</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Toplam Ekipman</span>
                  <span className="font-medium">{inventoryData.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Çalışan</span>
                  <span className="font-medium">{inventoryData.filter((i) => i.status === "working").length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Bakımda</span>
                  <span className="font-medium">{inventoryData.filter((i) => i.status === "maintenance").length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Arızalı</span>
                  <span className="font-medium">{inventoryData.filter((i) => i.status === "broken").length}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Sarf Malzeme Durumu</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Toplam Sarf Malzeme</span>
                  <span className="font-medium">{consumablesData.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Kritik Seviyede</span>
                  <span className="font-medium text-red-500">{lowStockConsumables.length}</span>
                </div>
              </div>
            </div>

            {lowStockConsumables.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Kritik Seviyedeki Malzemeler</h3>
                <div className="space-y-2">
                  {lowStockConsumables.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <span className="text-sm truncate max-w-[180px]">{item.name}</span>
                      <Badge variant="destructive">
                        {item.count}/{item.threshold}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full" variant="outline" asChild>
              <Link href="/dashboard/workshop_responsible/workshop/inventory/history">Envanter Geçmişi</Link>
            </Button>
            <Button className="w-full" variant="outline" onClick={() => setAddItemDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Ekipman Ekle
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
