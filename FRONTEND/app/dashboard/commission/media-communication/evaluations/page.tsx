"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  StarIcon,
  SearchIcon,
  MoreHorizontalIcon,
  EyeIcon,
  EditIcon,
  BarChart3Icon,
  TrendingUpIcon,
  TrendingDownIcon,
} from "lucide-react"

export default function EvaluationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedEvaluation, setSelectedEvaluation] = useState<any>(null)
  const [isEvaluationDialogOpen, setIsEvaluationDialogOpen] = useState(false)

  // Mock data for evaluations
  const evaluations = [
    {
      id: 1,
      workshopName: "İstanbul Kadıköy Atölyesi",
      contentWorkTitle: "Mayıs Ayı Proje Tanıtım Videosu",
      completedDate: "2024-05-12",
      evaluatedDate: "2024-05-13",
      status: "completed",
      overallScore: 4.2,
      criteria: {
        photoQuality: { score: 4, note: "Fotoğraf kalitesi oldukça iyi, aydınlatma başarılı" },
        videoQuality: { score: 5, note: "Video kalitesi mükemmel, ses kalitesi çok iyi" },
        communication: { score: 4, note: "İletişim becerileri iyi, zamanında teslim" },
        creativity: { score: 3, note: "Yaratıcılık orta seviyede, daha özgün fikirler geliştirilebilir" },
        technical: { score: 5, note: "Teknik beceriler çok iyi, montaj başarılı" },
      },
      evaluator: "Ahmet Yılmaz",
    },
    {
      id: 2,
      workshopName: "Ankara Çankaya Atölyesi",
      contentWorkTitle: "Bahar Dönemi Fotoğraf Çekimi",
      completedDate: "2024-05-10",
      evaluatedDate: "2024-05-11",
      status: "completed",
      overallScore: 3.8,
      criteria: {
        photoQuality: { score: 4, note: "Fotoğraf kompozisyonu iyi, renk dengesi başarılı" },
        videoQuality: { score: 0, note: "Bu çalışmada video bulunmuyor" },
        communication: { score: 5, note: "Mükemmel iletişim, hızlı geri dönüş" },
        creativity: { score: 4, note: "Yaratıcı açılar ve perspektifler kullanılmış" },
        technical: { score: 3, note: "Teknik beceriler geliştirilmeli, bazı fotoğraflar bulanık" },
      },
      evaluator: "Fatma Demir",
    },
    {
      id: 3,
      workshopName: "İzmir Bornova Atölyesi",
      contentWorkTitle: "Öğrenci Röportaj Serisi",
      completedDate: "2024-05-08",
      evaluatedDate: null,
      status: "pending",
      overallScore: 0,
      criteria: {},
      evaluator: null,
    },
    {
      id: 4,
      workshopName: "Bursa Nilüfer Atölyesi",
      contentWorkTitle: "Mayıs Ayı Proje Tanıtım Videosu",
      completedDate: "2024-05-09",
      evaluatedDate: "2024-05-10",
      status: "completed",
      overallScore: 4.6,
      criteria: {
        photoQuality: { score: 5, note: "Mükemmel fotoğraf kalitesi ve kompozisyon" },
        videoQuality: { score: 5, note: "Profesyonel seviyede video kalitesi" },
        communication: { score: 4, note: "İyi iletişim, küçük gecikmeler oldu" },
        creativity: { score: 5, note: "Çok yaratıcı ve özgün yaklaşım" },
        technical: { score: 4, note: "Teknik beceriler çok iyi, küçük iyileştirmeler yapılabilir" },
      },
      evaluator: "Mehmet Kaya",
    },
  ]

  const criteriaLabels = {
    photoQuality: "Fotoğraf Kalitesi",
    videoQuality: "Video Kalitesi",
    communication: "İletişim",
    creativity: "Yaratıcılık",
    technical: "Teknik Beceri",
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default">Değerlendirildi</Badge>
      case "pending":
        return <Badge variant="outline">Bekliyor</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return "text-green-600"
    if (score >= 3.5) return "text-yellow-600"
    if (score >= 2.5) return "text-orange-600"
    return "text-red-600"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 4) return <TrendingUpIcon className="h-4 w-4 text-green-500" />
    if (score >= 3) return <BarChart3Icon className="h-4 w-4 text-yellow-500" />
    return <TrendingDownIcon className="h-4 w-4 text-red-500" />
  }

  const filteredEvaluations = evaluations.filter((evaluation) => {
    const matchesSearch =
      evaluation.workshopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evaluation.contentWorkTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || evaluation.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleStartEvaluation = (evaluation: any) => {
    setSelectedEvaluation(evaluation)
    setIsEvaluationDialogOpen(true)
  }

  const EvaluationDialog = () => {
    const [evaluationData, setEvaluationData] = useState({
      photoQuality: { score: 0, note: "" },
      videoQuality: { score: 0, note: "" },
      communication: { score: 0, note: "" },
      creativity: { score: 0, note: "" },
      technical: { score: 0, note: "" },
    })

    const handleSaveEvaluation = () => {
      // API call would be made here
      console.log("Evaluation data:", evaluationData)
      setIsEvaluationDialogOpen(false)
      setSelectedEvaluation(null)
    }

    return (
      <Dialog open={isEvaluationDialogOpen} onOpenChange={setIsEvaluationDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Atölye Değerlendirmesi</DialogTitle>
            <DialogDescription>
              {selectedEvaluation?.workshopName} - {selectedEvaluation?.contentWorkTitle}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {Object.entries(criteriaLabels).map(([key, label]) => (
              <div key={key} className="space-y-3">
                <Label className="text-base font-medium">{label}</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`${key}-score`}>Puan (1-5)</Label>
                    <Select
                      value={evaluationData[key as keyof typeof evaluationData].score.toString()}
                      onValueChange={(value) =>
                        setEvaluationData((prev) => ({
                          ...prev,
                          [key]: { ...prev[key as keyof typeof prev], score: Number.parseInt(value) },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Puan seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Çok Kötü</SelectItem>
                        <SelectItem value="2">2 - Kötü</SelectItem>
                        <SelectItem value="3">3 - Orta</SelectItem>
                        <SelectItem value="4">4 - İyi</SelectItem>
                        <SelectItem value="5">5 - Mükemmel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${key}-note`}>Detaylı Not</Label>
                    <Textarea
                      id={`${key}-note`}
                      placeholder="Değerlendirme notları..."
                      value={evaluationData[key as keyof typeof evaluationData].note}
                      onChange={(e) =>
                        setEvaluationData((prev) => ({
                          ...prev,
                          [key]: { ...prev[key as keyof typeof prev], note: e.target.value },
                        }))
                      }
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsEvaluationDialogOpen(false)}>
                İptal
              </Button>
              <Button onClick={handleSaveEvaluation}>Değerlendirmeyi Kaydet</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Atölye Değerlendirmeleri</h2>
          <p className="text-muted-foreground">
            Tamamlanan içerik çalışmalarının değerlendirmelerini yapın ve takip edin
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Değerlendirme</CardTitle>
            <StarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{evaluations.length}</div>
            <p className="text-xs text-muted-foreground">
              {evaluations.filter((e) => e.status === "completed").length} tamamlandı
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bekleyen Değerlendirme</CardTitle>
            <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{evaluations.filter((e) => e.status === "pending").length}</div>
            <p className="text-xs text-muted-foreground">Değerlendirme bekliyor</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ortalama Puan</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                evaluations.filter((e) => e.overallScore > 0).reduce((sum, e) => sum + e.overallScore, 0) /
                evaluations.filter((e) => e.overallScore > 0).length
              ).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">5 üzerinden</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Yüksek Puan</CardTitle>
            <StarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.max(...evaluations.map((e) => e.overallScore))}</div>
            <p className="text-xs text-muted-foreground">Bursa Nilüfer Atölyesi</p>
          </CardContent>
        </Card>
      </div>

      {/* Evaluations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Değerlendirme Listesi</CardTitle>
          <CardDescription>
            Tamamlanan içerik çalışmalarının değerlendirmelerini görüntüleyin ve yönetin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Atölye veya içerik ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Durum: {filterStatus === "all" ? "Tümü" : filterStatus}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterStatus("all")}>Tümü</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("completed")}>Değerlendirildi</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("pending")}>Bekliyor</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Atölye</TableHead>
                  <TableHead>İçerik Çalışması</TableHead>
                  <TableHead>Tamamlanma Tarihi</TableHead>
                  <TableHead>Genel Puan</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Değerlendiren</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvaluations.map((evaluation) => (
                  <TableRow key={evaluation.id}>
                    <TableCell>
                      <div className="font-medium">{evaluation.workshopName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{evaluation.contentWorkTitle}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{evaluation.completedDate}</div>
                    </TableCell>
                    <TableCell>
                      {evaluation.overallScore > 0 ? (
                        <div className="flex items-center gap-2">
                          {getScoreIcon(evaluation.overallScore)}
                          <span className={`font-medium ${getScoreColor(evaluation.overallScore)}`}>
                            {evaluation.overallScore}/5
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(evaluation.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">{evaluation.evaluator || "Henüz değerlendirilmedi"}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Menüyü aç</span>
                            <MoreHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                          {evaluation.status === "pending" ? (
                            <DropdownMenuItem onClick={() => handleStartEvaluation(evaluation)}>
                              <StarIcon className="mr-2 h-4 w-4" />
                              Değerlendir
                            </DropdownMenuItem>
                          ) : (
                            <>
                              <DropdownMenuItem>
                                <EyeIcon className="mr-2 h-4 w-4" />
                                Görüntüle
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStartEvaluation(evaluation)}>
                                <EditIcon className="mr-2 h-4 w-4" />
                                Düzenle
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredEvaluations.length === 0 && (
            <div className="text-center py-8">
              <StarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Değerlendirme bulunamadı</h3>
              <p className="text-muted-foreground mb-4">Arama kriterlerinize uygun değerlendirme bulunamadı.</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setFilterStatus("all")
                }}
              >
                Filtreleri Temizle
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <EvaluationDialog />
    </div>
  )
}
