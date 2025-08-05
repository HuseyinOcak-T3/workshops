import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Key, Save } from "lucide-react";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/profile/");
        setProfile(response.data);
      } catch (err) {
        setError("Profil yüklenemedi: " + err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await api.put("/profile/", profile);
      alert("Profil başarıyla güncellendi");
    } catch (err) {
      alert("Güncelleme başarısız: " + err);
    }
  };

  const handlePasswordUpdate = () => {
    if (password.new !== password.confirm) {
      alert("Yeni şifreler eşleşmiyor.");
      return;
    }
    alert("Şifre başarıyla güncellendi.");
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Navbar />
      <div className="space-y-6 p-6">
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
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg" alt={profile.first_name} />
                <AvatarFallback>{profile.first_name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold mt-4">{profile.first_name} {profile.last_name}</h3>
              <p className="text-muted-foreground mt-1">{profile.role}</p>
              <Badge className="mt-2" variant="outline">{profile.atelier_name || "Bilinmiyor"}</Badge>
              <div className="w-full mt-6 space-y-4 text-left">
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Telefon:</strong> {profile.phone || "-"}</p>
                <p><strong>Şehir:</strong> {profile.city || "-"}</p>
                <p><strong>Hakkında:</strong> {profile.bio || "-"}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Hesap Ayarları</CardTitle>
              <CardDescription>Profil bilgilerinizi ve şifrenizi güncelleyin</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="profile">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="profile">Profil</TabsTrigger>
                  <TabsTrigger value="password">Şifre</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">Ad</Label>
                    <Input id="first_name" name="first_name" value={profile.first_name || ""} onChange={handleChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last_name">Soyad</Label>
                    <Input id="last_name" name="last_name" value={profile.last_name || ""} onChange={handleChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta</Label>
                    <Input id="email" name="email" value={profile.email || ""} onChange={handleChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Hakkında</Label>
                    <Textarea id="bio" name="bio" value={profile.bio || ""} onChange={handleChange} />
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Bilgilendirme</AlertTitle>
                    <AlertDescription>
                      Bu bilgiler sistem yöneticileri tarafından görüntülenebilir.
                    </AlertDescription>
                  </Alert>
                </TabsContent>

                <TabsContent value="password" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="current">Mevcut Şifre</Label>
                    <Input id="current" name="current" type="password" value={password.current} onChange={handlePasswordChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new">Yeni Şifre</Label>
                    <Input id="new" name="new" type="password" value={password.new} onChange={handlePasswordChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm">Yeni Şifre (Tekrar)</Label>
                    <Input id="confirm" name="confirm" type="password" value={password.confirm} onChange={handlePasswordChange} />
                  </div>
                  <Alert>
                    <Key className="h-4 w-4" />
                    <AlertTitle>Güvenli Şifre İpuçları</AlertTitle>
                    <AlertDescription>
                      Güçlü bir şifre en az 8 karakter, büyük/küçük harf, rakam ve özel karakter içermelidir.
                    </AlertDescription>
                  </Alert>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">İptal</Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Değişiklikleri Kaydet
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
