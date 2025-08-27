"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { MessageSquare, PenSquare, Plus, Search, Trash, Loader2, AlertCircle, Eye, FileText, Archive, ArchiveRestore } from "lucide-react"
import Link from "next/link"
import { fetchWithAuth } from "@/lib/fetchWithAuth"
import { useAuth } from "@/app/context/AuthContext"
import { Progress } from "@/components/ui/progress"

// Tipler
interface Commission { id: number; name: string; }
interface Atelier { id: number; name: string; }
interface Announcement {
  id: number;
  title: string;
  text: string;
  publication_date: string;
  commission: Commission | null;
  is_active: boolean;
  is_archived: boolean;
  ateliers: Atelier[];
  priority: 'high' | 'medium' | 'low';
  read_count: number;
  total_count: number;
}

interface WorkshopReadStatus {
  id: number;
  name: string;
  region: string;
  read: boolean;
  read_date: string | null;
}

export default function AnnouncementsPage() {
  const { toast } = useToast();
  const { user, perms, loading: authLoading } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCommission, setSelectedCommission] = useState("all");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWorkshops, setShowWorkshops] = useState(false);
  const [workshopReadStatus, setWorkshopReadStatus] = useState<WorkshopReadStatus[]>([]);
  const [loadingStatus, setLoadingStatus] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!perms.announcements.can_view) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [announcementsData, commissionsData] = await Promise.all([
          fetchWithAuth<Announcement[]>("/announcements/"),
          fetchWithAuth<Commission[]>("/commissions/"),
        ]);

        setAnnouncements(announcementsData);
        setCommissions(commissionsData);
        const firstActive = announcementsData.find((a) => a.is_active);
        if (firstActive) {
          setSelectedAnnouncement(firstActive);
        }
      } catch (error: any) {
        toast({ title: "Veri Yüklenemedi", description: error.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast, perms.announcements.can_view, authLoading]);

  useEffect(() => {
    if (selectedAnnouncement && user?.role?.code === 'workshop_responsible') {
      const markAsRead = async () => {
        try {
          await fetchWithAuth(`/announcements/${selectedAnnouncement.id}/mark_read/`, {
            method: 'POST',
          });
        } catch (error) {
          console.error("Duyuru okundu olarak işaretlenemedi:", error);
        }
      };
      markAsRead();
    }
  }, [selectedAnnouncement, user]);

  useEffect(() => {
    if (!selectedAnnouncement) {
        setWorkshopReadStatus([]);
        return;
    };

    const fetchReadStatus = async () => {
        setLoadingStatus(true);
        try {
            const statusData = await fetchWithAuth<WorkshopReadStatus[]>(`/announcements/${selectedAnnouncement.id}/read_status/`);
            setWorkshopReadStatus(statusData);
        } catch (error: any) {
            toast({ title: "Okunma durumu alınamadı", description: error.message, variant: "destructive" });
        } finally {
            setLoadingStatus(false);
        }
    };

    fetchReadStatus();
  }, [selectedAnnouncement, toast]);

  const handleSelectAnnouncement = (ann: Announcement) => {
      setSelectedAnnouncement(ann);
      setShowWorkshops(false);
  }

  const handleDeactivateAnnouncement = async (id: number) => {
    if (!perms.announcements.can_archive) return;

    try {
        await fetchWithAuth(`/announcements/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify({ is_active: false }),
        });

        setAnnouncements(prev => prev.filter(ann => ann.id !== id));
        if (selectedAnnouncement?.id === id) {
            setSelectedAnnouncement(null);
        }
        toast({ title: "Başarılı", description: "Duyuru pasif hale getirildi." });
    } catch (error: any) {
        toast({ title: "Hata", description: `İşlem yapılamadı: ${error.message}`, variant: "destructive" });
    }
  };

  const handleArchiveAnnouncement = async (id: number) => {
    if (!perms.announcements.can_archive) return;
    const ann = announcements.find(a => a.id === id);
    if (!ann) return;

    try {
        const updatedData = await fetchWithAuth<Announcement>(`/announcements/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify({ is_archived: !ann.is_archived }),
        });

        setAnnouncements(prev => prev.map(a => a.id === id ? updatedData : a));

        if (selectedAnnouncement?.id === id) {
            setSelectedAnnouncement(updatedData);
        }
        toast({ title: "Başarılı", description: updatedData.is_archived ? "Duyuru arşivlendi." : "Duyuru arşivden çıkarıldı." });
    } catch (error: any) {
        toast({ title: "Hata", description: `İşlem yapılamadı: ${error.message}`, variant: "destructive" });
    }
  };
  const filteredAnnouncements = announcements.filter((ann) => {
    const matchesSearch = ann.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCommission = selectedCommission === "all" || ann.commission?.id.toString() === selectedCommission;
    return matchesSearch && matchesCommission;
  });

  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => { // GÜNCELLENDİ
      switch (priority) {
          case "high":
              return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Yüksek Öncelik</Badge>;
          case "medium":
              return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Orta Öncelik</Badge>;
          case "low":
              return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Düşük Öncelik</Badge>;
          default:
              return <Badge variant="outline">Belirtilmemiş</Badge>;
      }
  };

  const getPriorityClass = (priority: 'high' | 'medium' | 'low') => { // YENİ FONKSİYON
      switch (priority) {
          case "high": return "bg-red-500";
          case "medium": return "bg-yellow-500";
          case "low": return "bg-green-500";
          default: return "bg-gray-400";
      }
  };

  const activeAnnouncements = filteredAnnouncements.filter((a) => a.is_active && !a.is_archived);
  const archivedAnnouncements = filteredAnnouncements.filter((a) => a.is_archived);
  if (loading || authLoading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!perms.announcements.can_view) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><AlertCircle className="text-destructive" /> Yetkisiz Erişim</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Bu sayfayı görüntüleme yetkiniz bulunmamaktadır.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Duyurular</h1>
          <p className="text-muted-foreground">Tüm komisyon duyurularını görüntüleyin ve yönetin</p>
        </div>
        {perms.announcements.can_create && (
          <Button asChild>
            <Link href="/announcements/new">
              <Plus className="mr-2 h-4 w-4" /> Yeni Duyuru
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Duyuru Listesi</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="px-4 pb-2 space-y-2">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Duyurularda ara..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <Select value={selectedCommission} onValueChange={setSelectedCommission}>
                    <SelectTrigger><SelectValue placeholder="Komisyon seçin" /></SelectTrigger>
                    <SelectContent>
                    <SelectItem value="all">Tüm Komisyonlar</SelectItem>
                    {commissions.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <Tabs defaultValue="active" className="mt-2">
              <div className="px-4"><TabsList className="grid w-full grid-cols-2"><TabsTrigger value="active">Aktif</TabsTrigger><TabsTrigger value="archived">Arşiv</TabsTrigger></TabsList></div>
              <TabsContent value="active" className="mt-0">
                <div className="divide-y max-h-[calc(100vh-350px)] overflow-y-auto">
                  {activeAnnouncements.length > 0 ? activeAnnouncements.map((ann) => (
                    <div key={ann.id} className={`p-4 cursor-pointer hover:bg-muted/50 ${selectedAnnouncement?.id === ann.id ? "bg-muted" : ""}`} onClick={() => handleSelectAnnouncement(ann)}>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full flex-shrink-0 ${getPriorityClass(ann.priority)}`}></div>
                          <span className="font-medium">{ann.title}</span>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(ann.publication_date).toLocaleDateString("tr-TR")}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 pl-4">{ann.commission?.name || "Genel"}</div>
                    </div>
                  )) : <p className="p-4 text-center text-sm text-muted-foreground">Aktif duyuru yok.</p>}
                </div>
              </TabsContent>
              <TabsContent value="archived" className="mt-0">
                 <div className="divide-y max-h-[calc(100vh-350px)] overflow-y-auto">
                  {archivedAnnouncements.length > 0 ? archivedAnnouncements.map((ann) => (
                    <div key={ann.id} className={`p-4 cursor-pointer hover:bg-muted/50 ${selectedAnnouncement?.id === ann.id ? "bg-muted" : ""}`} onClick={() => handleSelectAnnouncement(ann)}>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full flex-shrink-0 ${getPriorityClass(ann.priority)}`}></div>
                            <span className="font-medium">{ann.title}</span>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(ann.publication_date).toLocaleDateString("tr-TR")}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 pl-4">{ann.commission?.name || "Genel"}</div>
                    </div>
                  )) : <p className="p-4 text-center text-sm text-muted-foreground">Arşivlenmiş duyuru yok.</p>}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          {selectedAnnouncement ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle>{selectedAnnouncement.title}</CardTitle>
                        <div className="flex items-center gap-2">
                            {getPriorityBadge(selectedAnnouncement.priority)}
                            <Badge variant={selectedAnnouncement.is_archived ? "secondary" : "default"}>{selectedAnnouncement.is_archived ? "Arşivlenmiş" : "Aktif"}</Badge>
                        </div>
                    </div>
                    <CardDescription className="flex justify-between w-full">
                        <span>{selectedAnnouncement.commission?.name || "Genel"}</span>
                        <span>{new Date(selectedAnnouncement.publication_date).toLocaleDateString("tr-TR")}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: selectedAnnouncement.text }} />
                 <CardFooter className="flex justify-between">
                    <div className="flex gap-2">
                        {perms.announcements.can_archive && (
                            <>
                            <Button variant="destructive" size="sm" onClick={() => handleDeactivateAnnouncement(selectedAnnouncement.id)}><Trash className="mr-2 h-4 w-4" /> Sil</Button>
                            <Button variant="outline" size="sm" onClick={() => handleArchiveAnnouncement(selectedAnnouncement.id)}>
                                {selectedAnnouncement.is_archived ? <ArchiveRestore className="mr-2 h-4 w-4" /> : <Archive className="mr-2 h-4 w-4" />}
                                {selectedAnnouncement.is_archived ? "Arşivden Çıkar" : "Arşivle"}
                            </Button>
                            </>
                        )}
                    </div>
                    {perms.announcements.can_update && (
                    <Button asChild size="sm">
                        <Link href={`/announcements/${selectedAnnouncement.id}/edit`}><PenSquare className="mr-2 h-4 w-4" /> Düzenle</Link>
                    </Button>
                    )}
                </CardFooter>
              </Card>

                {perms.announcements.can_view_stats && (
                  <Card>
                    <CardHeader>
                        <CardTitle>Duyuru İstatistikleri</CardTitle>
                        <CardDescription>Okunma ve etkileşim verileri</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span>Okunma Durumu ({selectedAnnouncement.read_count} / {selectedAnnouncement.total_count})</span>
                                <span className="font-medium">
                                {selectedAnnouncement.total_count > 0 ? `${Math.round((selectedAnnouncement.read_count / selectedAnnouncement.total_count) * 100)}%` : 'N/A'}
                                </span>
                            </div>
                            <Progress value={selectedAnnouncement.total_count > 0 ? (selectedAnnouncement.read_count / selectedAnnouncement.total_count) * 100 : 0} className="h-2" />
                        </div>
                        <div>
                            <Button variant="outline" size="sm" onClick={() => setShowWorkshops(!showWorkshops)}>
                                <Eye className="mr-2 h-4 w-4" />
                                {showWorkshops ? "Atölye Detaylarını Gizle" : "Atölye Bazlı Durumu Görüntüle"}
                            </Button>
                        </div>
                        {showWorkshops && (
                        <div className="border rounded-lg p-4 mt-2 max-h-60 overflow-y-auto">
                            <h4 className="font-medium mb-3">Atölye Bazlı Okunma Durumu</h4>
                            {loadingStatus ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> :
                            <div className="space-y-4">
                            {workshopReadStatus.map((workshop) => (
                                <div key={workshop.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`h-2 w-2 rounded-full ${workshop.read ? "bg-green-500" : "bg-red-500"}`}></div>
                                    <span className="text-sm">{workshop.name}</span>
                                </div>
                                <div className="text-sm">
                                    {workshop.read ? (
                                    <span className="text-green-600">
                                        Okundu: {new Date(workshop.read_date!).toLocaleDateString("tr-TR")}
                                    </span>
                                    ) : (
                                    <span className="text-red-600">Okunmadı</span>
                                    )}
                                </div>
                                </div>
                            ))}
                            </div>
                            }
                        </div>
                        )}
                    </CardContent>
                     <CardFooter>
                        <Button variant="outline" className="w-full">
                            <FileText className="mr-2 h-4 w-4" />
                            Detaylı Rapor İndir
                        </Button>
                    </CardFooter>
                  </Card>
                )}
            </>
          ) : (
            <Card className="flex flex-col items-center justify-center h-full min-h-[60vh] p-6 text-center">
              <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Duyuru Seçilmedi</h3>
              <p className="text-sm text-muted-foreground">Detayları görmek için soldan bir duyuru seçin.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
