"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SendIcon,
  MailIcon,
  SearchIcon,
  MoreHorizontalIcon,
  PlusIcon,
  FilterIcon,
  CheckIcon,
  ArchiveIcon,
  TrashIcon,
  StarIcon,
  FolderIcon,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Örnek mesaj verileri
const messagesData = [
  {
    id: 1,
    sender: "Ahmet Yılmaz",
    role: "Atölye Sorumlusu",
    workshop: "İstanbul Kadıköy Atölyesi",
    subject: "Malzeme talebi hakkında",
    preview: "Merhaba, atölyemiz için acil olarak bazı malzemelere ihtiyacımız var...",
    date: "10:30",
    isRead: false,
    isStarred: true,
    category: "inbox",
  },
  {
    id: 2,
    sender: "Zeynep Kaya",
    role: "Atölye Sorumlusu",
    workshop: "İstanbul Beşiktaş Atölyesi",
    subject: "Aylık rapor gönderimi",
    preview: "Aylık raporu ekte bulabilirsiniz. Herhangi bir sorunuz olursa...",
    date: "Dün",
    isRead: true,
    isStarred: false,
    category: "inbox",
  },
  {
    id: 3,
    sender: "Mehmet Demir",
    role: "Atölye Sorumlusu",
    workshop: "Ankara Çankaya Atölyesi",
    subject: "Eğitim materyalleri hakkında",
    preview: "Yeni eğitim materyallerini ne zaman alabiliriz? Önümüzdeki hafta...",
    date: "2 gün önce",
    isRead: true,
    isStarred: false,
    category: "inbox",
  },
  {
    id: 4,
    sender: "Ayşe Şahin",
    role: "Atölye Sorumlusu",
    workshop: "İzmir Bornova Atölyesi",
    subject: "Bursiyer performans değerlendirmesi",
    preview: "Bursiyerlerimizin son performans değerlendirmelerini tamamladık...",
    date: "3 gün önce",
    isRead: true,
    isStarred: true,
    category: "inbox",
  },
  {
    id: 5,
    sender: "Ali Yıldız",
    role: "Atölye Sorumlusu",
    workshop: "Bursa Nilüfer Atölyesi",
    subject: "Teknik destek talebi",
    preview: "3D yazıcımızda bir sorun yaşıyoruz. Teknik destek ekibinin...",
    date: "4 gün önce",
    isRead: false,
    isStarred: false,
    category: "inbox",
  },
  {
    id: 6,
    sender: "Fatma Öztürk",
    role: "Atölye Sorumlusu",
    workshop: "Antalya Muratpaşa Atölyesi",
    subject: "Yeni eğitmen talebi",
    preview: "Robotik alanında yeni bir eğitmene ihtiyacımız var. Mevcut...",
    date: "1 hafta önce",
    isRead: true,
    isStarred: false,
    category: "archived",
  },
  {
    id: 7,
    sender: "Mustafa Aydın",
    role: "Atölye Sorumlusu",
    workshop: "Adana Seyhan Atölyesi",
    subject: "Bakım çalışmaları hakkında",
    preview: "Atölyemizde planlanan bakım çalışmaları ne zaman başlayacak?...",
    date: "1 hafta önce",
    isRead: true,
    isStarred: false,
    category: "archived",
  },
  {
    id: 8,
    sender: "Deneyap Komisyonu",
    role: "Sistem",
    workshop: "",
    subject: "Görev atama bildirimi",
    preview: "Yeni bir görev ataması yapıldı: 'Aylık rapor hazırlama'...",
    date: "2 hafta önce",
    isRead: true,
    isStarred: false,
    category: "sent",
  },
  {
    id: 9,
    sender: "Deneyap Komisyonu",
    role: "Sistem",
    workshop: "",
    subject: "Duyuru: Yeni eğitim materyalleri",
    preview: "Tüm atölyelere yeni eğitim materyalleri yüklenmiştir...",
    date: "2 hafta önce",
    isRead: true,
    isStarred: false,
    category: "sent",
  },
  {
    id: 10,
    sender: "Deneyap Komisyonu",
    role: "Sistem",
    workshop: "",
    subject: "Hatırlatma: Performans değerlendirmeleri",
    preview: "Tüm atölye sorumlularına hatırlatma: Bursiyer performans...",
    date: "3 hafta önce",
    isRead: true,
    isStarred: false,
    category: "sent",
  },
]

