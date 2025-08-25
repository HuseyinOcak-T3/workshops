"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, Pencil, CheckCircle2, Loader2 } from "lucide-react";

import { getTasks, completeTask, Task } from "@/lib/tasks";
import { taskPerms } from "@/lib/permissions";

export default function TasksPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const role = useMemo(() => {
    const parts = (pathname || "").split("/").filter(Boolean);
    return parts[1] || "admin";
  }, [pathname]);

  const [permsTick, setPermsTick] = useState(0);
  useEffect(() => {
    const onStorage = (e: StorageEvent) => { if (e.key === "perms") setPermsTick(x => x + 1); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const canView   = useMemo(() => taskPerms.canView(),   [permsTick]);
  const canCreate = useMemo(() => taskPerms.canCreate(), [permsTick]);
  const canUpdate = useMemo(() => taskPerms.canUpdate(), [permsTick]);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const status = searchParams.get("status") || undefined;
  const commission = searchParams.get("commission") || undefined;

  async function refresh() {
    if (!canView) return;
    try {
      setErr("");
      setLoading(true);
      const data = await getTasks({
        ...(status ? { status } : {}),
        ...(commission ? { commission } : {}),
      });
      setTasks(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setErr(e?.message || "Liste yüklenemedi");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, [status, commission, canView]);

  const rows = useMemo(() => tasks ?? [], [tasks]);

  const handleMarkDone = async (id: number) => {
    try {
      setUpdatingId(id);
      const updated = await completeTask(id);
      setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updated } : t)));
      toast.success("Görev tamamlandı olarak işaretlendi.");
    } catch (e: any) {
      const msg = e?.response?.data?.detail || e?.message || "Durum güncellenemedi.";
      toast.error(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!canView) {
    return (
      <main className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Görevler</h1>
        <div className="rounded-md border p-4 bg-orange-50 text-orange-900">
          Bu sayfayı görüntüleme izniniz yok.
        </div>
      </main>
    );
  }

  const fmtDate = (d?: string) =>
    d ? new Date(d).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }) : "-";

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Görevler</h1>

        {canCreate ? (
          <Button onClick={() => router.push(`/dashboard/${role}/tasks/new`)}>Yeni Görev</Button>
        ) : (
          <Button variant="outline" onClick={() => toast.error("Yeni görev oluşturma izniniz yok.")}>
            Yeni Görev
          </Button>
        )}
      </div>

      {err && <div className="text-red-600 text-sm">{err}</div>}
      {loading && <div>Yükleniyor…</div>}

      {!loading && (
        <TooltipProvider delayDuration={200}>
          <div className="overflow-x-auto border rounded">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-3 font-medium">Başlık</th>
                  <th className="p-3 font-medium">Komisyon</th>
                  <th className="p-3 font-medium">Durum</th>
                  <th className="p-3 font-medium">Tamamlayan</th>
                  <th className="p-3 font-medium">Tamamlanma</th>
                  <th className="p-3 font-medium">Oluşturan</th>
                  <th className="p-3 font-medium">Oluşturulma</th>
                  <th className="p-3 font-medium text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((t) => {
                  const isDone = (t.status || "").toLowerCase() === "done";
                  const isBusy = updatingId === t.id;

                  const completedBy =
                    (t as any).completed_by_full_name ||
                    (t as any).completed_by_name ||
                    (t as any).completed_by ||
                    "-";

                  return (
                    <tr key={t.id} className="border-t">
                      <td className="p-3">{t.title}</td>
                      <td className="p-3">{t.commission_name ?? t.commission ?? "-"}</td>
                      <td className="p-3">{t.status ?? "-"}</td>
                      <td className="p-3">{completedBy}</td>
                      <td className="p-3">{fmtDate((t as any).completed_at)}</td>
                      <td className="p-3">{t.created_by_full_name ?? "-"}</td>
                      <td className="p-3">{fmtDate(t.created_at)}</td>

                      <td className="p-3">
                        <div className="flex gap-1 justify-end">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link href={`/dashboard/${role}/tasks/${t.id}`}>
                                <Button variant="ghost" size="icon" aria-label="Görüntüle" className="h-8 w-8">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>Görüntüle</TooltipContent>
                          </Tooltip>

                          {canUpdate ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link href={`/dashboard/${role}/tasks/${t.id}/edit`}>
                                  <Button variant="ghost" size="icon" aria-label="Düzenle" className="h-8 w-8">
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent>Düzenle</TooltipContent>
                            </Tooltip>
                          ) : (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  aria-label="Düzenleme izniniz yok"
                                  className="h-8 w-8 opacity-60"
                                  onClick={() => toast.error("Düzenleme izniniz yok.")}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>İzniniz yok</TooltipContent>
                            </Tooltip>
                          )}

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  aria-label={isDone ? "Tamamlandı" : "Tamamlandı olarak işaretle"}
                                  disabled={isDone || isBusy}
                                  onClick={() => handleMarkDone(t.id)}
                                >
                                  {isBusy ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <CheckCircle2 className={`h-4 w-4 ${isDone ? "text-green-600" : ""}`} />
                                  )}
                                </Button>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              {isDone ? "Tamamlandı" : "Tamamlandı olarak işaretle"}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {rows.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-muted-foreground">
                      Görev yok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TooltipProvider>
      )}
    </main>
  );
}