"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import toast from "react-hot-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Loader2, Camera, Save, X, Upload, Mail, Phone, User as UserIcon, Key, AlertCircle, Lock } from "lucide-react"
import { fetchWithAuth } from "@/lib/fetchWithAuth"


// const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// -----------------------------
// Types (backend'e uyumlu)
// -----------------------------

type City = { id: number; name: string }
type Atelier = { id: number; name: string; city: City }
type Title = { id: number; name: string }

type Profile = {
  id: number
  email: string
  username: string
  first_name: string
  last_name: string
  phone: string | null
  tc_no: string | null
  birth_date: string | null
  profile_picture: string | null
  bio: string | null
  expertise: string | null
  role: string | { code: string; name?: string; level?: number } | number
  permission_level: number
  title: Title | null        // read-only
  atelier_city: City | null
  atelier: Atelier | null
  city: string | null
  country: string | null
  // opsiyonel read-only alanlar (serializer'da var)
  is_online?: boolean
  last_active?: string | null
  unread_notifications?: number
  last_login?: string | null
  date_joined?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const pathname = usePathname()

  const [me, setMe] = useState<Profile | null>(null)
  const [cities, setCities] = useState<City[]>([])
  const [ateliers, setAteliers] = useState<Atelier[]>([])
  const [titles, setTitles] = useState<Title[]>([]) // sadece görüntü
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [file, setFile] = useState<File | null>(null)
  const [removePhoto, setRemovePhoto] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  const [pwd, setPwd] = useState({ current_password: "", new_password: "", confirm_password: "" })

  const NONE = "__none__"
  const access = typeof window !== "undefined" ? localStorage.getItem("access") : null

  const roleLabel = React.useMemo(() => {
    if (!me?.role) return "Kullanıcı"

    const roleCode =
      typeof me.role === "string"
        ? me.role
        : typeof me.role === "object" && me.role !== null
          ? (me.role as any).code ?? ""
          : String(me.role ?? "")

    const r = roleCode.toString().toLowerCase()

    if (r.includes("admin") || pathname.includes("/dashboard/admin")) return "Komisyon Çalışanı"
    if (r.includes("super") || pathname.includes("/dashboard/superuser")) return "Yönetici"
    return "Atölye Sorumlusu"
  }, [me?.role, pathname])

  useEffect(() => {
    if (!access) {
      router.replace("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Promise.all ile tüm verileri aynı anda ve doğru şekilde çekiyoruz.
        const [
          profileData,
          citiesData,
          ateliersData,
          titlesData
        ] = await Promise.all([
          fetchWithAuth<Profile>('/profile/'),
          fetchWithAuth<City[]>('/cities/'),
          fetchWithAuth<Atelier[]>('/ateliers/'),
          fetchWithAuth<Title[]>('/titles/'),
        ]);

        // Gelen verileri doğrudan state'e atıyoruz, .json() işlemi yok.
        setMe(profileData);
        setCities(citiesData);
        setAteliers(ateliersData);
        setTitles(titlesData);

      } catch (e: any) {
        // Hata yönetimi burada yapılıyor.
        setError(e.message || "Veriler alınamadı.");
        toast.error(e.message || "Profil bilgileri getirilirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [access, router]);

  const filteredAteliers = useMemo(() => {
    if (!me?.atelier_city) return ateliers
    return ateliers.filter((x) => x.city?.id === me.atelier_city?.id)
  }, [ateliers, me?.atelier_city])

  const onChange = (key: keyof Profile, value: any) => {
    if (!me) return
    if (key === "title") return
    if (key === "atelier_city") {
      setMe({ ...me, atelier_city: value, atelier: null as any })
    } else {
      setMe({ ...me, [key]: value })
    }
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!/^image\/(png|jpe?g|webp|gif)$/i.test(f.type)) {
      setError("Sadece resim dosyası yükleyebilirsiniz.")
      return
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("Dosya boyutu 5MB’ı aşamaz.")
      return
    }
    setError(null)
    setRemovePhoto(false)
    setFile(f)
  }

  const removeSelectedPhoto = () => {
    setFile(null)
    setRemovePhoto(true)
  }

const saveProfile = async () => {
    if (!access || !me) return;
    setSaving(true);
    setError(null);
    setFieldErrors({});

    const fd = new FormData();

    // Gerekli alanları FormData'ya ekleme
    const textMap: Partial<Record<keyof Profile, any>> = {
      first_name: me.first_name,
      last_name: me.last_name,
      phone: me.phone,
      tc_no: me.tc_no,
      birth_date: me.birth_date,
      bio: me.bio,
      expertise: me.expertise,
      city: me.city,
      country: me.country,
    };
    Object.entries(textMap).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, String(v));
      else fd.append(k, "");
    });

    if (me.atelier_city?.id) fd.append("atelier_city_id", String(me.atelier_city.id));
    else fd.append("atelier_city_id", "");

    if (me.atelier?.id) fd.append("atelier_id", String(me.atelier.id));
    else fd.append("atelier_id", "");

    if (file) {
      fd.append("profile_picture", file);
    } else if (removePhoto) {
      fd.append("profile_picture", "");
    }

    try {
      const updatedProfile = await fetchWithAuth<Profile>('/profile/', {
        method: "PATCH",

        body: fd,
      });

      setMe(updatedProfile);
      setFile(null);
      setRemovePhoto(false);
      toast.success("Profil güncellendi. Bilgileriniz başarıyla kaydedildi.");

    } catch (e: any) {
      // fetchWithAuth'tan gelen hatalar bu bloğa düşer.
      // Hata mesajı genellikle e.message içinde bulunur.
      setError(e.message || "Kaydedilemedi.");
      toast.error(e.message || "Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };
  const changePassword = async () => {
    if (!access) return;

    if (pwd.new_password !== pwd.confirm_password) {
      toast.error("Yeni şifreler eşleşmiyor.");
      return;
    }

    try {
      await fetchWithAuth(`/password/change/`, {
        method: "PATCH",
        body: JSON.stringify(pwd),
      });

      toast.success("Şifre başarıyla güncellendi.");
      setPwd({ current_password: "", new_password: "", confirm_password: "" });
    } catch (e: any) {
      toast.error(e.message || "Şifre güncellenemedi.");
    }
  };
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin mr-2" /> Yükleniyor…
      </div>
    )
  }

  if (!me) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>{error || "Profil bilgisi getirilemedi."}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profil</h1>
        <p className="text-muted-foreground">Kişisel bilgilerinizi görüntüleyin ve düzenleyin</p>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profil Bilgileri</CardTitle>
            <CardDescription>Kişisel bilgileriniz ve görev detaylarınız</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <Avatar className="h-32 w-32">
                {file ? (
                  <AvatarImage src={URL.createObjectURL(file)} alt="preview" />
                ) : me.profile_picture ? (
                  <AvatarImage src={me.profile_picture} alt={me.first_name} />
                ) : (
                  <AvatarImage src="/placeholder.svg?height=128&width=128" alt="placeholder" />
                )}
                <AvatarFallback className="text-4xl">{(me.first_name || me.username || "?").charAt(0)}</AvatarFallback>
              </Avatar>
              <Button size="icon" variant="outline" className="absolute bottom-0 right-0 rounded-full">
                <label htmlFor="photo-input" className="cursor-pointer p-2">
                  <Camera className="h-4 w-4" />
                </label>
                <input id="photo-input" type="file" accept="image/*" className="hidden" onChange={onFileChange} />
              </Button>
            </div>

            <h3 className="text-xl font-bold">{me.first_name} {me.last_name}</h3>
            <p className="text-muted-foreground mt-1">{me.title?.name || "—"}</p>

            <div className="w-full mt-6 space-y-3">
              <div className="flex items-center justify-center">
                <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-sm">{me.email}</span>
              </div>
              <div className="flex items-center justify-center">
                <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-sm">{me.phone || "—"}</span>
              </div>
              <div className="flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-sm">{me.atelier ? `${me.atelier.city?.name} – ${me.atelier.name}` : me.atelier_city?.name || "—"}</span>
              </div>
            </div>

            <div className="w-full mt-6 pt-6 border-t text-left">
              <h4 className="font-medium mb-2">Hakkında</h4>
              <p className="text-sm text-muted-foreground">{me.bio || "—"}</p>
            </div>

            <div className="w-full mt-6 pt-6 border-t text-left">
              <h4 className="font-medium mb-2">Uzmanlık Alanları</h4>
              <p className="text-sm text-muted-foreground">{me.expertise || "—"}</p>
            </div>

            {(file || me.profile_picture) && (
              <Button variant="outline" type="button" className="mt-6" onClick={removeSelectedPhoto}>
                <X className="h-4 w-4 mr-1" /> Fotoğrafı Kaldır
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Hesap Ayarları</CardTitle>
            <CardDescription>Profil bilgilerinizi ve şifrenizi güncelleyin</CardDescription>
          </CardHeader>
          <CardContent>

            <Tabs  value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profil</TabsTrigger>
                <TabsTrigger value="password">Şifre</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ad</Label>
                    <Input value={me.first_name || ""} onChange={(e) => onChange("first_name", e.target.value)} />
                    {fieldErrors.first_name && <p className="text-xs text-red-500">{fieldErrors.first_name.join(" ")}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Soyad</Label>
                    <Input value={me.last_name || ""} onChange={(e) => onChange("last_name", e.target.value)} />
                    {fieldErrors.last_name && <p className="text-xs text-red-500">{fieldErrors.last_name.join(" ")}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>E‑posta</Label>
                    <Input value={me.email} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Kullanıcı Adı</Label>
                    <Input value={me.username} disabled />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ünvan</Label>
                    <Input value={me.title?.name || ""} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefon</Label>
                    <Input value={me.phone || ""} onChange={(e) => onChange("phone", e.target.value)} />
                    {fieldErrors.phone && <p className="text-xs text-red-500">{fieldErrors.phone.join(" ")}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>T.C. Kimlik No</Label>
                    <Input value={me.tc_no || ""} onChange={(e) => onChange("tc_no", e.target.value)} maxLength={11} />
                    {fieldErrors.tc_no && <p className="text-xs text-red-500">{fieldErrors.tc_no.join(" ")}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Doğum Tarihi</Label>
                    <Input type="date" value={me.birth_date || ""} onChange={(e) => onChange("birth_date", e.target.value)} />
                    {fieldErrors.birth_date && <p className="text-xs text-red-500">{fieldErrors.birth_date.join(" ")}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Hakkında</Label>
                  <Textarea value={me.bio || ""} onChange={(e) => onChange("bio", e.target.value)} rows={4} />
                  {fieldErrors.bio && <p className="text-xs text-red-500">{fieldErrors.bio.join(" ")}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Uzmanlıklar (virgülle ayırın)</Label>
                  <Input value={me.expertise || ""} onChange={(e) => onChange("expertise", e.target.value)} />
                  {fieldErrors.expertise && <p className="text-xs text-red-500">{fieldErrors.expertise.join(" ")}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ülke</Label>
                    <Input value={me.country || ""} onChange={(e) => onChange("country", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Şehir (serbest metin)</Label>
                    <Input value={me.city || ""} onChange={(e) => onChange("city", e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Atölye Şehri</Label>
                    <Select
                      value={me.atelier_city?.id ? String(me.atelier_city.id) : NONE}
                      onValueChange={(val) => {
                        if (val === NONE) { onChange("atelier_city", null as any); return }
                        const c = cities.find((x) => String(x.id) === val) || null
                        onChange("atelier_city", c as any)
                      }}
                    >
                      <SelectTrigger><SelectValue placeholder="Seçiniz" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value={NONE}>—</SelectItem>
                        {cities.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldErrors.atelier_city_id && <p className="text-xs text-red-500">{fieldErrors.atelier_city_id.join(" ")}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Atölye</Label>
                    <Select
                      value={me.atelier?.id ? String(me.atelier.id) : NONE}
                      onValueChange={(val) => {
                        if (val === NONE) { onChange("atelier", null as any); return }
                        const a = filteredAteliers.find((x) => String(x.id) === val) || null
                        onChange("atelier", a as any)
                      }}
                    >
                      <SelectTrigger><SelectValue placeholder="Seçiniz" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value={NONE}>—</SelectItem>
                        {filteredAteliers.map((a) => (
                          <SelectItem key={a.id} value={String(a.id)}>{a.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldErrors.atelier_id && <p className="text-xs text-red-500">{fieldErrors.atelier_id.join(" ")}</p>}
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Bilgilendirme</AlertTitle>
                  <AlertDescription>Profil bilgileriniz sistem yöneticileri tarafından görüntülenebilir.</AlertDescription>
                </Alert>
              </TabsContent>

              {/* PASSWORD TAB */}
              <TabsContent value="password" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="current_password">Mevcut Şifre</Label>
                  <Input id="current_password" type="password" value={pwd.current_password} onChange={(e) => setPwd({ ...pwd, current_password: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new_password">Yeni Şifre</Label>
                  <Input id="new_password" type="password" value={pwd.new_password} onChange={(e) => setPwd({ ...pwd, new_password: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Yeni Şifre (Tekrar)</Label>
                  <Input id="confirm_password" type="password" value={pwd.confirm_password} onChange={(e) => setPwd({ ...pwd, confirm_password: e.target.value })} />
                </div>
                <Alert>
                  <Key className="h-4 w-4" />
                  <AlertTitle>Güvenli Şifre İpuçları</AlertTitle>
                  <AlertDescription>Güçlü bir şifre en az 8 karakter, büyük/küçük harf, rakam ve özel karakter içermelidir.</AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <div className="flex gap-2">
              {activeTab === "password" && (
                <Button variant="outline" onClick={changePassword}>
                  <Lock className="mr-2 h-4 w-4" /> Şifreyi Güncelle
                </Button>
              )}
              {activeTab === "profile" && (
                <Button onClick={saveProfile} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" /> Kaydediliyor…
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Değişiklikleri Kaydet
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Alt güvenlik kartı (süsleme amaçlı, backend entegrasyonu yok) */}
      <Card>
        <CardHeader>
          <CardTitle>Hesap Güvenliği</CardTitle>
          <CardDescription>Hesap güvenlik ayarlarınızı yönetin</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="font-medium">İki Faktörlü Kimlik Doğrulama</h4>
                <p className="text-sm text-muted-foreground">Hesabınıza giriş yaparken ek bir güvenlik katmanı ekleyin.</p>
              </div>
              <Button variant="outline">Yapılandır</Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="font-medium">Oturum Yönetimi</h4>
                <p className="text-sm text-muted-foreground">Aktif oturumlarınızı görüntüleyin ve yönetin.</p>
              </div>
              <Button variant="outline">Oturumları Görüntüle</Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="font-medium">Giriş Geçmişi</h4>
                <p className="text-sm text-muted-foreground">Hesabınıza yapılan son giriş işlemlerini görüntüleyin.</p>
              </div>
              <Button variant="outline">Geçmişi Görüntüle</Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>Son şifre değişikliği: {me.last_login ? new Date(me.last_login).toLocaleDateString() : "—"}</span>
          </div>
        </CardFooter>
      </Card>

      {/* Test butonu */}
      <Button
        variant="outline"
        onClick={() => toast.success("Test bildirimi başarılı!")}
        className="fixed bottom-4 right-4"
      >
        Bildirim Testi
      </Button>
    </div>
  )
}