// Örnek konuşma verileri
const conversationData = [
  {
    id: 1,
    sender: "Ahmet Yılmaz",
    content:
      "Merhaba, atölyemiz için acil olarak bazı malzemelere ihtiyacımız var. Özellikle Arduino setleri ve sensörler tükenmek üzere. Ne zaman temin edebiliriz?",
    time: "10:30",
    isMe: false,
  },
  {
    id: 2,
    sender: "Siz",
    content:
      "Merhaba Ahmet Bey, talebinizi aldım. Hangi malzemelere ihtiyacınız olduğunu detaylı bir liste halinde gönderebilir misiniz?",
    time: "10:35",
    isMe: true,
  },
  {
    id: 3,
    sender: "Ahmet Yılmaz",
    content:
      "Tabii, hemen hazırlayıp göndereceğim. Yaklaşık olarak 10 adet Arduino UNO, 20 adet çeşitli sensör ve 5 adet motor sürücü devresine ihtiyacımız var.",
    time: "10:40",
    isMe: false,
  },
  {
    id: 4,
    sender: "Siz",
    content:
      "Teşekkürler. Bu malzemeleri kontrol edip size en kısa sürede dönüş yapacağım. Tahmini olarak 1 hafta içinde temin edebiliriz.",
    time: "10:45",
    isMe: true,
  },
  {
    id: 5,
    sender: "Ahmet Yılmaz",
    content:
      "Harika, teşekkür ederim. Önümüzdeki hafta bir robotik projesi başlatacağız, o yüzden bu malzemeler bizim için önemli.",
    time: "10:50",
    isMe: false,
  },
]

