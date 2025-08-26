"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

// --- TİPLER ---
interface BasePerms {
  can_view: boolean;
  can_create: boolean;
  can_update: boolean;
  can_archive: boolean;
}

interface AppPermissions {
  announcements: BasePerms;
  tasks: BasePerms;
}

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  role: { code: string; name: string; level: number } | null;
  profile_picture?: string;
  permissions: Record<string, boolean>;
}

interface AuthContextType {
  user: User | null;
  perms: AppPermissions;
  accessToken: string | null;
  loading: boolean;
  login: (data: { access: string; refresh: string; user: User }) => void;
  logout: (sessionExpired?: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultPerms: AppPermissions = {
  announcements: { can_view: false, can_create: false, can_update: false, can_archive: false },
  tasks: { can_view: false, can_create: false, can_update: false, can_archive: false },
};

// --- DOĞRU ÇALIŞAN YARDIMCI FONKSİYON ---
const parsePermissions = (rawPerms: Record<string, boolean>): AppPermissions => {
    const parsed: AppPermissions = JSON.parse(JSON.stringify(defaultPerms));
    for (const key in rawPerms) {
        const parts = key.split('_');
        const module = parts[0];
        const permission = parts.slice(1).join('_');

        if (module && permission && parsed[module as keyof AppPermissions]) {
            (parsed[module as keyof AppPermissions] as any)[permission] = rawPerms[key];
        }
    }
    return parsed;
}


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [perms, setPerms] = useState<AppPermissions>(defaultPerms);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access');
      if (token && pathname !== '/login') {
        setAccessToken(token);
        try {
          // 1. Backend'den en güncel kullanıcı ve yetki bilgilerini al
          const headerData = await fetchWithAuth<User>('/profile/header/');
          setUser(headerData);

          // 2. Gelen taze yetkileri ayrıştır ve uygulama state'ine ata (EN ÖNEMLİ DÜZELTME)
          const userPerms = parsePermissions(headerData.permissions || {});
          setPerms(userPerms);

          // 3. localStorage'ı da en güncel yetkilerle güncelle
          localStorage.setItem('perms', JSON.stringify(headerData.permissions || {}));
          localStorage.setItem('userRole', headerData.role?.code || '');

        } catch (error) {
          console.error("Oturum başlatma hatası:", error);
          logout(true); // Token geçersizse temizle ve login'e yolla
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [pathname]);

  const login = (data: { access: string; refresh: string; user: User }) => {
    localStorage.setItem('access', data.access);
    localStorage.setItem('refresh', data.refresh);
    localStorage.setItem('userRole', data.user?.role?.code || '');
    localStorage.setItem('perms', JSON.stringify(data.user.permissions || {}));

    setAccessToken(data.access);
    setUser(data.user);
    setPerms(parsePermissions(data.user.permissions || {}));

    const roleCode = data.user?.role?.code || 'student';
    router.push(`/dashboard/${roleCode}`);
  };

  const logout = (sessionExpired = false) => {
    localStorage.clear();
    setUser(null);
    setAccessToken(null);
    setPerms(defaultPerms);
    if (sessionExpired && pathname !== '/login') {
        router.replace('/login?session_expired=true');
    } else if (!sessionExpired && pathname !== '/login') {
        router.replace('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, perms, accessToken, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
