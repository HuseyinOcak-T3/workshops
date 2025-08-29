"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { fetchWithAuth } from "@/lib/fetchWithAuth"
import { useAuth } from "@/app/context/AuthContext"
import { Search } from "lucide-react"

interface Workshop { id: number; name: string; }
interface Commission { id: number; name: string; }
interface AnnouncementData {
  title: string;
  text: string;
  commission: Commission | null;
  is_active: boolean;
  ateliers: Workshop[];
  priority: string;
}
interface FormData {
  title: string;
  text: string;
  commission_id: string | null;
  is_active: boolean;
  atelier_ids: number[];
  priority: string;
}

export default function EditAnnouncementPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { perms, loading: authLoading } = useAuth();
  const announcementId = params.id as string;

  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [workshopSearch, setWorkshopSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    text: "",
    commission_id: null,
    is_active: true,
    atelier_ids: [],
    priority: "medium",
  });

  useEffect(() => {
    if (authLoading) return;

    // YETKİ KONTROLÜ (GÜNCELLENDİ)
    if (!perms.announcements.can_update) {
        toast({ title: "Yetkisiz Erişim", description: "Bu içeriği düzenleme yetkiniz yok.", variant: "destructive" });
        router.push("/announcements");
        return;
    }

    if (!announcementId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [announcementData, workshopsData, commissionsData] = await Promise.all([
          fetchWithAuth<AnnouncementData>(`/announcements/${announcementId}/`),
          fetchWithAuth<Workshop[]>("/ateliers/"),
          fetchWithAuth<Commission[]>("/commissions/"),
        ]);

        setFormData({
          title: announcementData.title,
          text: announcementData.text,
          commission_id: announcementData.commission?.id.toString() || null,
          is_active: announcementData.is_active,
          atelier_ids: announcementData.ateliers.map((a: Workshop) => a.id),
          priority: announcementData.priority || "medium",
        });

        setWorkshops(workshopsData);
        setCommissions(commissionsData);
      } catch (error) {
        toast({ title: "Hata", description: "Veriler yüklenemedi.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [announcementId, toast, perms.announcements.can_update, authLoading, router]);

    const filteredWorkshops = workshops.filter(w =>
        w.name.toLowerCase().includes(workshopSearch.toLowerCase())
    );

  const handleWorkshopToggle = (workshopId: number) => {
    setFormData((prev) => ({
      ...prev,
      atelier_ids: prev.atelier_ids.includes(workshopId)
        ? prev.atelier_ids.filter((id) => id !== workshopId)
        : [...prev.atelier_ids, workshopId],
    }));
  };

    const handleSelectAllVisible = () => {
        const visibleIds = filteredWorkshops.map(w => w.id);
        setFormData(prev => ({
            ...prev,
            atelier_ids: [...new Set([...prev.atelier_ids, ...visibleIds])]
        }));
    };

    const handleClearAll = () => {
        setFormData(prev => ({ ...prev, atelier_ids: [] }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await fetchWithAuth(`/announcements/${announcementId}/`, {
        method: "PUT",
        body: JSON.stringify({
          ...formData,
          commission_id: formData.commission_id ? parseInt(formData.commission_id, 10) : null,
        }),
      });
      toast({ title: "Başarılı", description: "Duyuru başarıyla güncellendi." });
      router.push(`/announcements`);
    } catch (error: any) {
      toast({ title: "Hata", description: `Duyuru güncellenemedi: ${error.message}`, variant: "destructive" });
    } finally {
        setIsSaving(false);
    }
  };

  if (loading || authLoading) return <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="space-y-6">
       <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/announcements">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Duyuru Düzenle</h1>
          </div>
        </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Duyuru Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3">
              <Label htmlFor="title">Duyuru Başlığı</Label>
              <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="content">Duyuru İçeriği (HTML destekler)</Label>
              <Textarea id="content" value={formData.text} onChange={(e) => setFormData({ ...formData, text: e.target.value })} className="min-h-[150px]" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-3">
                <Label htmlFor="commission">Komisyon</Label>
                <Select value={formData.commission_id || ""} onValueChange={(value) => setFormData({ ...formData, commission_id: value })}>
                  <SelectTrigger id="commission"><SelectValue placeholder="Komisyon seçin" /></SelectTrigger>
                  <SelectContent>
                    {commissions.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3">
                  <Label htmlFor="priority">Öncelik</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                      <SelectTrigger id="priority">
                          <SelectValue placeholder="Öncelik seçin" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="low">Düşük</SelectItem>
                          <SelectItem value="medium">Orta</SelectItem>
                          <SelectItem value="high">Yüksek</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
            </div>
            <div className="grid gap-3">
                <Label>Atölye Seçimi</Label>
                <Card>
                    <div className="p-4 border-b space-y-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Atölye ara..."
                                value={workshopSearch}
                                onChange={(e) => setWorkshopSearch(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" size="sm" variant="secondary" onClick={handleSelectAllVisible}>
                                Görünenleri Seç
                            </Button>
                            <Button type="button" size="sm" variant="outline" onClick={handleClearAll}>
                                Tüm Seçimi Temizle
                            </Button>
                        </div>
                    </div>
                    <CardContent className="p-4 max-h-[200px] overflow-y-auto">
                        <div className="space-y-4">
                            {filteredWorkshops.map((workshop) => (
                                <div key={workshop.id} className="flex items-center space-x-2">
                                <Checkbox id={`workshop-${workshop.id}`} checked={formData.atelier_ids.includes(workshop.id)} onCheckedChange={() => handleWorkshopToggle(workshop.id)} />
                                <Label htmlFor={`workshop-${workshop.id}`} className="text-sm font-normal">{workshop.name}</Label>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href={`/announcements`}>İptal</Link>
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />}
              Değişiklikleri Kaydet
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
