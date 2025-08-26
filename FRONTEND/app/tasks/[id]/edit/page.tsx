"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, CalendarIcon, Save } from "lucide-react";

import custom_axios from "@/lib/customAxios";
import { ApiConstants } from "@/lib/ApiConstants";
import { getTask, updateTask, type Task } from "@/lib/tasks";
import { taskPerms } from "@/lib/permissions";

type Atelier = { id: number; name: string };
type Commission = { id: number; name: string };

type UiPriority = "high" | "medium" | "low";
type UiStatus = "todo" | "in_progress" | "done";

export default function EditTaskPage() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const taskId = Number(params?.id);
  const role = useMemo(() => {
    const parts = (pathname || "").split("/").filter(Boolean);
    return parts[1] || "admin";
  }, [pathname]);

  const canUpdate = taskPerms.canUpdate();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");

  const [atelierOpts, setAtelierOpts] = useState<Atelier[]>([]);
  const [commissionOpts, setCommissionOpts] = useState<Commission[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<UiPriority>("medium");

  const [status, setStatus] = useState<UiStatus>("in_progress");

  const [commission, setCommission] = useState<number | null>(null);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [assignmentType, setAssignmentType] = useState<"all" | "select">("all");
  const [selectedWorkshops, setSelectedWorkshops] = useState<number[]>([]);

  const normalizePriority = (p: any): UiPriority => {
    const s = String(p).toLowerCase();
    if (p === 3 || s === "3" || s === "high") return "high";
    if (p === 2 || s === "2" || s === "medium") return "medium";
    return "low";
  };

  const normalizeStatus = (s: any): UiStatus => {
    const v = String(s ?? "").toLowerCase();
    if (v === "done" || v === "completed" || v === "complete" || v === "3") return "done";
    if (v === "in_progress" || v === "doing" || v === "progress" || v === "2") return "in_progress";
    return "todo";
  };

  useEffect(() => {
    if (!Number.isFinite(taskId)) {
      setErr("Geçersiz görev ID");
      setLoading(false);
      return;
    }

    if (!canUpdate) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setErr("");
        setLoading(true);

        const [aRes, cRes, task] = await Promise.all([
          custom_axios.get<Atelier[]>(ApiConstants.ATELIERS.LIST),
          custom_axios.get<Commission[]>(ApiConstants.COMMISSIONS.LIST),
          getTask(taskId),
        ]);

        const ateliers = aRes.data || [];
        const commissions = cRes.data || [];

        setAtelierOpts(ateliers);
        setCommissionOpts(commissions);

        setTitle(task.title || "");
        setDescription(task.description || "");
        setPriority(normalizePriority(task.priority));
        setStatus(normalizeStatus(task.status));

        setCommission(
          typeof task.commission === "number" ? task.commission : ((task as any).commission ?? null)
        );
        setDueDate(task.due_date ? new Date(task.due_date) : undefined);

        const taskAteliers = Array.isArray(task.ateliers) ? task.ateliers : [];
        setSelectedWorkshops(taskAteliers);
        setAssignmentType(
          taskAteliers.length && ateliers.length && taskAteliers.length < ateliers.length
            ? "select"
            : "all"
        );
      } catch (e: any) {
        setErr(e?.message || "Görev yüklenemedi");
      } finally {
        setLoading(false);
      }
    })();
  }, [taskId, canUpdate]);

  const handleWorkshopToggle = (id: number) => {
    setSelectedWorkshops((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedWorkshops(atelierOpts.map((a) => a.id));
  const clearAll = () => setSelectedWorkshops([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canUpdate) {
      toast({ title: "Yetki yok", description: "Görev düzenleme izniniz bulunmuyor.", variant: "destructive" });
      return;
    }
    try {
      setErr("");

      const payload: Partial<Task> = {
        title,
        description,
        priority,    
        status,     
        commission,
        due_date: dueDate ? format(dueDate, "yyyy-MM-dd") : undefined,
        ateliers: assignmentType === "all" ? atelierOpts.map((a) => a.id) : selectedWorkshops,
      };

      await updateTask(taskId, payload);
      toast({ title: "Görev güncellendi", description: "Değişiklikler kaydedildi." });
      router.push(`/dashboard/${role}/tasks`);
    } catch (e: any) {
      setErr(e?.message || "Kaydedilemedi");
      toast({ title: "Hata", description: e?.message || "Kaydedilemedi", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="mt-2">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!canUpdate) {
    return (
      <div className="space-y-4">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href={`/dashboard/${role}/tasks`}><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Erişim Yok</h1>
        <p className="text-muted-foreground">Bu sayfayı düzenleme yetkiniz bulunmuyor.</p>
        <Button asChild><Link href={`/dashboard/${role}/tasks`}>Görevlere Dön</Link></Button>
      </div>
    );
  }

  if (err) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <h2 className="text-xl font-semibold mb-2">Görev yüklenemedi</h2>
        <p className="text-muted-foreground mb-4">{err}</p>
        <Button asChild><Link href={`/dashboard/${role}/tasks`}>Görevlere Dön</Link></Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href={`/dashboard/${role}/tasks`}><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Görev Düzenle</h1>
          <p className="text-muted-foreground">Görev bilgilerini güncelleyin</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Görev Bilgileri</CardTitle>
            <CardDescription>Görev içeriğini ve hedef atölyeleri düzenleyin</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-3">
              <Label htmlFor="title">Görev Başlığı</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="description">Görev Açıklaması</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[150px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="due-date">Son Tarih</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP", { locale: tr }) : <span>Tarih seçin</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dueDate} onSelect={(d) => setDueDate(d || undefined)} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="priority">Öncelik</Label>
                <Select value={priority} onValueChange={(v: UiPriority) => setPriority(v)}>
                  <SelectTrigger id="priority"><SelectValue placeholder="Öncelik seçin" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Yüksek</SelectItem>
                    <SelectItem value="medium">Orta</SelectItem>
                    <SelectItem value="low">Düşük</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="status">Durum</Label>
                <Select value={status} onValueChange={(v: UiStatus) => setStatus(v)}>
                  <SelectTrigger id="status"><SelectValue placeholder="Durum seçin" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">Beklemede</SelectItem>
                    <SelectItem value="in_progress">Devam ediyor</SelectItem>
                    <SelectItem value="done">Tamamlandı</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="commission">Komisyon</Label>
              <Select
                value={commission !== null ? String(commission) : undefined}
                onValueChange={(v) => setCommission(Number(v))}
              >
                <SelectTrigger id="commission"><SelectValue placeholder="Komisyon seçin" /></SelectTrigger>
                <SelectContent>
                  {commissionOpts.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3">
              <Label>Hedef Atölyeler</Label>
              <RadioGroup
                value={assignmentType}
                onValueChange={(v: "all" | "select") => setAssignmentType(v)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all-workshops" />
                  <Label htmlFor="all-workshops">Tüm Atölyeler</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="select" id="selected-workshops" />
                  <Label htmlFor="selected-workshops">Belirli Atölyeler</Label>
                </div>
              </RadioGroup>
            </div>

            {assignmentType === "select" && (
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label>Atölye Seçimi</Label>
                  <div className="space-x-2">
                    <Button type="button" variant="outline" size="sm" onClick={selectAll}>Tümünü Seç</Button>
                    <Button type="button" variant="outline" size="sm" onClick={clearAll}>Temizle</Button>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-4 max-h-[240px] overflow-y-auto">
                    <div className="space-y-3">
                      {atelierOpts.map((w) => (
                        <div key={w.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`workshop-${w.id}`}
                            checked={selectedWorkshops.includes(w.id)}
                            onCheckedChange={() => handleWorkshopToggle(w.id)}
                          />
                          <Label htmlFor={`workshop-${w.id}`} className="text-sm">{w.name}</Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="text-sm text-muted-foreground">
                  Seçili Atölye Sayısı: {selectedWorkshops.length} / {atelierOpts.length}
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href={`/dashboard/${role}/tasks`}>İptal</Link>
            </Button>
            <Button type="submit" disabled={!canUpdate}>
              <Save className="mr-2 h-4 w-4" />
              Değişiklikleri Kaydet
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}