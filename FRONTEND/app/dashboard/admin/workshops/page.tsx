"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "./data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, Search } from "lucide-react"
import Link from "next/link"

// Workshop data type
type Workshop = {
  id: number
  name: string
  city: string
  district: string
  region: string
  scholarCount: number
  trainerCount: number
  taskCompletion: number
  status: "active" | "inactive" | "maintenance"
}

// Sample workshop data
const workshopData: Workshop[] = [
  {
    id: 1,
    name: "Pendik Atölyesi",
    city: "İstanbul",
    district: "Pendik",
    region: "Marmara",
    scholarCount: 24,
    trainerCount: 3,
    taskCompletion: 95,
    status: "active",
  },
  {
    id: 2,
    name: "Kadıköy Atölyesi",
    city: "İstanbul",
    district: "Kadıköy",
    region: "Marmara",
    scholarCount: 28,
    trainerCount: 4,
    taskCompletion: 88,
    status: "active",
  },
  {
    id: 3,
    name: "Çankaya Atölyesi",
    city: "Ankara",
    district: "Çankaya",
    region: "İç Anadolu",
    scholarCount: 22,
    trainerCount: 3,
    taskCompletion: 82,
    status: "active",
  },
  {
    id: 4,
    name: "Bornova Atölyesi",
    city: "İzmir",
    district: "Bornova",
    region: "Ege",
    scholarCount: 20,
    trainerCount: 2,
    taskCompletion: 78,
    status: "active",
  },
  {
    id: 5,
    name: "Muratpaşa Atölyesi",
    city: "Antalya",
    district: "Muratpaşa",
    region: "Akdeniz",
    scholarCount: 18,
    trainerCount: 2,
    taskCompletion: 65,
    status: "active",
  },
  {
    id: 6,
    name: "Nilüfer Atölyesi",
    city: "Bursa",
    district: "Nilüfer",
    region: "Marmara",
    scholarCount: 21,
    trainerCount: 3,
    taskCompletion: 70,
    status: "active",
  },
  {
    id: 7,
    name: "Merkez Atölyesi",
    city: "Trabzon",
    district: "Merkez",
    region: "Karadeniz",
    scholarCount: 16,
    trainerCount: 2,
    taskCompletion: 72,
    status: "active",
  },
  {
    id: 8,
    name: "Merkez Atölyesi",
    city: "Diyarbakır",
    district: "Merkez",
    region: "Güneydoğu Anadolu",
    scholarCount: 15,
    trainerCount: 2,
    taskCompletion: 68,
    status: "active",
  },
  {
    id: 9,
    name: "Körfez Atölyesi",
    city: "Kocaeli",
    district: "Körfez",
    region: "Marmara",
    scholarCount: 19,
    trainerCount: 2,
    taskCompletion: 75,
    status: "maintenance",
  },
  {
    id: 10,
    name: "Selçuklu Atölyesi",
    city: "Konya",
    district: "Selçuklu",
    region: "İç Anadolu",
    scholarCount: 17,
    trainerCount: 2,
    taskCompletion: 80,
    status: "active",
  },
]

export default function WorkshopsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [region, setRegion] = useState("all")
  const [status, setStatus] = useState("all")

  const filteredWorkshops = workshopData.filter((workshop) => {
    const matchesSearch =
      workshop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workshop.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workshop.district.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegion = region === "all" || workshop.region === region
    const matchesStatus = status === "all" || workshop.status === status
    return matchesSearch && matchesRegion && matchesStatus
  })

  // Table columns definition
  const columns: ColumnDef<Workshop>[] = [
    {
      accessorKey: "name",
      header: "Atölye Adı",
      cell: ({ row }) => {
        return (
          <div>
            <div className="font-medium">{row.getValue("name")}</div>
            <div className="text-xs text-muted-foreground">
              {row.original.district}, {row.original.city}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "region",
      header: "Bölge",
    },
    {
      accessorKey: "scholarCount",
      header: ({ column }) => {
        return (
          <div className="text-right">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="p-0"
            >
              Bursiyer
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        return <div className="text-right">{row.getValue("scholarCount")}</div>
      },
    },
    {
      accessorKey: "trainerCount",
      header: "Eğitmen",
      cell: ({ row }) => {
        return <div className="text-right">{row.getValue("trainerCount")}</div>
      },
    },
    {
      accessorKey: "taskCompletion",
      header: ({ column }) => {
        return (
          <div className="text-right">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="p-0"
            >
              Görev Oranı
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const completion = row.getValue("taskCompletion") as number
        const colorClass = completion >= 80 ? "text-green-600" : completion >= 60 ? "text-yellow-600" : "text-red-600"

        return <div className={`text-right font-medium ${colorClass}`}>%{completion}</div>
      },
    },
    {
      accessorKey: "status",
      header: "Durum",
      cell: ({ row }) => {
        const status = row.getValue("status") as string

        return (
          <div className="flex justify-center">
            {status === "active" && (
              <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50 border-green-200">
                Aktif
              </Badge>
            )}
            {status === "inactive" && (
              <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50 border-red-200">
                Pasif
              </Badge>
            )}
            {status === "maintenance" && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-600 hover:bg-yellow-50 border-yellow-200">
                Bakımda
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex justify-end">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/dashboard/superadmin/workshops/${row.original.id}`}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">Detayları Görüntüle</span>
              </Link>
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Atölye Yönetimi</h1>
        <p className="text-muted-foreground">Türkiye genelindeki tüm atölyeleri görüntüleyin ve yönetin</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Atölye Listesi</CardTitle>
          <CardDescription>
            Toplam {workshopData.length} atölye, {filteredWorkshops.length} sonuç
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Atölye, şehir veya ilçe ara..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Bölge seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Bölgeler</SelectItem>
                    <SelectItem value="Marmara">Marmara</SelectItem>
                    <SelectItem value="Ege">Ege</SelectItem>
                    <SelectItem value="Akdeniz">Akdeniz</SelectItem>
                    <SelectItem value="İç Anadolu">İç Anadolu</SelectItem>
                    <SelectItem value="Karadeniz">Karadeniz</SelectItem>
                    <SelectItem value="Doğu Anadolu">Doğu Anadolu</SelectItem>
                    <SelectItem value="Güneydoğu Anadolu">Güneydoğu Anadolu</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Durum seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Durumlar</SelectItem>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Pasif</SelectItem>
                    <SelectItem value="maintenance">Bakımda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DataTable columns={columns} data={filteredWorkshops} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
