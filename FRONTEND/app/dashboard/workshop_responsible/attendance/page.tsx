"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

// Sample data
const scholarData = [
  { id: 1, name: "Ahmet Yılmaz", grade: "10. Sınıf" },
  { id: 2, name: "Ayşe Demir", grade: "9. Sınıf" },
  { id: 3, name: "Mehmet Kaya", grade: "11. Sınıf" },
  { id: 4, name: "Zeynep Çelik", grade: "10. Sınıf" },
  { id: 5, name: "Mustafa Şahin", grade: "9. Sınıf" },
  { id: 6, name: "Elif Yıldız", grade: "11. Sınıf" },
  { id: 7, name: "Ali Öztürk", grade: "10. Sınıf" },
  { id: 8, name: "Selin Aydın", grade: "9. Sınıf" },
]

const trainerData = [
  { id: 1, name: "Prof. Dr. Ahmet Arslan", subject: "Robotik" },
  { id: 2, name: "Doç. Dr. Ayşe Yılmaz", subject: "Yazılım" },
  { id: 3, name: "Dr. Mehmet Kaya", subject: "Elektronik" },
]

export default function AttendancePage() {
  const { toast } = useToast()
  const [date, setDate] = useState<Date>(new Date())
  const [scholarAttendance, setScholarAttendance] = useState<Record<number, boolean>>({})
  const [trainerAttendance, setTrainerAttendance] = useState<Record<number, boolean>>({})
  const [session, setSession] = useState<string>("morning")

  const handleScholarAttendance = (id: number, checked: boolean) => {
    setScholarAttendance((prev) => ({ ...prev, [id]: checked }))
  }

  const handleTrainerAttendance = (id: number, checked: boolean) => {
    setTrainerAttendance((prev) => ({ ...prev, [id]: checked }))
  }

  const handleSaveScholarAttendance = () => {
    toast({
      title: "Bursiyer yoklaması kaydedildi",
      description: `${format(date, "d MMMM yyyy", { locale: tr })} tarihli bursiyer yoklaması başarıyla kaydedildi.`,
    })
  }

  const handleSaveTrainerAttendance = () => {
    toast({
      title: "Eğitmen yoklaması kaydedildi",
      description: `${format(date, "d MMMM yyyy", { locale: tr })} tarihli eğitmen yoklaması başarıyla kaydedildi.`,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Yoklama</h1>
        <p className="text-muted-foreground">Bursiyer ve Eğitmen yoklaması</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Tarih Seçimi</CardTitle>
            <CardDescription>Yoklama almak istediğiniz tarihi seçin</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              className="rounded-md border w-full"
            />
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-2">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="session">Oturum</Label>
              <Select value={session} onValueChange={setSession}>
                <SelectTrigger>
                  <SelectValue placeholder="Oturum seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Sabah (09:00 - 12:00)</SelectItem>
                  <SelectItem value="afternoon">Öğleden Sonra (13:00 - 16:00)</SelectItem>
                  <SelectItem value="evening">Akşam (17:00 - 20:00)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full pt-2">
              <p className="text-sm text-muted-foreground mb-2">Seçilen tarih ve oturum:</p>
              <p className="text-sm font-medium">
                {format(date, "d MMMM yyyy", { locale: tr })}
                {" - "}
                {session === "morning"
                  ? "Sabah (09:00 - 12:00)"
                  : session === "afternoon"
                    ? "Öğleden Sonra (13:00 - 16:00)"
                    : "Akşam (17:00 - 20:00)"}
              </p>
            </div>
          </CardFooter>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Yoklama Listesi</CardTitle>
            <CardDescription>{format(date, "d MMMM yyyy", { locale: tr })} tarihli yoklama</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="scholars">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="scholars">Bursiyerler</TabsTrigger>
                <TabsTrigger value="trainers">Eğitmenler</TabsTrigger>
              </TabsList>

              <TabsContent value="scholars" className="mt-6">
                <div className="border rounded-lg">
                  <div className="grid grid-cols-12 px-4 py-3 border-b bg-muted/50">
                    <div className="col-span-1 font-medium">#</div>
                    <div className="col-span-5 font-medium">İsim</div>
                    <div className="col-span-4 font-medium">Sınıf</div>
                    <div className="col-span-2 font-medium text-center">Durum</div>
                  </div>

                  <div className="divide-y">
                    {scholarData.map((scholar, index) => (
                      <div key={scholar.id} className="grid grid-cols-12 px-4 py-2 items-center">
                        <div className="col-span-1 text-muted-foreground">{index + 1}</div>
                        <div className="col-span-5">{scholar.name}</div>
                        <div className="col-span-4 text-muted-foreground">{scholar.grade}</div>
                        <div className="col-span-2 flex justify-center">
                          <Checkbox
                            id={`scholar-${scholar.id}`}
                            checked={scholarAttendance[scholar.id] || false}
                            onCheckedChange={(checked) => handleScholarAttendance(scholar.id, checked === true)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end mt-4 gap-2">
                  <Button variant="outline">Tümünü İşaretle</Button>
                  <Button onClick={handleSaveScholarAttendance}>Kaydet</Button>
                </div>
              </TabsContent>

              <TabsContent value="trainers" className="mt-6">
                <div className="border rounded-lg">
                  <div className="grid grid-cols-12 px-4 py-3 border-b bg-muted/50">
                    <div className="col-span-1 font-medium">#</div>
                    <div className="col-span-5 font-medium">İsim</div>
                    <div className="col-span-4 font-medium">Alan</div>
                    <div className="col-span-2 font-medium text-center">Durum</div>
                  </div>

                  <div className="divide-y">
                    {trainerData.map((trainer, index) => (
                      <div key={trainer.id} className="grid grid-cols-12 px-4 py-2 items-center">
                        <div className="col-span-1 text-muted-foreground">{index + 1}</div>
                        <div className="col-span-5">{trainer.name}</div>
                        <div className="col-span-4 text-muted-foreground">{trainer.subject}</div>
                        <div className="col-span-2 flex justify-center">
                          <Checkbox
                            id={`trainer-${trainer.id}`}
                            checked={trainerAttendance[trainer.id] || false}
                            onCheckedChange={(checked) => handleTrainerAttendance(trainer.id, checked === true)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end mt-4 gap-2">
                  <Button variant="outline">Tümünü İşaretle</Button>
                  <Button onClick={handleSaveTrainerAttendance}>Kaydet</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
