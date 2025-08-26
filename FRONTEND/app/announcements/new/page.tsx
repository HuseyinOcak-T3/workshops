"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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

interface Workshop { id: number; name: string; }
interface Commission { id: number; name: string; }

export default function NewAnnouncementPage() {
    const { toast } = useToast();
    const router = useRouter();
    const { perms, loading: authLoading } = useAuth();

    const [workshops, setWorkshops] = useState<Workshop[]>([]);
    const [commissions, setCommissions] = useState<Commission[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        text: "",
        commission_id: null as number | null,
        atelier_ids: [] as number[],
    });

    useEffect(() => {
        if(authLoading) return;

        // YETKİ KONTROLÜ (GÜNCELLENDİ)
        if (!perms.announcements.can_create) {
            toast({ title: "Yetkisiz Erişim", description: "Bu sayfayı görüntüleme yetkiniz yok.", variant: "destructive" });
            router.push("/announcements");
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const [workshopsData, commissionsData] = await Promise.all([
                    fetchWithAuth<Workshop[]>("/ateliers/"),
                    fetchWithAuth<Commission[]>("/commissions/"),
                ]);
                setWorkshops(workshopsData);
                setCommissions(commissionsData);
            } catch (error: any) {
                toast({ title: "Hata", description: `Veriler yüklenemedi: ${error.message}`, variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [perms.announcements.can_create, router, toast, authLoading]);

    const handleWorkshopToggle = (workshopId: number) => {
        setFormData(prev => ({
            ...prev,
            atelier_ids: prev.atelier_ids.includes(workshopId)
                ? prev.atelier_ids.filter(id => id !== workshopId)
                : [...prev.atelier_ids, workshopId]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await fetchWithAuth('/announcements/', {
                method: 'POST',
                body: JSON.stringify(formData),
            });
            toast({ title: "Başarılı", description: "Duyuru başarıyla oluşturuldu." });
            router.push("/announcements");
        } catch (error: any) {
            toast({ title: "Hata", description: `Duyuru oluşturulamadı: ${error.message}`, variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    if (loading || authLoading) return <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center">
                <Button variant="ghost" size="icon" asChild className="mr-2"><Link href="/announcements"><ArrowLeft className="h-5 w-5" /></Link></Button>
                <h1 className="text-3xl font-bold tracking-tight">Yeni Duyuru Oluştur</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader><CardTitle>Duyuru Detayları</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-3"><Label htmlFor="title">Duyuru Başlığı</Label><Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required /></div>
                        <div className="grid gap-3"><Label htmlFor="text">Duyuru İçeriği</Label><Textarea id="text" value={formData.text} onChange={(e) => setFormData({ ...formData, text: e.target.value })} className="min-h-[200px]" required /></div>
                        <div className="grid gap-3"><Label htmlFor="commission">İlgili Komisyon</Label>
                            <Select onValueChange={(value) => setFormData({ ...formData, commission_id: parseInt(value) })}>
                                <SelectTrigger><SelectValue placeholder="Komisyon seçin (isteğe bağlı)" /></SelectTrigger>
                                <SelectContent>{commissions.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-3"><Label>Hedef Atölyeler (Boş bırakırsanız tüm atölyelere gider)</Label>
                            <Card><CardContent className="p-4 max-h-[200px] overflow-y-auto">
                                <div className="space-y-2">{workshops.map((w) => (
                                    <div key={w.id} className="flex items-center space-x-2">
                                        <Checkbox id={`w-${w.id}`} checked={formData.atelier_ids.includes(w.id)} onCheckedChange={() => handleWorkshopToggle(w.id)} />
                                        <Label htmlFor={`w-${w.id}`} className="font-normal">{w.name}</Label>
                                    </div>))}
                                </div>
                            </CardContent></Card>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" type="button" asChild><Link href="/announcements">İptal</Link></Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Oluştur
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
