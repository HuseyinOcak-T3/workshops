"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, PenSquare, Trash, Loader2, Eye, FileText, Archive, ArchiveRestore } from "lucide-react"
import Link from "next/link"
import { fetchWithAuth } from "@/lib/fetchWithAuth"
import { useAuth } from "@/app/context/AuthContext"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

export default function AnnouncementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user, perms } = useAuth();
  const announcementId = params.id as string;

  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showWorkshops, setShowWorkshops] = useState(false);
  const [workshopReadStatus, setWorkshopReadStatus] = useState<WorkshopReadStatus[]>([]);
  const [loadingStatus, setLoadingStatus] = useState(false);

  useEffect(() => {
    if (!announcementId) return;
    const fetchAnnouncement = async () => {
      setLoading(true);
      try {
        const data = await fetchWithAuth<Announcement>(`/announcements/${announcementId}/`);
        setAnnouncement(data);
        if (user?.role?.code === 'workshop_responsible') {
          try {
            await fetchWithAuth(`/announcements/${data.id}/mark_read/`, {
              method: 'POST',
            });
          } catch (readError) {
            console.error("Duyuru okundu olarak işaretlenemedi:", readError);
          }
        }
      } catch (error: any) {
        toast({ title: "Hata", description: `Duyuru yüklenemedi: ${error.message}`, variant: "destructive" });
        router.push("/announcements");
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncement();
  }, [announcementId, toast, router]);

  useEffect(() => {
    if (!announcement) return;

    const fetchReadStatus = async () => {
        setLoadingStatus(true);
        try {
            const statusData = await fetchWithAuth<WorkshopReadStatus[]>(`/announcements/${announcement.id}/read_status/`);
            setWorkshopReadStatus(statusData);
        } catch (error: any) {
            toast({ title: "Okunma durumu alınamadı", description: error.message, variant: "destructive" });
        } finally {
            setLoadingStatus(false);
        }
    };

    fetchReadStatus();
  }, [announcement, toast]);

  const handleDeactivateAnnouncement = async () => {
    if (!perms.announcements.can_archive || !announcement) return;
    try {
        await fetchWithAuth(`/announcements/${announcement.id}/`, {
            method: "PATCH",
            body: JSON.stringify({ is_active: false })
        });
        toast({ title: "Duyuru pasif hale getirildi" });
        router.push("/announcements");
    } catch (error: any) {
        toast({ title: "Hata", description: `İşlem yapılamadı: ${error.message}`, variant: "destructive" });
    }
  };

  const handleArchiveAnnouncement = async () => {
    if (!perms.announcements.can_archive || !announcement) return;
    try {
        const updated = await fetchWithAuth<Announcement>(`/announcements/${announcement.id}/`, {
            method: 'PATCH',
            body: JSON.stringify({ is_archived: !announcement.is_archived }),
        });
        setAnnouncement(updated);
        toast({ title: updated.is_archived ? "Duyuru arşivlendi" : "Duyuru arşivden çıkarıldı" });
    } catch (error: any) {
        toast({ title: "Hata", description: `Duyuru durumu güncellenemedi: ${error.message}`, variant: "destructive" });
    }
  };
  if (loading) return <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (!announcement) return <div className="p-4 text-center">Duyuru bulunamadı.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/announcements"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Duyuru Detayı</h1>
        </div>
        <div className="flex items-center gap-2">
            {perms.announcements.can_update && (
                <Button variant="outline" asChild><Link href={`/announcements/${announcementId}/edit`}><PenSquare className="mr-2 h-4 w-4" /> Düzenle</Link></Button>
            )}
            {perms.announcements.can_archive && (
                <>
                <Button variant="outline" onClick={() => setIsArchiveDialogOpen(true)}>
                    {announcement.is_archived ? <ArchiveRestore className="mr-2 h-4 w-4" /> : <Archive className="mr-2 h-4 w-4" />}
                    {announcement.is_archived ? "Arşivden Çıkar" : "Arşivle"}
                </Button>
                <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                    <Trash className="mr-2 h-4 w-4" /> Sil
                </Button>
                </>
            )}
        </div>
      </div>

      <Dialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Arşivleme Onayı</DialogTitle>
            <DialogDescription>
                "{announcement.title}" başlıklı duyuruyu {announcement.is_archived ? 'arşivden çıkarmak' : 'arşivlemek'} istediğinizden emin misiniz?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsArchiveDialogOpen(false)}>İptal</Button>
            <Button onClick={handleArchiveAnnouncement}>
              {announcement.is_archived ? 'Arşivden Çıkar' : 'Arşivle'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Silme Onayı</DialogTitle>
            <DialogDescription>
              "{announcement.title}" başlıklı duyuruyu silmek istediğinizden emin misiniz?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>İptal</Button>
            <Button variant="destructive" onClick={handleDeactivateAnnouncement}>
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{announcement.title}</CardTitle>
                <CardDescription>{announcement.commission?.name || "Genel"} • {new Date(announcement.publication_date).toLocaleDateString("tr-TR")}</CardDescription>
              </div>
              <Badge variant={announcement.is_active ? "default" : "secondary"}>{announcement.is_active ? "Aktif" : "Arşivlenmiş"}</Badge>
            </div>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: announcement.text }} />
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Duyuru İstatistikleri</CardTitle>
                <CardDescription>Okunma ve etkileşim verileri</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span>Okunma Durumu ({announcement.read_count} / {announcement.total_count})</span>
                        <span className="font-medium">
                        {announcement.total_count > 0 ? `${Math.round((announcement.read_count / announcement.total_count) * 100)}%` : 'N/A'}
                        </span>
                    </div>
                    <Progress value={announcement.total_count > 0 ? (announcement.read_count / announcement.total_count) * 100 : 0} className="h-2" />
                </div>
                <div>
                    <Button variant="outline" size="sm" onClick={() => setShowWorkshops(!showWorkshops)}>
                        <Eye className="mr-2 h-4 w-4" />
                        {showWorkshops ? "Detayları Gizle" : "Atölye Bazlı Durumu Gör"}
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
                                Okundu
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
      </div>
    </div>
  );
}
