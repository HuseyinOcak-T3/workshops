"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { CalendarDays, CalendarRange, Clock, Download, Filter, Plus, Share2, Users } from "lucide-react"

// Sample events data
const eventsData = [
  {
    id: 1,
    title: "Mart Ayı Yoklama Son Tarihi",
    date: "2025-04-05",
    type: "deadline",
    description: "Mart ayı için bursiyer ve eğitmen yoklamalarını tamamlama son tarihi.",
    audience: ["all-workshops"],
    commission: "Eğitmen Komisyonu",
  },
  {
    id: 2,
    title: "Proje Şenliği Takım Listeleri Son Tarihi",
    date: "2025-03-20",
    type: "deadline",
    description: "Bahar dönemi proje şenliği için takım listelerini tamamlama son tarihi.",
    audience: ["all-workshops"],
    commission: "Eğitim Programları Komisyonu",
  },
  {
    id: 3,
    title: "Komisyon Toplantısı",
    date: "2025-03-22",
    type: "meeting",
    description: "Aylık komisyon değerlendirme toplantısı.",
    audience: ["commission-members"],
    commission: "Eğitmen Komisyonu",
    location: "Merkez Ofis - Toplantı Salonu 2",
  },
  {
    id: 4,
    title: "Atölye Sorumluları Toplantısı",
    date: "2025-03-28",
    type: "meeting",
    description: "Tüm atölye sorumluları ile genel değerlendirme toplantısı.",
    audience: ["workshop-managers"],
    commission: "Eğitim Programları Komisyonu",
    location: "Çevrimiçi - Zoom",
  },
  {
    id: 5,
    title: "Eğitmen Eğitimi",
    date: "2025-03-15",
    type: "event",
    description: "Yeni eğitmenler için oryantasyon eğitimi.",
    audience: ["trainers"],
    commission: "Eğitmen Komisyonu",
    location: "Merkez Ofis - Eğitim Salonu",
  },
  {
    id: 6,
    title: "Ulusal Yarışma Takım Kayıtları Son Tarihi",
    date: "2025-04-01",
    type: "deadline",
    description: "TEKNOFEST 2025 katılımcı takım başvuruları son tarihi.",
    audience: ["all-workshops"],
    commission: "Takımlar Komisyonu",
  },
]

