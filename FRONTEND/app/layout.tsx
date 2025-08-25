"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster as HotToaster } from "react-hot-toast"
import {
  Bell, Calendar, CheckSquare, ChevronLeft, ChevronRight, ClipboardList, Home,
  LogOut, Menu, MessageSquare, Settings, User, Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { Loader2 } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout, perms } = useAuth()

  const role = user?.role?.code || null;

  const navItems = useMemo(() => {
    const allNavItems = {
      workshop_responsible: [
        { icon: Home, label: "Ana Sayfa", href: "/dashboard/workshop_responsible" },
        { icon: CheckSquare, label: "Yoklama", href: "/attendance" },
        ...(perms.tasks.can_view ? [{ icon: ClipboardList, label: "Görevler", href: "/tasks" }] : []),
        ...(perms.announcements.can_view ? [{ icon: MessageSquare, label: "Duyurular", href: "/announcements" }] : []),
      ],
      commission: [
        { icon: Home, label: "Ana Sayfa", href: "/dashboard/commission" },
        ...(perms.announcements.can_view ? [{ icon: MessageSquare, label: "Duyurular", href: "/announcements" }] : []),
        ...(perms.tasks.can_view ? [{ icon: ClipboardList, label: "Görev Atama", href: "/tasks" }] : []),
        { icon: Users, label: "Atölyeler", href: "/dashboard/commission/workshops" },
      ],
      admin: [
        { icon: Home, label: "Ana Sayfa", href: "/dashboard/admin" },
        { icon: Users, label: "Atölyeler", href: "/dashboard/admin/workshops" },
        ...(perms.tasks.can_view ? [{ icon: ClipboardList, label: "Görevler", href: "/tasks" }] : []),
        ...(perms.announcements.can_view ? [{ icon: MessageSquare, label: "Duyurular", href: "/announcements" }] : []),
      ],
      superuser: [
          { icon: Home, label: "Ana Sayfa", href: "/dashboard/superuser" },
          { icon: Users, label: "Atölyeler", href: "/workshops" },
          ...(perms.tasks.can_view ? [{ icon: ClipboardList, label: "Görevler", href: "/tasks" }] : []),
          ...(perms.announcements.can_view ? [{ icon: MessageSquare, label: "Duyurular", href: "/announcements" }] : []),
      ],
      student: [
          { icon: Home, label: "Ana Sayfa", href: "/dashboard/student" },
          ...(perms.tasks.can_view ? [{ icon: ClipboardList, label: "Görevler", href: "/tasks" }] : []),
          ...(perms.announcements.can_view ? [{ icon: MessageSquare, label: "Duyurular", href: "/announcements" }] : []),
      ],
    };

    return role ? allNavItems[role as keyof typeof allNavItems] || [] : [];
  }, [role, perms]);

  return (
    <div className={cn("relative flex flex-col border-r bg-background h-screen", collapsed ? "w-16" : "w-64", className)}>
      <div className="flex h-16 items-center justify-between border-b px-4">
        <Link href={role ? `/dashboard/${role}`: '/'} className={cn("flex items-center gap-2", collapsed && "justify-center")}>
            <div className="h-8 w-8 bg-primary rounded-full" />
            {!collapsed && <span className="text-lg font-semibold">DENEYAP</span>}
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="hidden md:flex">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <nav className="flex flex-col gap-1 p-2 flex-1">
        {navItems.map(({ icon: Icon, label, href }, index) => (
          <Button key={index} variant={pathname === href ? "secondary" : "ghost"} asChild className={cn("justify-start", collapsed && "justify-center px-2")}>
            <Link href={href}>
              <Icon className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
              {!collapsed && <span>{label}</span>}
            </Link>
          </Button>
        ))}
      </nav>
      <div className="border-t p-2">
        <Button variant="ghost" onClick={() => logout()} className={cn("justify-start w-full", collapsed && "justify-center px-2")}>
            <LogOut className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
            {!collapsed && <span>Çıkış Yap</span>}
        </Button>
      </div>
    </div>
  )
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();

  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
      return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar className="hidden md:flex" />
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
          <Sheet>
            <SheetTrigger asChild><Button variant="outline" size="icon" className="md:hidden"><Menu className="h-4 w-4" /></Button></SheetTrigger>
            <SheetContent side="left" className="p-0"><Sidebar /></SheetContent>
          </Sheet>
          <div className="flex flex-1 items-center justify-end gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-full"><Bell className="h-5 w-5" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Bildirimler</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <p className="p-4 text-xs text-muted-foreground text-center">Bildirim bulunmuyor.</p>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    {user?.profile_picture && <AvatarImage src={user.profile_picture} />}
                    <AvatarFallback>{(user?.first_name?.[0] ?? user?.username?.[0] ?? "U").toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.role?.name || "Kullanıcı"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile"><User className="mr-2 h-4 w-4" />Profil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/settings"><Settings className="mr-2 h-4 w-4" />Ayarlar</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}><LogOut className="mr-2 h-4 w-4" />Çıkış Yap</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            <AppLayout>{children}</AppLayout>
          </AuthProvider>
          <HotToaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}