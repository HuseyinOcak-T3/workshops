'use client'

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import toast from "react-hot-toast"
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/app/context/AuthContext"
import { API_BASE_URL } from "@/lib/fetchWithAuth" // <-- API_BASE_URL İMPORT EDİLDİ

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      const roleCode = user.role?.code || 'student';
      router.replace(`/dashboard/${roleCode}`);
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (searchParams.get('session_expired')) {
        toast.error("Oturum süreniz doldu. Lütfen tekrar giriş yapın.");
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data?.non_field_errors?.[0] || data?.detail || "Geçersiz e-posta veya şifre";
        throw new Error(errorMsg);
      }

      login(data);

    } catch (error: any) {
      toast.error(error.message || "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.")
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || user) {
      return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Giriş Yap</CardTitle>
          <CardDescription>Sisteme erişmek için bilgilerinizi girin.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="ornek@deneyap.org"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Giriş yapılıyor...
                </>
              ) : (
                "Giriş Yap"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-sm text-center text-muted-foreground">
          Şifrenizi mi unuttunuz? Sistem yöneticinizle iletişime geçin.
        </CardFooter>
      </Card>
    </div>
  )
}