export default function MessagesPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("inbox")
  const [selectedMessage, setSelectedMessage] = useState<number | null>(1) // İlk mesajı seçili olarak başlat
  const [searchQuery, setSearchQuery] = useState("")
  const [message, setMessage] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Filtreleme fonksiyonu
  const filteredMessages = messagesData.filter((msg) => {
    // Kategori filtresi
    const matchesCategory = activeTab === "all" || msg.category === activeTab

    // Arama sorgusu filtresi
    const matchesSearch =
      msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (msg.workshop && msg.workshop.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesCategory && matchesSearch
  })

  const handleSendMessage = () => {
    if (message.trim() === "") return

    // Mesaj gönderme işlemi burada yapılacak
    toast({
      title: "Mesaj gönderildi",
      description: "Mesajınız başarıyla gönderildi.",
    })
    setMessage("")
  }

  const handleStarMessage = (id: number) => {
    // Yıldızlama işlemi burada yapılacak
    toast({
      title: "Mesaj yıldızlandı",
      description: "Mesaj yıldızlı mesajlara eklendi.",
    })
  }

  const handleArchiveMessage = (id: number) => {
    // Arşivleme işlemi burada yapılacak
    toast({
      title: "Mesaj arşivlendi",
      description: "Mesaj arşive taşındı.",
    })
  }

  const handleDeleteMessage = (id: number) => {
    // Silme işlemi burada yapılacak
    toast({
      title: "Mesaj silindi",
      description: "Mesaj çöp kutusuna taşındı.",
    })
  }

  const selectedMessageData = messagesData.find((msg) => msg.id === selectedMessage)
  const conversation = selectedMessage ? conversationData : []

  return (
    <div className="flex-1 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold tracking-tight">Mesajlar</h2>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Yeni Mesaj
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-2">
          <CardHeader className="space-y-0 gap-y-4 pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Mesaj Kutusu</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowFilters(!showFilters)}>
                <FilterIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Mesajlarda ara..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="inbox" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 w-full rounded-none border-b">
                <TabsTrigger value="inbox" className="rounded-none">
                  Gelen
                </TabsTrigger>
                <TabsTrigger value="starred" className="rounded-none">
                  Yıldızlı
                </TabsTrigger>
                <TabsTrigger value="sent" className="rounded-none">
                  Gönderilen
                </TabsTrigger>
                <TabsTrigger value="archived" className="rounded-none">
                  Arşiv
                </TabsTrigger>
              </TabsList>

              {showFilters && (
                <div className="p-3 border-b">
                  <div className="space-y-2">
                    <Label className="text-xs">Filtrele</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        Okunmamış
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        Bugün
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        Bu Hafta
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <TabsContent value="inbox" className="m-0">
                <div className="max-h-[calc(100vh-350px)] overflow-y-auto">
                  {filteredMessages
                    .filter((msg) => msg.category === "inbox")
                    .map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start gap-3 p-3 border-b cursor-pointer hover:bg-muted transition-colors ${
                          selectedMessage === message.id ? "bg-muted" : ""
                        } ${!message.isRead ? "bg-blue-50" : ""}`}
                        onClick={() => setSelectedMessage(message.id)}
                      >
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>
                            {message.sender
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className={`font-medium truncate ${!message.isRead ? "font-semibold" : ""}`}>
                              {message.sender}
                            </div>
                            <div className="text-xs text-muted-foreground whitespace-nowrap ml-2">{message.date}</div>
                          </div>
                          <div className="text-sm font-medium truncate">{message.subject}</div>
                          <div className="text-xs text-muted-foreground truncate">{message.preview}</div>
                          {message.workshop && (
                            <div className="mt-1">
                              <Badge variant="outline" className="text-xs">
                                {message.workshop}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="starred" className="m-0">
                <div className="max-h-[calc(100vh-350px)] overflow-y-auto">
                  {filteredMessages
                    .filter((msg) => msg.isStarred)
                    .map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start gap-3 p-3 border-b cursor-pointer hover:bg-muted transition-colors ${
                          selectedMessage === message.id ? "bg-muted" : ""
                        }`}
                        onClick={() => setSelectedMessage(message.id)}
                      >
                        {/* Benzer mesaj içeriği */}
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>
                            {message.sender
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="font-medium truncate">{message.sender}</div>
                            <div className="text-xs text-muted-foreground whitespace-nowrap ml-2">{message.date}</div>
                          </div>
                          <div className="text-sm font-medium truncate">{message.subject}</div>
                          <div className="text-xs text-muted-foreground truncate">{message.preview}</div>
                          {message.workshop && (
                            <div className="mt-1">
                              <Badge variant="outline" className="text-xs">
                                {message.workshop}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="sent" className="m-0">
                <div className="max-h-[calc(100vh-350px)] overflow-y-auto">
                  {filteredMessages
                    .filter((msg) => msg.category === "sent")
                    .map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start gap-3 p-3 border-b cursor-pointer hover:bg-muted transition-colors ${
                          selectedMessage === message.id ? "bg-muted" : ""
                        }`}
                        onClick={() => setSelectedMessage(message.id)}
                      >
                        {/* Benzer mesaj içeriği */}
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>
                            {message.sender
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="font-medium truncate">{message.sender}</div>
                            <div className="text-xs text-muted-foreground whitespace-nowrap ml-2">{message.date}</div>
                          </div>
                          <div className="text-sm font-medium truncate">{message.subject}</div>
                          <div className="text-xs text-muted-foreground truncate">{message.preview}</div>
                          {message.workshop && (
                            <div className="mt-1">
                              <Badge variant="outline" className="text-xs">
                                {message.workshop}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="archived" className="m-0">
                <div className="max-h-[calc(100vh-350px)] overflow-y-auto">
                  {filteredMessages
                    .filter((msg) => msg.category === "archived")
                    .map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start gap-3 p-3 border-b cursor-pointer hover:bg-muted transition-colors ${
                          selectedMessage === message.id ? "bg-muted" : ""
                        }`}
                        onClick={() => setSelectedMessage(message.id)}
                      >
                        {/* Benzer mesaj içeriği */}
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>
                            {message.sender
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="font-medium truncate">{message.sender}</div>
                            <div className="text-xs text-muted-foreground whitespace-nowrap ml-2">{message.date}</div>
                          </div>
                          <div className="text-sm font-medium truncate">{message.subject}</div>
                          <div className="text-xs text-muted-foreground truncate">{message.preview}</div>
                          {message.workshop && (
                            <div className="mt-1">
                              <Badge variant="outline" className="text-xs">
                                {message.workshop}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="md:col-span-5">
          {selectedMessageData ? (
            <>
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-xl">{selectedMessageData.subject}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarFallback>
                        {selectedMessageData.sender
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{selectedMessageData.sender}</span>
                    <span className="mx-2 text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{selectedMessageData.role}</span>
                    {selectedMessageData.workshop && (
                      <>
                        <span className="mx-2 text-muted-foreground">•</span>
                        <Badge variant="outline" className="text-xs">
                          {selectedMessageData.workshop}
                        </Badge>
                      </>
                    )}
                    <span className="ml-auto text-muted-foreground">{selectedMessageData.date}</span>
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleStarMessage(selectedMessageData.id)}
                    className={selectedMessageData.isStarred ? "text-yellow-500" : ""}
                  >
                    <StarIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleArchiveMessage(selectedMessageData.id)}>
                    <ArchiveIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteMessage(selectedMessageData.id)}>
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <CheckIcon className="mr-2 h-4 w-4" />
                        <span>Okundu olarak işaretle</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FolderIcon className="mr-2 h-4 w-4" />
                        <span>Klasöre taşı</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <MailIcon className="mr-2 h-4 w-4" />
                        <span>E-posta olarak gönder</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col h-[calc(100vh-350px)]">
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {conversation.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.isMe ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          {!msg.isMe && <div className="font-medium text-sm mb-1">{msg.sender}</div>}
                          <div>{msg.content}</div>
                          <div
                            className={`text-xs mt-1 text-right ${
                              msg.isMe ? "text-primary-foreground/70" : "text-muted-foreground"
                            }`}
                          >
                            {msg.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <Input
                      placeholder="Mesajınızı yazın..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage}>
                      <SendIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-300px)]">
              <MailIcon className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-medium text-muted-foreground">Mesaj seçilmedi</h3>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Soldaki listeden bir mesaj seçerek görüntüleyebilirsiniz
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
