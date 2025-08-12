"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { Search, Plus, Users, Trophy, Pencil, Trash, UserPlus } from "lucide-react"

// Sample teams data
const teamsData = [
  {
    id: 1,
    name: "Robotik Takımı",
    description: "TEKNOFEST 2025 Robotik Yarışması için hazırlanan takım",
    members: [
      { id: 1, name: "Ahmet Yılmaz", role: "Takım Lideri", grade: "10. Sınıf" },
      { id: 2, name: "Ayşe Demir", role: "Yazılım", grade: "9. Sınıf" },
      { id: 3, name: "Mehmet Kaya", role: "Elektronik", grade: "11. Sınıf" },
      { id: 4, name: "Zeynep Çelik", role: "Mekanik", grade: "10. Sınıf" },
    ],
    type: "competition",
    competition: "TEKNOFEST 2025 - Robotik",
    status: "active",
  },
  {
    id: 2,
    name: "Yapay Zeka Takımı",
    description: "Yapay zeka projeleri geliştiren takım",
    members: [
      { id: 5, name: "Mustafa Şahin", role: "Takım Lideri", grade: "9. Sınıf" },
      { id: 6, name: "Elif Yıldız", role: "Veri Bilimci", grade: "11. Sınıf" },
      { id: 7, name: "Ali Öztürk", role: "Yazılım", grade: "10. Sınıf" },
    ],
    type: "project",
    project: "Görüntü İşleme Projesi",
    status: "active",
  },
  {
    id: 3,
    name: "Drone Takımı",
    description: "Drone tasarımı ve yazılımı geliştiren takım",
    members: [
      { id: 8, name: "Selin Aydın", role: "Takım Lideri", grade: "9. Sınıf" },
      { id: 9, name: "Burak Yılmaz", role: "Elektronik", grade: "10. Sınıf" },
      { id: 10, name: "Deniz Kara", role: "Yazılım", grade: "11. Sınıf" },
      { id: 11, name: "Ece Demir", role: "Mekanik", grade: "9. Sınıf" },
    ],
    type: "competition",
    competition: "TEKNOFEST 2025 - İnsansız Hava Araçları",
    status: "active",
  },
]

// Sample scholars data (for adding to teams)
const scholarsData = [
  { id: 12, name: "Emre Yıldız", grade: "10. Sınıf" },
  { id: 13, name: "Ceren Kaya", grade: "9. Sınıf" },
  { id: 14, name: "Berk Demir", grade: "11. Sınıf" },
  { id: 15, name: "Gizem Öztürk", grade: "10. Sınıf" },
  { id: 16, name: "Kaan Arslan", grade: "9. Sınıf" },
  { id: 17, name: "Melis Şahin", grade: "11. Sınıf" },
]

