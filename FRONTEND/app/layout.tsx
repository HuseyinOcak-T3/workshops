"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster as HotToaster } from "react-hot-toast";
import {
  Bell, Calendar, CheckSquare, ChevronLeft, ChevronRight, ClipboardList,
  Home, LogOut, Menu, MessageSquare, Settings, User, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

import { fetchJson } from "@/lib/fetchWithAuth";
import { setPerms } from "@/lib/permissions";

const inter = Inter({ subsets: ["latin"] });

type RolePayload = string | { code?: string; name?: string; level?: number } | number | null | undefined;
const roleToText = (role: RolePayload): string => {
  if (!role) return "";
  if (typeof role === "string") return role;
  if (typeof role === "object") return role.code ?? role.name ?? "";
  return "";
};

interface SidebarProps {
  className?: string;
  onLogout?: () => void;
}

function Sidebar({ className, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [role, setRole] =
    useState<"workshop_responsible" | "commission" | "admin" | "student">("student");

  useEffect(() => {
    if (pathname.includes("/dashboard/workshop_responsible")) setRole("workshop_responsible");
    else if (pathname.includes("/dashboard/commission")) setRole("commission");
    else if (pathname.includes("/dashboard/admin")) setRole("admin");
    else if (pathname.includes("/dashboard/student")) setRole("student");
  }, [pathname]);

  const navItems = {
    workshop_responsible: [
      { icon: Home, label: "Ana Sayfa", href: "/dashboard/workshop_responsible" },
      { icon: CheckSquare, label: "Yoklama", href: "/dashboard/workshop_responsible/attendance" },
      { icon: ClipboardList, label: "Görevler", href: "/dashboard/workshop_responsible/tasks" },
      { icon: MessageSquare, label: "Duyurular", href: "/dashboard/workshop_responsible/announcements" },
      { icon: Calendar, label: "Takvim", href: "/dashboard/workshop_responsible/calendar" },
    ],
    commission: [
      { icon: Home, label: "Ana Sayfa", href: "/dashboard/commission" },
      { icon: MessageSquare, label: "Duyurular", href: "/dashboard/commission/announcements" },
      { icon: ClipboardList, label: "Görev Atama", href: "/dashboard/commission/tasks" },
      { icon: Users, label: "Atölyeler", href: "/dashboard/commission/workshops" },
      { icon: CheckSquare, label: "Raporlar", href: "/dashboard/commission/reports" },
      { icon: Calendar, label: "Takvim", href: "/dashboard/commission/calendar" },
    ],
    admin: [
      { icon: Home, label: "Ana Sayfa", href: "/dashboard/admin" },
      { icon: Users, label: "Atölyeler", href: "/dashboard/admin/workshops" },
      { icon: ClipboardList, label: "Görevler", href: "/dashboard/admin/tasks" },
      { icon: MessageSquare, label: "Duyurular", href: "/dashboard/admin/announcements" },
      { icon: CheckSquare, label: "Raporlar", href: "/dashboard/admin/reports" },
      { icon: Calendar, label: "Takvim", href: "/dashboard/admin/calendar" },
    ],
    student: [
      { icon: Home, label: "Ana Sayfa", href: "/dashboard/student" },
      { icon: Users, label: "Atölyeler", href: "/dashboard/student/workshops" },
      { icon: ClipboardList, label: "Görevler", href: "/dashboard/student/tasks" },
      { icon: MessageSquare, label: "Duyurular", href: "/dashboard/student/announcements" },
      { icon: CheckSquare, label: "Raporlar", href: "/dashboard/student/reports" },
      { icon: Calendar, label: "Takvim", href: "/dashboard/student/calendar" },
    ],
  } as const;

  const roleItems = (navItems as any)[role] || (navItems as any).student;

  return (
    <div className={cn("relative flex flex-col border-r bg-background h-screen", collapsed ? "w-16" : "w-64", className)}>
      <div className="flex h-16 items-center justify-between border-b px-4">
        <Link href={`/dashboard/${role}`} className={cn("flex items-center gap-2", collapsed && "justify-center")}>
          {collapsed ? <div className="h-8 w-8 bg-primary rounded-full" /> : (<><div className="h-8 w-8 bg-primary rounded-full" /><span className="text-lg font-semibold">DENEYAP</span></>)}
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="hidden md:flex">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex flex-col gap-1 p-2 flex-1">
        {roleItems.map(({ icon: Icon, label, href }: any, index: number) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Button
              key={index}
              variant={isActive ? "secondary" : "ghost"}
              asChild
              className={cn("justify-start", collapsed && "justify-center px-2")}
            >
              <Link href={href}>
                <Icon className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
                {!collapsed && <span>{label}</span>}
                {collapsed && <span className="sr-only">{label}</span>}
              </Link>
            </Button>
          );
        })}
      </div>

      <div className="border-t p-2">
        <Button
          variant="ghost"
          className={cn("justify-start w-full", collapsed && "justify-center px-2")}
          onClick={onLogout}
        >
          <LogOut className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
          {!collapsed && <span>Çıkış Yap</span>}
          {collapsed && <span className="sr-only">Çıkış Yap</span>}
        </Button>
      </div>
    </div>
  );
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const { toast } = useToast();
  const [me, setMe] = useState<{ role?: string; profile_picture?: string } | null>(null);

  const isLoginPage = pathname === "/login";

  useEffect(() => {
    if (isLoginPage) return;
    const access = typeof window !== "undefined" ? localStorage.getItem("access") : null;
    if (!access) return;

    fetchJson("/profile/")
      .then((data) => {
        setMe(data);
        if (data?.perms != null) setPerms(data.perms);
      })
      .catch(() => {
      });
  }, [pathname, isLoginPage]);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setPerms(null);
    toast({ title: "Çıkış yapıldı", description: "Başarıyla çıkış yaptınız." });
    window.location.href = "/";
  };

  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false} disableTransitionOnChange>
          {isLoginPage ? (
            <>{children}</>
          ) : (
            <div className="flex min-h-screen bg-gray-100">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-40">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                  <Sidebar className="border-r-0" onLogout={handleLogout} />
                </SheetContent>
              </Sheet>

              <Sidebar className="hidden md:flex" onLogout={handleLogout} />

              <div className="flex-1">
                <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
                  <div className="flex flex-1 items-center justify-end gap-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                          <Bell className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Bildirimler</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="grid gap-1 p-1">
                          <p className="text-xs text-muted-foreground text-center py-4">Bildirim bulunmuyor</p>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                          <Avatar className="h-8 w-8">
                            {me?.profile_picture ? (
                              <AvatarImage src={me.profile_picture} alt="Profil" />
                            ) : (
                              <AvatarFallback>{(me?.role?.[0] ?? "U").toUpperCase()}</AvatarFallback>
                            )}
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                          {(() => {
                            const t = roleToText(me?.role as RolePayload);
                            return t ? t.toUpperCase() : "—";
                          })()}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/profile">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profil</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/settings">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Ayarlar</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Çıkış Yap</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </header>
                <main className="flex-1 p-4 md:p-6">{children}</main>
              </div>
            </div>
          )}
          <HotToaster
            position="top-center"
            toastOptions={{
              style: {
                background: "hsl(var(--background))",
                color: "hsl(var(--foreground))",
                border: "1px solid hsl(var(--border))",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              },
              success: { iconTheme: { primary: "hsl(var(--primary))", secondary: "hsl(var(--primary-foreground))" } },
              error: { iconTheme: { primary: "hsl(var(--destructive))", secondary: "hsl(var(--destructive-foreground))" } },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}