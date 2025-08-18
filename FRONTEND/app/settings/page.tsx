"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { usePathname } from "next/navigation"
import { AlertCircle, Bell, Check, Globe, Moon, Palette, Save, Sun } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const { toast } = useToast()
  const pathname = usePathname()

  // Determine user role based on pathname
  const getUserRole = () => {
    if (pathname.includes("/dashboard/workshop_responsible")) {
      return "user"
    } else if (pathname.includes("/dashboard/admin")) {
      return "admin"
    } else if (pathname.includes("/dashboard/superuser")) {
      return "superuser"
    }
    return "user"
  }

  const role = getUserRole()

  // Settings state
  const [settings, setSettings] = useState({
    appearance: {
      theme: "system",
      fontSize: "medium",
      colorScheme: "default",
      reducedMotion: false,
      highContrast: false,
    },
    notifications: {
      email: {
        announcements: true,
        tasks: true,
        reminders: true,
        updates: false,
      },
      push: {
        announcements: true,
        tasks: true,
        reminders: true,
        updates: true,
      },
    },
    language: "tr",
    timezone: "Europe/Istanbul",
  })

  const handleAppearanceChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [key]: value,
      },
    }))
  }

  const handleNotificationChange = (type: "email" | "push", key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: {
          ...prev.notifications[type],
          [key]: value,
        },
      },
    }))
  }

  const handleSaveSettings = () => {
    toast({
      title: "Ayarlar kaydedildi",
      description: "Ayarlarınız başarıyla güncellendi.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ayarlar</h1>
        <p className="text-muted-foreground">Sistem ayarlarınızı özelleştirin</p>
      </div>

      <Tabs defaultValue="appearance">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="appearance">Görünüm</TabsTrigger>
            <TabsTrigger value="notifications">Bildirimler</TabsTrigger>
            <TabsTrigger value="language">Dil ve Bölge</TabsTrigger>
            <TabsTrigger value="privacy">Gizlilik</TabsTrigger>
          </TabsList>

          <Button onClick={handleSaveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Ayarları Kaydet
          </Button>
        </div>

        <TabsContent value="appearance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Görünüm Ayarları</CardTitle>
              <CardDescription>Arayüz görünümünü özelleştirin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Tema</h3>
                <RadioGroup
                  defaultValue={settings.appearance.theme}
                  onValueChange={(value) => handleAppearanceChange("theme", value)}
                  className="flex space-x-4"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="border rounded-md p-2 cursor-pointer hover:border-primary">
                      <RadioGroupItem value="light" id="theme-light" className="sr-only" />
                      <Label htmlFor="theme-light" className="cursor-pointer">
                        <div className="w-20 h-20 bg-white border rounded-md flex items-center justify-center">
                          <Sun className="h-8 w-8 text-yellow-500" />
                        </div>
                      </Label>
                    </div>
                    <Label htmlFor="theme-light">Açık</Label>
                  </div>

                  <div className="flex flex-col items-center space-y-2">
                    <div className="border rounded-md p-2 cursor-pointer hover:border-primary">
                      <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
                      <Label htmlFor="theme-dark" className="cursor-pointer">
                        <div className="w-20 h-20 bg-gray-900 border rounded-md flex items-center justify-center">
                          <Moon className="h-8 w-8 text-blue-400" />
                        </div>
                      </Label>
                    </div>
                    <Label htmlFor="theme-dark">Koyu</Label>
                  </div>

                  <div className="flex flex-col items-center space-y-2">
                    <div className="border rounded-md p-2 cursor-pointer hover:border-primary">
                      <RadioGroupItem value="system" id="theme-system" className="sr-only" />
                      <Label htmlFor="theme-system" className="cursor-pointer">
                        <div className="w-20 h-20 bg-gradient-to-br from-white to-gray-900 border rounded-md flex items-center justify-center">
                          <div className="h-8 w-8 flex">
                            <Sun className="h-8 w-4 text-yellow-500" />
                            <Moon className="h-8 w-4 text-blue-400" />
                          </div>
                        </div>
                      </Label>
                    </div>
                    <Label htmlFor="theme-system">Sistem</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Renk Şeması</h3>
                <div className="grid grid-cols-5 gap-4">
                  <div
                    className={`h-10 rounded-md bg-primary cursor-pointer flex items-center justify-center ${
                      settings.appearance.colorScheme === "default" ? "ring-2 ring-primary ring-offset-2" : ""
                    }`}
                    onClick={() => handleAppearanceChange("colorScheme", "default")}
                  >
                    {settings.appearance.colorScheme === "default" && <Check className="h-5 w-5 text-white" />}
                  </div>

                  <div
                    className={`h-10 rounded-md bg-blue-600 cursor-pointer flex items-center justify-center ${
                      settings.appearance.colorScheme === "blue" ? "ring-2 ring-blue-600 ring-offset-2" : ""
                    }`}
                    onClick={() => handleAppearanceChange("colorScheme", "blue")}
                  >
                    {settings.appearance.colorScheme === "blue" && <Check className="h-5 w-5 text-white" />}
                  </div>

                  <div
                    className={`h-10 rounded-md bg-green-600 cursor-pointer flex items-center justify-center ${
                      settings.appearance.colorScheme === "green" ? "ring-2 ring-green-600 ring-offset-2" : ""
                    }`}
                    onClick={() => handleAppearanceChange("colorScheme", "green")}
                  >
                    {settings.appearance.colorScheme === "green" && <Check className="h-5 w-5 text-white" />}
                  </div>

                  <div
                    className={`h-10 rounded-md bg-purple-600 cursor-pointer flex items-center justify-center ${
                      settings.appearance.colorScheme === "purple" ? "ring-2 ring-purple-600 ring-offset-2" : ""
                    }`}
                    onClick={() => handleAppearanceChange("colorScheme", "purple")}
                  >
                    {settings.appearance.colorScheme === "purple" && <Check className="h-5 w-5 text-white" />}
                  </div>

                  <div
                    className={`h-10 rounded-md bg-orange-600 cursor-pointer flex items-center justify-center ${
                      settings.appearance.colorScheme === "orange" ? "ring-2 ring-orange-600 ring-offset-2" : ""
                    }`}
                    onClick={() => handleAppearanceChange("colorScheme", "orange")}
                  >
                    {settings.appearance.colorScheme === "orange" && <Check className="h-5 w-5 text-white" />}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Yazı Boyutu</h3>
                <Select
                  value={settings.appearance.fontSize}
                  onValueChange={(value) => handleAppearanceChange("fontSize", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Yazı boyutu seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Küçük</SelectItem>
                    <SelectItem value="medium">Orta</SelectItem>
                    <SelectItem value="large">Büyük</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Erişilebilirlik</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="reduced-motion">Azaltılmış Hareket</Label>
                    <Switch
                      id="reduced-motion"
                      checked={settings.appearance.reducedMotion}
                      onCheckedChange={(checked) => handleAppearanceChange("reducedMotion", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="high-contrast">Yüksek Kontrast</Label>
                    <Switch
                      id="high-contrast"
                      checked={settings.appearance.highContrast}
                      onCheckedChange={(checked) => handleAppearanceChange("highContrast", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Alert>
                <Palette className="h-4 w-4" />
                <AlertTitle>Bilgilendirme</AlertTitle>
                <AlertDescription>
                  Görünüm ayarlarınız tarayıcı çerezlerinde saklanır ve sadece bu cihazda geçerlidir.
                </AlertDescription>
              </Alert>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Bildirim Ayarları</CardTitle>
              <CardDescription>Hangi bildirimler alacağınızı yönetin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">E-posta Bildirimleri</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-announcements">Duyurular</Label>
                    <Switch
                      id="email-announcements"
                      checked={settings.notifications.email.announcements}
                      onCheckedChange={(checked) => handleNotificationChange("email", "announcements", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-tasks">Görev Atamaları</Label>
                    <Switch
                      id="email-tasks"
                      checked={settings.notifications.email.tasks}
                      onCheckedChange={(checked) => handleNotificationChange("email", "tasks", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-reminders">Hatırlatıcılar</Label>
                    <Switch
                      id="email-reminders"
                      checked={settings.notifications.email.reminders}
                      onCheckedChange={(checked) => handleNotificationChange("email", "reminders", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-updates">Sistem Güncellemeleri</Label>
                    <Switch
                      id="email-updates"
                      checked={settings.notifications.email.updates}
                      onCheckedChange={(checked) => handleNotificationChange("email", "updates", checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Anlık Bildirimler</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-announcements">Duyurular</Label>
                    <Switch
                      id="push-announcements"
                      checked={settings.notifications.push.announcements}
                      onCheckedChange={(checked) => handleNotificationChange("push", "announcements", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-tasks">Görev Atamaları</Label>
                    <Switch
                      id="push-tasks"
                      checked={settings.notifications.push.tasks}
                      onCheckedChange={(checked) => handleNotificationChange("push", "tasks", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-reminders">Hatırlatıcılar</Label>
                    <Switch
                      id="push-reminders"
                      checked={settings.notifications.push.reminders}
                      onCheckedChange={(checked) => handleNotificationChange("push", "reminders", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-updates">Sistem Güncellemeleri</Label>
                    <Switch
                      id="push-updates"
                      checked={settings.notifications.push.updates}
                      onCheckedChange={(checked) => handleNotificationChange("push", "updates", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Alert>
                <Bell className="h-4 w-4" />
                <AlertTitle>Bilgilendirme</AlertTitle>
                <AlertDescription>Kritik sistem bildirimleri her zaman gönderilir ve kapatılamaz.</AlertDescription>
              </Alert>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="language" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Dil ve Bölge Ayarları</CardTitle>
              <CardDescription>Dil, saat dilimi ve bölge ayarlarınızı yönetin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Dil</h3>
                <Select
                  value={settings.language}
                  onValueChange={(value) => setSettings({ ...settings, language: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Dil seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tr">Türkçe</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Saat Dilimi</h3>
                <Select
                  value={settings.timezone}
                  onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Saat dilimi seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Europe/Istanbul">İstanbul (UTC+3)</SelectItem>
                    <SelectItem value="Europe/London">Londra (UTC+0/+1)</SelectItem>
                    <SelectItem value="America/New_York">New York (UTC-5/-4)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo (UTC+9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Alert>
                <Globe className="h-4 w-4" />
                <AlertTitle>Bilgilendirme</AlertTitle>
                <AlertDescription>Dil ve bölge ayarlarınız tüm cihazlarınızda geçerli olacaktır.</AlertDescription>
              </Alert>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gizlilik Ayarları</CardTitle>
              <CardDescription>Gizlilik ve veri paylaşım tercihlerinizi yönetin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Veri Paylaşımı</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="analytics">Analitik Verileri</Label>
                      <p className="text-sm text-muted-foreground">Sistem kullanım istatistiklerini paylaşın</p>
                    </div>
                    <Switch id="analytics" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="improvement">İyileştirme Programı</Label>
                      <p className="text-sm text-muted-foreground">Sistem iyileştirme programına katılın</p>
                    </div>
                    <Switch id="improvement" defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Hesap Görünürlüğü</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="profile-visibility">Profil Görünürlüğü</Label>
                      <p className="text-sm text-muted-foreground">
                        Profilinizin kimler tarafından görüntülenebileceğini seçin
                      </p>
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Görünürlük seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Herkes</SelectItem>
                        <SelectItem value="team">Sadece Ekibim</SelectItem>
                        <SelectItem value="admin">Sadece Yöneticiler</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Veri ve Gizlilik</h3>
                <div className="space-y-2">
                  <Button variant="outline">Verilerimi İndir</Button>
                  <p className="text-sm text-muted-foreground">
                    Sistemde saklanan tüm kişisel verilerinizin bir kopyasını indirin.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Bilgilendirme</AlertTitle>
                <AlertDescription>Gizlilik ayarlarınız KVKK ve ilgili mevzuata uygun olarak işlenir.</AlertDescription>
              </Alert>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
