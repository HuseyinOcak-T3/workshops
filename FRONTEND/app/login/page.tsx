'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

import custom_axios from '@/lib/customAxios';
import { ApiConstants } from '@/lib/ApiConstants';
import { normalizeAndSetPerms } from "@/lib/permissions";


export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const safeRedirect = (next?: string | null) =>
    next && next.startsWith('/') && !next.startsWith('//') ? next : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await custom_axios.post(ApiConstants.AUTH.TOKEN, formData);

      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);

      const roleCode: string =
        typeof data?.user?.role === 'string'
          ? data.user.role
          : data?.user?.role?.code || 'admin';

      if (data?.perms) {
        normalizeAndSetPerms(data.perms, data?.user?.role, data?.user?.permission_level);
      } else {
        try {
          const prof = await custom_axios.get(ApiConstants.AUTH.PROFILE);
          normalizeAndSetPerms(prof.data?.perms, prof.data?.role ?? data?.user?.role, prof.data?.permission_level ?? data?.user?.permission_level);
        } catch {
          normalizeAndSetPerms(null, data?.user?.role, data?.user?.permission_level);
        }
      }

      console.log(data);
      console.log(data.user);

      if (data?.user?.username) {
        localStorage.setItem('username', data.user.username);

      }
      if (data?.user?.permission_level != null) {
        localStorage.setItem('permissionLevel', String(data.user.permission_level));
      }
      localStorage.setItem('userRole', roleCode);
      if (typeof data?.user?.role === 'object' && data.user.role?.name) {
        localStorage.setItem('userRoleName', data.user.role.name);
      }

      toast.success('Giriş başarılı!');
      const next = safeRedirect(searchParams.get('next'));
      router.push(next || `/dashboard/${roleCode}`);
    } catch (error: any) {
      const msg =
        error?.response?.data?.non_field_errors?.[0] ||
        error?.response?.data?.detail ||
        error?.message ||
        'Giriş başarısız. Bilgilerinizi kontrol edin.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

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
                autoComplete="username"
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
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Giriş yapılıyor…
                </>
              ) : (
                'Giriş Yap'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-sm text-center text-muted-foreground">
          Şifrenizi mi unuttunuz? Sistem yöneticinizle iletişime geçin.
        </CardFooter>
      </Card>
    </div>
  );
}
