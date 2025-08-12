'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        const errorMsg = data.non_field_errors?.[0] ||
                        data.detail ||
                        "Geçersiz e-posta veya şifre"
        throw new Error(errorMsg)
      }

      localStorage.setItem("access", data.access)
      localStorage.setItem("refresh", data.refresh)
      localStorage.setItem("userRole", data.user.role)
      localStorage.setItem("username", data.user.username)
      localStorage.setItem("permissionLevel", data.user.permission_level)

      toast.success("Giriş başarılı! Yönlendiriliyorsunuz...")
      router.push(`/dashboard/${data.user.role}`)
    } catch (error: any) {
      toast.error(error.message || "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.")
    } finally {
      setLoading(false)
    }
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