export default function TeamsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [teams, setTeams] = useState(teamsData)
  const [selectedTeam, setSelectedTeam] = useState<(typeof teamsData)[0] | null>(null)
  const [newTeamData, setNewTeamData] = useState({
    name: "",
    description: "",
    type: "project",
    competition: "",
    project: "",
  })
  const [newMemberData, setNewMemberData] = useState({
    scholarId: "",
    role: "",
  })

  const handleCreateTeam = () => {
    const newTeam = {
      id: teams.length + 1,
      name: newTeamData.name,
      description: newTeamData.description,
      members: [],
      type: newTeamData.type as "competition" | "project",
      competition: newTeamData.type === "competition" ? newTeamData.competition : "",
      project: newTeamData.type === "project" ? newTeamData.project : "",
      status: "active" as const,
    }

    setTeams([...teams, newTeam])

    toast({
      title: "Takım oluşturuldu",
      description: "Yeni takım başarıyla oluşturuldu.",
    })

    // Reset form
    setNewTeamData({
      name: "",
      description: "",
      type: "project",
      competition: "",
      project: "",
    })
  }

  const handleAddMember = () => {
    if (!selectedTeam || !newMemberData.scholarId || !newMemberData.role) return

    const scholar = scholarsData.find((s) => s.id.toString() === newMemberData.scholarId)
    if (!scholar) return

    const updatedTeams = teams.map((team) => {
      if (team.id === selectedTeam.id) {
        return {
          ...team,
          members: [
            ...team.members,
            {
              id: scholar.id,
              name: scholar.name,
              role: newMemberData.role,
              grade: scholar.grade,
            },
          ],
        }
      }
      return team
    })

    setTeams(updatedTeams)

    // Update selected team
    const updatedTeam = updatedTeams.find((t) => t.id === selectedTeam.id) || null
    setSelectedTeam(updatedTeam)

    toast({
      title: "Üye eklendi",
      description: `${scholar.name} takıma eklendi.`,
    })

    // Reset form
    setNewMemberData({
      scholarId: "",
      role: "",
    })
  }

  const handleRemoveMember = (memberId: number) => {
    if (!selectedTeam) return

    const updatedTeams = teams.map((team) => {
      if (team.id === selectedTeam.id) {
        return {
          ...team,
          members: team.members.filter((member) => member.id !== memberId),
        }
      }
      return team
    })

    setTeams(updatedTeams)

    // Update selected team
    const updatedTeam = updatedTeams.find((t) => t.id === selectedTeam.id) || null
    setSelectedTeam(updatedTeam)

    toast({
      title: "Üye çıkarıldı",
      description: "Üye takımdan çıkarıldı.",
    })
  }

  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const competitionTeams = filteredTeams.filter((team) => team.type === "competition")
  const projectTeams = filteredTeams.filter((team) => team.type === "project")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Takımlar</h1>
          <p className="text-muted-foreground">Bursiyer takımlarını yönetin</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Takım
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Takım Oluştur</DialogTitle>
              <DialogDescription>
                Yeni bir bursiyer takımı oluşturmak için aşağıdaki bilgileri doldurun.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="team-name">Takım Adı</Label>
                <Input
                  id="team-name"
                  placeholder="Takım adını girin"
                  value={newTeamData.name}
                  onChange={(e) => setNewTeamData({ ...newTeamData, name: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="team-description">Takım Açıklaması</Label>
                <Textarea
                  id="team-description"
                  placeholder="Takım açıklamasını girin"
                  value={newTeamData.description}
                  onChange={(e) => setNewTeamData({ ...newTeamData, description: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="team-type">Takım Türü</Label>
                <Select
                  value={newTeamData.type}
                  onValueChange={(value) => setNewTeamData({ ...newTeamData, type: value })}
                >
                  <SelectTrigger id="team-type">
                    <SelectValue placeholder="Takım türünü seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="competition">Yarışma Takımı</SelectItem>
                    <SelectItem value="project">Proje Takımı</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newTeamData.type === "competition" && (
                <div className="grid gap-2">
                  <Label htmlFor="competition">Yarışma</Label>
                  <Input
                    id="competition"
                    placeholder="Yarışma adını girin"
                    value={newTeamData.competition}
                    onChange={(e) => setNewTeamData({ ...newTeamData, competition: e.target.value })}
                  />
                </div>
              )}

              {newTeamData.type === "project" && (
                <div className="grid gap-2">
                  <Label htmlFor="project">Proje</Label>
                  <Input
                    id="project"
                    placeholder="Proje adını girin"
                    value={newTeamData.project}
                    onChange={(e) => setNewTeamData({ ...newTeamData, project: e.target.value })}
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="submit" onClick={handleCreateTeam}>
                Takım Oluştur
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Takım Listesi</CardTitle>
            <CardDescription>Mevcut takımlar ve detayları</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <div className="px-4 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Takımlarda ara..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Tabs defaultValue="all" className="mt-2">
              <div className="px-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">Tümü</TabsTrigger>
                  <TabsTrigger value="competition">Yarışma</TabsTrigger>
                  <TabsTrigger value="project">Proje</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="mt-0">
                <div className="divide-y">
                  {filteredTeams.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-muted-foreground">Takım bulunamadı</p>
                    </div>
                  ) : (
                    filteredTeams.map((team) => (
                      <div
                        key={team.id}
                        className={`px-4 py-3 cursor-pointer hover:bg-muted/50 ${selectedTeam?.id === team.id ? "bg-muted" : ""}`}
                        onClick={() => setSelectedTeam(team)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium">{team.name}</div>
                            <div className="text-xs text-muted-foreground mt-1">{team.members.length} Üye</div>
                          </div>
                          <Badge variant={team.type === "competition" ? "default" : "outline"}>
                            {team.type === "competition" ? "Yarışma" : "Proje"}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="competition" className="mt-0">
                <div className="divide-y">
                  {competitionTeams.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-muted-foreground">Yarışma takımı bulunamadı</p>
                    </div>
                  ) : (
                    competitionTeams.map((team) => (
                      <div
                        key={team.id}
                        className={`px-4 py-3 cursor-pointer hover:bg-muted/50 ${selectedTeam?.id === team.id ? "bg-muted" : ""}`}
                        onClick={() => setSelectedTeam(team)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium">{team.name}</div>
                            <div className="text-xs text-muted-foreground mt-1">{team.members.length} Üye</div>
                          </div>
                          <Badge variant="default">Yarışma</Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="project" className="mt-0">
                <div className="divide-y">
                  {projectTeams.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-muted-foreground">Proje takımı bulunamadı</p>
                    </div>
                  ) : (
                    projectTeams.map((team) => (
                      <div
                        key={team.id}
                        className={`px-4 py-3 cursor-pointer hover:bg-muted/50 ${selectedTeam?.id === team.id ? "bg-muted" : ""}`}
                        onClick={() => setSelectedTeam(team)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium">{team.name}</div>
                            <div className="text-xs text-muted-foreground mt-1">{team.members.length} Üye</div>
                          </div>
                          <Badge variant="outline">Proje</Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          {selectedTeam ? (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedTeam.name}</CardTitle>
                    <CardDescription>
                      {selectedTeam.type === "competition" ? selectedTeam.competition : selectedTeam.project}
                    </CardDescription>
                  </div>
                  <Badge variant={selectedTeam.type === "competition" ? "default" : "outline"}>
                    {selectedTeam.type === "competition" ? "Yarışma" : "Proje"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Takım Açıklaması</h3>
                  <p className="text-sm text-muted-foreground">{selectedTeam.description}</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">Takım Üyeleri ({selectedTeam.members.length})</h3>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <UserPlus className="mr-2 h-3 w-3" />
                          Üye Ekle
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Takıma Üye Ekle</DialogTitle>
                          <DialogDescription>{selectedTeam.name} takımına yeni bir üye ekleyin.</DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="scholar">Bursiyer</Label>
                            <Select
                              value={newMemberData.scholarId}
                              onValueChange={(value) => setNewMemberData({ ...newMemberData, scholarId: value })}
                            >
                              <SelectTrigger id="scholar">
                                <SelectValue placeholder="Bursiyer seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                {scholarsData
                                  .filter((scholar) => !selectedTeam.members.some((member) => member.id === scholar.id))
                                  .map((scholar) => (
                                    <SelectItem key={scholar.id} value={scholar.id.toString()}>
                                      {scholar.name} ({scholar.grade})
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="role">Rol</Label>
                            <Input
                              id="role"
                              placeholder="Takımdaki rolünü girin"
                              value={newMemberData.role}
                              onChange={(e) => setNewMemberData({ ...newMemberData, role: e.target.value })}
                            />
                          </div>
                        </div>

                        <DialogFooter>
                          <Button type="submit" onClick={handleAddMember}>
                            Üye Ekle
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="border rounded-lg divide-y">
                    {selectedTeam.members.map((member) => (
                      <div key={member.id} className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {member.role} • {member.grade}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveMember(member.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    {selectedTeam.members.length === 0 && (
                      <div className="p-6 text-center">
                        <p className="text-muted-foreground">Henüz takım üyesi bulunmuyor</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  <Pencil className="mr-2 h-4 w-4" />
                  Takımı Düzenle
                </Button>

                {selectedTeam.type === "competition" && (
                  <Button>
                    <Trophy className="mr-2 h-4 w-4" />
                    Yarışma Detayları
                  </Button>
                )}
              </CardFooter>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[500px] p-6 text-center">
              <Users className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Takım Seçilmedi</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Detaylarını görmek için sol taraftan bir takım seçin veya yeni bir takım oluşturun.
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Yeni Takım Oluştur
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Yeni Takım Oluştur</DialogTitle>
                    <DialogDescription>
                      Yeni bir bursiyer takımı oluşturmak için aşağıdaki bilgileri doldurun.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="team-name">Takım Adı</Label>
                      <Input
                        id="team-name"
                        placeholder="Takım adını girin"
                        value={newTeamData.name}
                        onChange={(e) => setNewTeamData({ ...newTeamData, name: e.target.value })}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="team-description">Takım Açıklaması</Label>
                      <Textarea
                        id="team-description"
                        placeholder="Takım açıklamasını girin"
                        value={newTeamData.description}
                        onChange={(e) => setNewTeamData({ ...newTeamData, description: e.target.value })}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="team-type">Takım Türü</Label>
                      <Select
                        value={newTeamData.type}
                        onValueChange={(value) => setNewTeamData({ ...newTeamData, type: value })}
                      >
                        <SelectTrigger id="team-type">
                          <SelectValue placeholder="Takım türünü seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="competition">Yarışma Takımı</SelectItem>
                          <SelectItem value="project">Proje Takımı</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {newTeamData.type === "competition" && (
                      <div className="grid gap-2">
                        <Label htmlFor="competition">Yarışma</Label>
                        <Input
                          id="competition"
                          placeholder="Yarışma adını girin"
                          value={newTeamData.competition}
                          onChange={(e) => setNewTeamData({ ...newTeamData, competition: e.target.value })}
                        />
                      </div>
                    )}

                    {newTeamData.type === "project" && (
                      <div className="grid gap-2">
                        <Label htmlFor="project">Proje</Label>
                        <Input
                          id="project"
                          placeholder="Proje adını girin"
                          value={newTeamData.project}
                          onChange={(e) => setNewTeamData({ ...newTeamData, project: e.target.value })}
                        />
                      </div>
                    )}
                  </div>

                  <DialogFooter>
                    <Button type="submit" onClick={handleCreateTeam}>
                      Takım Oluştur
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
