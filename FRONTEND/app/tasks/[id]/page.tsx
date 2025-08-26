"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import { getTask, archiveTask, Task } from "@/lib/tasks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  FileEdit, CheckCircle, Clock, Download, FileText, BarChart3, RefreshCw
} from "lucide-react";

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const role = (() => {
    const parts = (pathname || "").split("/").filter(Boolean);
    return parts[1] || "admin";
  })();

  const taskId = Number(params?.id);

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");

  const fetchTask = useCallback(async () => {
    if (!Number.isFinite(taskId)) return;
    try {
      setErr("");
      setLoading(true);
      const data = await getTask(taskId);
      setTask(data);
    } catch (e: any) {
      setErr(e?.message || "Görev yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") fetchTask();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [fetchTask]);

  const handleArchive = async () => {
    try {
      await archiveTask(taskId);
      toast({ title: "Görev arşivlendi", description: "Görev başarıyla pasifleştirildi." });
      router.push(`/dashboard/${role}/tasks`);
    } catch (e: any) {
      toast({
        title: "Arşivleme başarısız",
        description: e?.message || "Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadReport = () => {
    toast({ title: "Rapor indiriliyor", description: "Görev raporu hazırlanıyor." });
    setTimeout(() => {
      toast({ title: "Rapor indirildi", description: "Rapor başarıyla indirildi." });
    }, 1200);
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

  if (err || !task) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <h2 className="text-xl font-semibold mb-2">Görev bulunamadı</h2>
        <p className="text-muted-foreground mb-4">{err || "İstediğiniz görev yok veya erişim izniniz yok."}</p>
        <Button asChild>
          <Link href={`/dashboard/${role}/tasks`}>Görevlere Dön</Link>
        </Button>
      </div>
    );
  }

  const status = String(task.status || "").toLowerCase();
  const statusLabel =
    status === "done" ? "Tamamlandı"
    : status === "in_progress" ? "Devam Ediyor"
    : status === "pending" ? "Beklemede"
    : "-";

  const completedBy =
    (task as any).completed_by_full_name ||
    (task as any).completed_by_name ||
    (task as any).completed_by ||
    null;

  const completedAt = (task as any).completed_at
    ? new Date((task as any).completed_at)
    : null;

  const createdDate = task.created_at ? new Date(task.created_at) : null;
  const dueDate = task.due_date ? new Date(task.due_date) : null;

  const pNum = typeof task.priority === "number" ? task.priority : undefined;
  const isHigh = pNum === 3;
  const isMed = pNum === 2;
  const priorityLabel = isHigh ? "Yüksek Öncelik" : isMed ? "Orta Öncelik" : "Düşük Öncelik";

  const isActive = task.active !== false;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Görev Detayı</h1>
          <p className="text-muted-foreground">Görev bilgileri ve tamamlanma durumu</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchTask}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Yenile
          </Button>

          <Button variant="outline" asChild>
            <Link href={`/dashboard/${role}/tasks/${taskId}/edit`}>
              <FileEdit className="mr-2 h-4 w-4" />
              Düzenle
            </Link>
          </Button>

          <Button variant="outline" onClick={handleArchive}>
            {isActive ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Arşivle
              </>
            ) : (
              <>
                <Clock className="mr-2 h-4 w-4" />
                Aktifleştir
              </>
            )}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {task.title}
                <Badge variant={isHigh ? "destructive" : isMed ? "default" : "outline"}>
                  {priorityLabel}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    status === "done"
                      ? "border-green-600 text-green-700"
                      : status === "in_progress"
                      ? "border-yellow-600 text-yellow-700"
                      : status === "pending"
                      ? "border-gray-500 text-gray-700"
                      : ""
                  }
                >
                  {statusLabel}
                </Badge>
              </CardTitle>
              <CardDescription>
                {(task.commission_name ?? "-")} • Oluşturulma: {createdDate ? createdDate.toLocaleDateString("tr-TR") : "-"}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm"><FileText className="h-4 w-4 mr-2" />Detaylar</Button>
              <Button variant="ghost" size="sm"><BarChart3 className="h-4 w-4 mr-2" />Analiz</Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Görev Açıklaması</h3>
            <p className="text-sm text-muted-foreground">{task.description || "-"}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Durum</h3>
              <div className="flex items-center">
                {status === "done" ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                    <span className="text-sm">Tamamlandı</span>
                  </>
                ) : status === "in_progress" ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Devam Ediyor</span>
                  </>
                ) : status === "pending" ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Beklemede</span>
                  </>
                ) : (
                  <span className="text-sm">-</span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Tamamlayan</h3>
              <div className="text-sm">{completedBy || "-"}</div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Tamamlanma</h3>
              <div className="text-sm">
                {completedAt ? completedAt.toLocaleString("tr-TR") : "-"}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Son Tarih</h3>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{dueDate ? dueDate.toLocaleDateString("tr-TR") : "-"}</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Komisyon</h3>
              <div className="text-sm">{task.commission_name ?? "-"}</div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/${role}/tasks/${taskId}/edit`}>
              <FileEdit className="mr-2 h-4 w-4" />
              Görevi Düzenle
            </Link>
          </Button>

          <Button onClick={handleDownloadReport}>
            <Download className="mr-2 h-4 w-4" />
            Rapor İndir
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}