export default function AdminCalendarPage() {
  const { toast } = useToast()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedEvent, setSelectedEvent] = useState<(typeof eventsData)[0] | null>(null)
  const [commission, setCommission] = useState("all")
  const [eventType, setEventType] = useState("all")
  const [viewMode, setViewMode] = useState<"month" | "list" | "agenda">("month")
  const [events, setEvents] = useState(eventsData)

  // Filter events based on commission and event type
  const filteredEvents = events.filter((event) => {
    const matchesCommission = commission === "all" || event.commission === commission
    const matchesType = eventType === "all" || event.type === eventType
    return matchesCommission && matchesType
  })

  // Get events for the selected date
  const selectedDateEvents = filteredEvents.filter((event) => {
    const eventDate = new Date(event.date)
    return (
      date &&
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    )
  })

  const handleAddEvent = () => {
    toast({
      title: "Etkinlik eklendi",
      description: "Yeni etkinlik başarıyla takvime eklendi.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Takvim</h1>
          <p className="text-muted-foreground">Komisyon etkinlikleri ve son tarihler</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Takvimi Paylaş
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Etkinlik Ekle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni Etkinlik Ekle</DialogTitle>
                <DialogDescription>Takvime yeni bir etkinlik, son tarih veya toplantı ekleyin.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Başlık</Label>
                  <Input id="title" placeholder="Etkinlik başlığını girin" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Tarih</Label>
                    <Input id="date" type="date" defaultValue={date ? format(date, "yyyy-MM-dd") : undefined} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Tür</Label>
                    <Select defaultValue="event">
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Tür seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="event">Etkinlik</SelectItem>
                        <SelectItem value="deadline">Son Tarih</SelectItem>
                        <SelectItem value="meeting">Toplantı</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Açıklama</Label>
                  <Textarea id="description" placeholder="Etkinlik açıklamasını girin" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="audience">Hedef Kitle</Label>
                  <Select defaultValue="all-workshops">
                    <SelectTrigger id="audience">
                      <SelectValue placeholder="Hedef kitle seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-workshops">Tüm Atölyeler</SelectItem>
                      <SelectItem value="workshop-managers">Atölye Sorumluları</SelectItem>
                      <SelectItem value="trainers">Eğitmenler</SelectItem>
                      <SelectItem value="commission-members">Komisyon Üyeleri</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="commission">Komisyon</Label>
                  <Select defaultValue="education">
                    <SelectTrigger id="commission">
                      <SelectValue placeholder="Komisyon seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="education">Eğitim Programları Komisyonu</SelectItem>
                      <SelectItem value="trainers">Eğitmen Komisyonu</SelectItem>
                      <SelectItem value="teams">Takımlar Komisyonu</SelectItem>
                      <SelectItem value="media">Medya ve İletişim Komisyonu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddEvent}>
                  Etkinlik Ekle
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Takvim Görünümü</CardTitle>
              <Tabs defaultValue="month" className="w-[300px]">
                <TabsList>
                  <TabsTrigger value="month" onClick={() => setViewMode("month")}>
                    Aylık
                  </TabsTrigger>
                  <TabsTrigger value="list" onClick={() => setViewMode("list")}>
                    Liste
                  </TabsTrigger>
                  <TabsTrigger value="agenda" onClick={() => setViewMode("agenda")}>
                    Gündem
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <CardDescription>
              {viewMode === "month"
                ? "Aylık takvim görünümü"
                : viewMode === "list"
                  ? "Etkinlik listesi görünümü"
                  : "Gündem görünümü"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {viewMode === "month" && (
              <div className="p-3">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  locale={tr}
                  className="rounded-md border"
                  components={{
                    Day: (props) => {
                      // Check if there are events on this day
                      const dayEvents = filteredEvents.filter((event) => {
                        const eventDate = new Date(event.date)
                        return (
                          props.day &&
                          eventDate.getDate() === props.day.date.getDate() &&
                          eventDate.getMonth() === props.day.date.getMonth() &&
                          eventDate.getFullYear() === props.day.date.getFullYear()
                        )
                      })

                      const hasDeadline = dayEvents.some((event) => event.type === "deadline")
                      const hasMeeting = dayEvents.some((event) => event.type === "meeting")
                      const hasEvent = dayEvents.some((event) => event.type === "event")

                      return (
                        <div
                          className={`relative flex items-center justify-center ${props.modifiers.selected ? "bg-primary text-primary-foreground" : ""}`}
                        >
                          {props.day.date.getDate()}
                          <div className="absolute bottom-1 flex gap-1">
                            {hasDeadline && <div className="h-1 w-1 rounded-full bg-red-500"></div>}
                            {hasMeeting && <div className="h-1 w-1 rounded-full bg-yellow-500"></div>}
                            {hasEvent && <div className="h-1 w-1 rounded-full bg-green-500"></div>}
                          </div>
                        </div>
                      )
                    },
                  }}
                />
              </div>
            )}

            {viewMode === "list" && (
              <div className="space-y-4">
                {filteredEvents.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground">Filtrelere uygun etkinlik bulunamadı</p>
                  </div>
                ) : (
                  filteredEvents
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div
                          className={`p-2 mr-3 rounded-md ${
                            event.type === "deadline"
                              ? "bg-red-100"
                              : event.type === "meeting"
                                ? "bg-yellow-100"
                                : "bg-green-100"
                          }`}
                        >
                          {event.type === "deadline" ? (
                            <Clock className={`h-5 w-5 text-red-600`} />
                          ) : event.type === "meeting" ? (
                            <Users className={`h-5 w-5 text-yellow-600`} />
                          ) : (
                            <CalendarDays className={`h-5 w-5 text-green-600`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {new Date(event.date).toLocaleDateString("tr-TR")}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{event.commission}</Badge>
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
                        </div>
                      </div>
                    ))
                )}
              </div>
            )}

            {viewMode === "agenda" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Bugün</h3>
                  {filteredEvents.filter((event) => {
                    const eventDate = new Date(event.date)
                    const today = new Date()
                    return (
                      eventDate.getDate() === today.getDate() &&
                      eventDate.getMonth() === today.getMonth() &&
                      eventDate.getFullYear() === today.getFullYear()
                    )
                  }).length === 0 ? (
                    <p className="text-muted-foreground text-sm">Bugün için planlanmış etkinlik yok</p>
                  ) : (
                    filteredEvents
                      .filter((event) => {
                        const eventDate = new Date(event.date)
                        const today = new Date()
                        return (
                          eventDate.getDate() === today.getDate() &&
                          eventDate.getMonth() === today.getMonth() &&
                          eventDate.getFullYear() === today.getFullYear()
                        )
                      })
                      .map((event) => (
                        <div
                          key={event.id}
                          className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedEvent(event)}
                        >
                          <div
                            className={`p-2 mr-3 rounded-md ${
                              event.type === "deadline"
                                ? "bg-red-100"
                                : event.type === "meeting"
                                  ? "bg-yellow-100"
                                  : "bg-green-100"
                            }`}
                          >
                            {event.type === "deadline" ? (
                              <Clock className={`h-5 w-5 text-red-600`} />
                            ) : event.type === "meeting" ? (
                              <Users className={`h-5 w-5 text-yellow-600`} />
                            ) : (
                              <CalendarDays className={`h-5 w-5 text-green-600`} />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm text-muted-foreground mt-1">{event.commission}</div>
                          </div>
                        </div>
                      ))
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Yaklaşan Etkinlikler</h3>
                  {filteredEvents.filter((event) => {
                    const eventDate = new Date(event.date)
                    const today = new Date()
                    const futureDate = new Date()
                    futureDate.setDate(today.getDate() + 14)
                    return eventDate > today && eventDate <= futureDate
                  }).length === 0 ? (
                    <p className="text-muted-foreground text-sm">Önümüzdeki 14 gün içinde planlı etkinlik yok</p>
                  ) : (
                    filteredEvents
                      .filter((event) => {
                        const eventDate = new Date(event.date)
                        const today = new Date()
                        const futureDate = new Date()
                        futureDate.setDate(today.getDate() + 14)
                        return eventDate > today && eventDate <= futureDate
                      })
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map((event) => (
                        <div
                          key={event.id}
                          className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedEvent(event)}
                        >
                          <div
                            className={`p-2 mr-3 rounded-md ${
                              event.type === "deadline"
                                ? "bg-red-100"
                                : event.type === "meeting"
                                  ? "bg-yellow-100"
                                  : "bg-green-100"
                            }`}
                          >
                            {event.type === "deadline" ? (
                              <Clock className={`h-5 w-5 text-red-600`} />
                            ) : event.type === "meeting" ? (
                              <Users className={`h-5 w-5 text-yellow-600`} />
                            ) : (
                              <CalendarDays className={`h-5 w-5 text-green-600`} />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {new Date(event.date).toLocaleDateString("tr-TR")} - {event.commission}
                            </div>
                          </div>
                          <Badge>{format(new Date(event.date), "d MMM", { locale: tr })}</Badge>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span className="text-xs text-muted-foreground">Son Tarih</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <span className="text-xs text-muted-foreground">Toplantı</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-muted-foreground">Etkinlik</span>
              </div>
            </div>

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
          </CardFooter>
        </Card>

        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Etkinlik Detayları</CardTitle>
            <CardDescription>{date ? format(date, "d MMMM yyyy", { locale: tr }) : "Seçili tarih yok"}</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedEvent ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg">{selectedEvent.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={
                        selectedEvent.type === "deadline"
                          ? "destructive"
                          : selectedEvent.type === "meeting"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {selectedEvent.type === "deadline"
                        ? "Son Tarih"
                        : selectedEvent.type === "meeting"
                          ? "Toplantı"
                          : "Etkinlik"}
                    </Badge>
                    <Badge variant="outline">{selectedEvent.commission}</Badge>
                  </div>
                </div>

                <div className="flex flex-col gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <CalendarRange className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">{new Date(selectedEvent.date).toLocaleDateString("tr-TR")}</div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">Hedef Kitle</p>
                      <p className="text-muted-foreground">
                        {selectedEvent.audience.map((audience, index) => (
                          <span key={index}>
                            {audience === "all-workshops" ? "Tüm Atölyeler" : ""}
                            {audience === "workshop-managers" ? "Atölye Sorumluları" : ""}
                            {audience === "trainers" ? "Eğitmenler" : ""}
                            {audience === "commission-members" ? "Komisyon Üyeleri" : ""}
                            {index < selectedEvent.audience.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-1">Açıklama</h4>
                  <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                </div>

                {selectedEvent.location && (
                  <div>
                    <h4 className="font-medium mb-1">Konum</h4>
                    <p className="text-sm text-muted-foreground">{selectedEvent.location}</p>
                  </div>
                )}
              </div>
            ) : selectedDateEvents.length > 0 ? (
              <div className="space-y-4">
                <h3 className="font-medium">
                  {format(date!, "d MMMM yyyy", { locale: tr })} tarihinde {selectedDateEvents.length} etkinlik
                </h3>

                {selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div
                      className={`p-2 mr-3 rounded-md ${
                        event.type === "deadline"
                          ? "bg-red-100"
                          : event.type === "meeting"
                            ? "bg-yellow-100"
                            : "bg-green-100"
                      }`}
                    >
                      {event.type === "deadline" ? (
                        <Clock className={`h-5 w-5 text-red-600`} />
                      ) : event.type === "meeting" ? (
                        <Users className={`h-5 w-5 text-yellow-600`} />
                      ) : (
                        <CalendarDays className={`h-5 w-5 text-green-600`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">{event.commission}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Etkinlik Seçilmedi</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Etkinlik detaylarını görmek için takvimden bir tarih ve etkinlik seçin.
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Etkinlik Ekle
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Yeni Etkinlik Ekle</DialogTitle>
                      <DialogDescription>Takvime yeni bir etkinlik, son tarih veya toplantı ekleyin.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Başlık</Label>
                        <Input id="title" placeholder="Etkinlik başlığını girin" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="date">Tarih</Label>
                          <Input id="date" type="date" defaultValue={date ? format(date, "yyyy-MM-dd") : undefined} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="type">Tür</Label>
                          <Select defaultValue="event">
                            <SelectTrigger id="type">
                              <SelectValue placeholder="Tür seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="event">Etkinlik</SelectItem>
                              <SelectItem value="deadline">Son Tarih</SelectItem>
                              <SelectItem value="meeting">Toplantı</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">Açıklama</Label>
                        <Textarea id="description" placeholder="Etkinlik açıklamasını girin" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handleAddEvent}>
                        Etkinlik Ekle
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-12">
          <CardHeader>
            <CardTitle>Filtreleme Seçenekleri</CardTitle>
            <CardDescription>Takvim görünümünü özelleştirin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Komisyon</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="all-commissions"
                      checked={commission === "all"}
                      onCheckedChange={() => setCommission("all")}
                    />
                    <Label htmlFor="all-commissions">Tüm Komisyonlar</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="education-commission"
                      checked={commission === "Eğitim Programları Komisyonu"}
                      onCheckedChange={() => setCommission("Eğitim Programları Komisyonu")}
                    />
                    <Label htmlFor="education-commission">Eğitim Programları</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="trainers-commission"
                      checked={commission === "Eğitmen Komisyonu"}
                      onCheckedChange={() => setCommission("Eğitmen Komisyonu")}
                    />
                    <Label htmlFor="trainers-commission">Eğitmen Komisyonu</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="teams-commission"
                      checked={commission === "Takımlar Komisyonu"}
                      onCheckedChange={() => setCommission("Takımlar Komisyonu")}
                    />
                    <Label htmlFor="teams-commission">Takımlar Komisyonu</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="media-commission"
                      checked={commission === "Medya ve İletişim Komisyonu"}
                      onCheckedChange={() => setCommission("Medya ve İletişim Komisyonu")}
                    />
                    <Label htmlFor="media-commission">Medya ve İletişim</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Etkinlik Türü</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="all-types"
                      checked={eventType === "all"}
                      onCheckedChange={() => setEventType("all")}
                    />
                    <Label htmlFor="all-types">Tümü</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="deadlines"
                      checked={eventType === "deadline"}
                      onCheckedChange={() => setEventType("deadline")}
                    />
                    <Label htmlFor="deadlines">Son Tarihler</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="meetings"
                      checked={eventType === "meeting"}
                      onCheckedChange={() => setEventType("meeting")}
                    />
                    <Label htmlFor="meetings">Toplantılar</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="events"
                      checked={eventType === "event"}
                      onCheckedChange={() => setEventType("event")}
                    />
                    <Label htmlFor="events">Etkinlikler</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Hedef Kitle</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="all-audience" defaultChecked />
                    <Label htmlFor="all-audience">Tümü</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="workshops" defaultChecked />
                    <Label htmlFor="workshops">Atölyeler</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="managers" defaultChecked />
                    <Label htmlFor="managers">Atölye Sorumluları</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="trainers" defaultChecked />
                    <Label htmlFor="trainers">Eğitmenler</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="commissions" defaultChecked />
                    <Label htmlFor="commissions">Komisyonlar</Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtreleri Uygula
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
