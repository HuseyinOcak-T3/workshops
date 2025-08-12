"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeftIcon, UserIcon, PhoneIcon, MailIcon } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function EditWorkshopPage() {
  const params = useParams()
  const workshopId = params.id

  // Örnek atölye verisi
  const [workshop, setWorkshop] = useState({
    id: workshopId,
    name: "İstanbul Kadıköy Atölyesi",
    region: "İstanbul",
    address: "Kadıköy Mah. Deneyap Sok. No: 123",
    city: "İstanbul",
    district: "Kadıköy",
    phone: "0212 123 45 67",
    email: "kadikoy@deneyap.org",
    manager: "Ahmet Yılmaz",
    managerPhone: "0532 123 45 67",
    managerEmail: "ahmet.yilmaz@deneyap.org",
    capacity: 30,
    status: "active",
    description: "İstanbul Kadıköy bölgesinde hizmet veren Deneyap Atölyesi.",
    establishmentDate: "2021-05-15",
  })

  // Örnek eğitmenler
  const trainers = [
    {
      id: 1,
      name: "Mehmet Kaya",
      title: "Robotik Eğitmeni",
      phone: "0533 111 22 33",
      email: "mehmet.kaya@deneyap.org",
    },
    { id: 2, name: "Ayşe Demir", title: "Yazılım Eğitmeni", phone: "0533 222 33 44", email: "ayse.demir@deneyap.org" },
  ]

  // Örnek bursiyerler
  const scholars = [
    { id: 1, name: "Ali Yıldız", grade: "10. Sınıf", phone: "0534 111 22 33", email: "ali.yildiz@gmail.com" },
    { id: 2, name: "Zeynep Kara", grade: "9. Sınıf", phone: "0534 222 33 44", email: "zeynep.kara@gmail.com" },
    { id: 3, name: "Mustafa Şahin", grade: "11. Sınıf", phone: "0534 333 44 55", email: "mustafa.sahin@gmail.com" },
  ]

  // Örnek envanter
  const inventory = [
    { id: 1, name: "Arduino Uno", category: "Elektronik", quantity: 15, status: "Yeterli" },
    { id: 2, name: "Raspberry Pi", category: "Elektronik", quantity: 8, status: "Az" },
    { id: 3, name: "3D Yazıcı", category: "Ekipman", quantity: 2, status: "Yeterli" },
    { id: 4, name: "Lehim İstasyonu", category: "Ekipman", quantity: 5, status: "Yeterli" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form gönderme işlemi burada yapılacak
    console.log("Form submitted")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setWorkshop((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setWorkshop((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/admin/workshops">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Atölye Düzenle: {workshop.name}</h2>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Genel Bilgiler</TabsTrigger>
          <TabsTrigger value="trainers">Eğitmenler</TabsTrigger>
          <TabsTrigger value="scholars">Bursiyerler</TabsTrigger>
          <TabsTrigger value="inventory">Envanter</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Atölye Bilgileri</CardTitle>
                  <CardDescription>Atölyenin temel bilgilerini düzenleyin</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Atölye Adı</Label>
                    <Input
                      id="name"
                      name="name"
                      value={workshop.name}
                      onChange={handleInputChange}
                      placeholder="Atölye adını girin"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="region">Bölge</Label>
                      <Select value={workshop.region} onValueChange={(value) => handleSelectChange("region", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Bölge seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="İstanbul">İstanbul</SelectItem>
                          <SelectItem value="Ankara">Ankara</SelectItem>
                          <SelectItem value="İzmir">İzmir</SelectItem>
                          <SelectItem value="Bursa">Bursa</SelectItem>
                          <SelectItem value="Antalya">Antalya</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Durum</Label>
                      <Select value={workshop.status} onValueChange={(value) => handleSelectChange("status", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Durum seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Aktif</SelectItem>
                          <SelectItem value="inactive">Pasif</SelectItem>
                          <SelectItem value="maintenance">Bakımda</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Açıklama</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={workshop.description}
                      onChange={handleInputChange}
                      placeholder="Atölye açıklamasını yazın"
                      className="min-h-32"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Kapasite</Label>
                      <Input
                        id="capacity"
                        name="capacity"
                        value={workshop.capacity.toString()}
                        onChange={handleInputChange}
                        type="number"
                        min="1"
                        placeholder="Kapasite girin"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="establishmentDate">Kuruluş Tarihi</Label>
                      <Input
                        id="establishmentDate"
                        name="establishmentDate"
                        value={workshop.establishmentDate}
                        onChange={handleInputChange}
                        type="date"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>İletişim Bilgileri</CardTitle>
                  <CardDescription>Atölyenin iletişim bilgilerini düzenleyin</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Adres</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={workshop.address}
                      onChange={handleInputChange}
                      placeholder="Atölye adresini girin"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">İl</Label>
                      <Input
                        id="city"
                        name="city"
                        value={workshop.city}
                        onChange={handleInputChange}
                        placeholder="İl girin"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">İlçe</Label>
                      <Input
                        id="district"
                        name="district"
                        value={workshop.district}
                        onChange={handleInputChange}
                        placeholder="İlçe girin"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={workshop.phone}
                      onChange={handleInputChange}
                      placeholder="Telefon numarası girin"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta</Label>
                    <Input
                      id="email"
                      name="email"
                      value={workshop.email}
                      onChange={handleInputChange}
                      type="email"
                      placeholder="E-posta adresi girin"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Link href="/dashboard/admin/workshops">
                    <Button variant="outline">İptal</Button>
                  </Link>
                  <Button type="submit">Değişiklikleri Kaydet</Button>
                </CardFooter>
              </Card>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="trainers">
          <Card>
            <CardHeader>
              <CardTitle>Eğitmenler</CardTitle>
              <CardDescription>Atölyede görev yapan eğitmenleri yönetin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium">Eğitmen Listesi</h3>
                  <Button>Eğitmen Ekle</Button>
                </div>
                <div className="space-y-2">
                  {trainers.map((trainer) => (
                    <Card key={trainer.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <UserIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{trainer.name}</div>
                            <div className="text-sm text-muted-foreground">{trainer.title}</div>
                            <div className="flex items-center gap-2 mt-1 text-sm">
                              <PhoneIcon className="h-3 w-3" />
                              <span>{trainer.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <MailIcon className="h-3 w-3" />
                              <span>{trainer.email}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Düzenle
                          </Button>
                          <Button variant="destructive" size="sm">
                            Kaldır
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scholars">
          <Card>
            <CardHeader>
              <CardTitle>Bursiyerler</CardTitle>
              <CardDescription>Atölyedeki bursiyerleri yönetin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium">Bursiyer Listesi</h3>
                  <Button>Bursiyer Ekle</Button>
                </div>
                <div className="space-y-2">
                  {scholars.map((scholar) => (
                    <Card key={scholar.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <UserIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{scholar.name}</div>
                            <div className="text-sm text-muted-foreground">{scholar.grade}</div>
                            <div className="flex items-center gap-2 mt-1 text-sm">
                              <PhoneIcon className="h-3 w-3" />
                              <span>{scholar.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <MailIcon className="h-3 w-3" />
                              <span>{scholar.email}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Düzenle
                          </Button>
                          <Button variant="destructive" size="sm">
                            Kaldır
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Envanter</CardTitle>
              <CardDescription>Atölye envanterini yönetin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium">Envanter Listesi</h3>
                  <Button>Malzeme Ekle</Button>
                </div>
                <div className="relative overflow-x-auto rounded-md border">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-muted">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Malzeme Adı
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Kategori
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Miktar
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Durum
                        </th>
                        <th scope="col" className="px-6 py-3">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.map((item) => (
                        <tr key={item.id} className="bg-card border-b">
                          <td className="px-6 py-4 font-medium">{item.name}</td>
                          <td className="px-6 py-4">{item.category}</td>
                          <td className="px-6 py-4">{item.quantity}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                item.status === "Yeterli"
                                  ? "bg-green-100 text-green-800"
                                  : item.status === "Az"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Düzenle
                              </Button>
                              <Button variant="destructive" size="sm">
                                Sil
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
