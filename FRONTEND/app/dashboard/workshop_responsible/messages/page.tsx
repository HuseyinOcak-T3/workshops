"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { ArrowRight, Mail, PaperclipIcon, Plus, Search, Send, User, Users } from "lucide-react"
import Link from "next/link"

// Sample messages data
const messagesData = [
  {
    id: 1,
    sender: {
      id: 101,
      name: "Mehmet Kaya",
      role: "Komisyon Çalışanı",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    messages: [
      {
        id: 1,
        content: "Merhaba, Mart ayı yoklama girişleri hakkında bilgi almak istiyorum.",
        timestamp: "2025-03-15T10:30:00",
        isFromSender: true,
      },
      {
        id: 2,
        content:
          "Merhaba, yoklama girişleri için son tarih 5 Nisan 2025. Şu ana kadar 15 bursiyer için yoklama girişi yapılmış.",
        timestamp: "2025-03-15T10:35:00",
        isFromSender: false,
      },
      {
        id: 3,
        content: "Teşekkür ederim. Kalan yoklamaları bu hafta içinde tamamlayacağım.",
        timestamp: "2025-03-15T10:40:00",
        isFromSender: true,
      },
    ],
    lastMessageTime: "2025-03-15T10:40:00",
    unread: false,
  },
  {
    id: 2,
    sender: {
      id: 102,
      name: "Ayşe Demir",
      role: "Eğitmen Komisyonu",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    messages: [
      {
        id: 1,
        content: "Merhaba, atölyenizdeki eğitmen değerlendirme anketleri hakkında bilgi vermek istiyorum.",
        timestamp: "2025-03-14T14:20:00",
        isFromSender: true,
      },
      {
        id: 2,
        content: "Merhaba, anketi ne zaman tamamlamamız gerekiyor?",
        timestamp: "2025-03-14T14:25:00",
        isFromSender: false,
      },
      {
        id: 3,
        content: "Anketlerin 20 Mart 2025 tarihine kadar tamamlanması gerekiyor. Tüm bursiyerlerin katılımı önemli.",
        timestamp: "2025-03-14T14:30:00",
        isFromSender: true,
      },
    ],
    lastMessageTime: "2025-03-14T14:30:00",
    unread: true,
  },
  {
    id: 3,
    sender: {
      id: 103,
      name: "Ali Yılmaz",
      role: "Takımlar Komisyonu",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    messages: [
      {
        id: 1,
        content: "Merhaba, TEKNOFEST 2025 için takım başvuruları hakkında bilgi vermek istiyorum.",
        timestamp: "2025-03-10T09:15:00",
        isFromSender: true,
      },
      {
        id: 2,
        content: "Merhaba, başvuru için son tarih nedir?",
        timestamp: "2025-03-10T09:20:00",
        isFromSender: false,
      },
      {
        id: 3,
        content:
          "Başvurular 1 Nisan 2025 tarihine kadar devam edecek. Takım bilgilerini en kısa sürede sisteme girmenizi rica ederiz.",
        timestamp: "2025-03-10T09:25:00",
        isFromSender: true,
      },
      {
        id: 4,
        content: "Teşekkürler, bu hafta içinde takım bilgilerini gireceğim.",
        timestamp: "2025-03-10T09:30:00",
        isFromSender: false,
      },
    ],
    lastMessageTime: "2025-03-10T09:30:00",
    unread: false,
  },
  {
    id: 4,
    sender: {
      id: 104,
      name: "Zeynep Öztürk",
      role: "Medya ve İletişim Komisyonu",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    messages: [
      {
        id: 1,
        content: "Merhaba, atölye tanıtım videosu ve fotoğrafları hakkında bilgi vermek istiyorum.",
        timestamp: "2025-03-05T11:10:00",
        isFromSender: true,
      },
      {
        id: 2,
        content: "Merhaba, ne tür içerikler hazırlamamız gerekiyor?",
        timestamp: "2025-03-05T11:15:00",
        isFromSender: false,
      },
      {
        id: 3,
        content:
          "Atölyenizin tanıtımı için 2-3 dakikalık bir video ve en az 10 fotoğraf hazırlamanızı rica ediyoruz. İçerik kılavuzunu e-posta ile gönderdim.",
        timestamp: "2025-03-05T11:20:00",
        isFromSender: true,
      },
    ],
    lastMessageTime: "2025-03-05T11:20:00",
    unread: true,
  },
]

// Sample contacts data
const contactsData = [
  {
    id: 101,
    name: "Mehmet Kaya",
    role: "Komisyon Çalışanı",
    department: "Eğitmen Komisyonu",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 102,
    name: "Ayşe Demir",
    role: "Komisyon Çalışanı",
    department: "Eğitmen Komisyonu",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 103,
    name: "Ali Yılmaz",
    role: "Komisyon Çalışanı",
    department: "Takımlar Komisyonu",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 104,
    name: "Zeynep Öztürk",
    role: "Komisyon Çalışanı",
    department: "Medya ve İletişim Komisyonu",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 105,
    name: "Mustafa Şahin",
    role: "Yönetici",
    department: "Eğitim Programları Direktörlüğü",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 106,
    name: "Elif Yıldız",
    role: "Atölye Sorumlusu",
    department: "İstanbul - Kadıköy Atölyesi",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 107,
    name: "Ahmet Arslan",
    role: "Eğitmen",
    department: "Robotik",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function MessagesPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedConversation, setSelectedConversation] = useState<(typeof messagesData)[0] | null>(messagesData[0])
  const [newMessage, setNewMessage] = useState("")
  const [activeTab, setActiveTab] = useState("messages")

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    toast({
      title: "Mesaj gönderildi",
      description: "Mesajınız başarıyla gönderildi.",
    })

    // In a real app, you would update the messages array and send the message to the server
    setNewMessage("")
  }

  const handleNewConversation = () => {
    toast({
      title: "Yeni mesaj oluşturuldu",
      description: "Yeni mesaj başlatıldı.",
    })
  }

  // Filter conversations based on search term
  const filteredConversations = messagesData.filter((conversation) =>
    conversation.sender.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Filter contacts based on search term
  const filteredContacts = contactsData.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mesajlar</h1>
          <p className="text-muted-foreground">Komisyonlar ve diğer kullanıcılarla iletişim kurun</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/workshop_responsible/messages/email">
              <Mail className="mr-2 h-4 w-4" />
              E-posta Gönder
            </Link>
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Mesaj
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Konuşmalar</CardTitle>
              <Tabs defaultValue="messages" onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="messages">Mesajlar</TabsTrigger>
                  <TabsTrigger value="contacts">Kişiler</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <CardDescription>{activeTab === "messages" ? "Mevcut konuşmalarınız" : "Tüm kişiler"}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="px-4 py-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={activeTab === "messages" ? "Konuşmalarda ara..." : "Kişilerde ara..."}
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {activeTab === "messages" ? (
              <ScrollArea className="h-[500px]">
                <div className="divide-y">
                  {filteredConversations.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-muted-foreground">Konuşma bulunamadı</p>
                    </div>
                  ) : (
                    filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`px-4 py-3 cursor-pointer hover:bg-muted/50 ${
                          selectedConversation?.id === conversation.id ? "bg-muted" : ""
                        }`}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarImage src={conversation.sender.avatar} alt={conversation.sender.name} />
                            <AvatarFallback>{conversation.sender.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="font-medium truncate">{conversation.sender.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {format(new Date(conversation.lastMessageTime), "HH:mm")}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">{conversation.sender.role}</div>
                            <div className="text-sm truncate mt-1">
                              {conversation.messages[conversation.messages.length - 1].content}
                            </div>
                          </div>
                          {conversation.unread && <div className="h-2 w-2 rounded-full bg-primary mt-1"></div>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            ) : (
              <ScrollArea className="h-[500px]">
                <div className="divide-y">
                  {filteredContacts.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-muted-foreground">Kişi bulunamadı</p>
                    </div>
                  ) : (
                    filteredContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="px-4 py-3 cursor-pointer hover:bg-muted/50"
                        onClick={handleNewConversation}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarImage src={contact.avatar} alt={contact.name} />
                            <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{contact.name}</div>
                            <div className="text-xs text-muted-foreground mt-1">{contact.role}</div>
                            <div className="text-xs text-muted-foreground mt-1">{contact.department}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-8">
          {selectedConversation ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedConversation.sender.avatar} alt={selectedConversation.sender.name} />
                      <AvatarFallback>{selectedConversation.sender.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{selectedConversation.sender.name}</CardTitle>
                      <CardDescription>{selectedConversation.sender.role}</CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/workshop_responsible/profile/${selectedConversation.sender.id}`}>
                      <User className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px] p-4">
                  <div className="space-y-4">
                    {selectedConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isFromSender ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.isFromSender ? "bg-muted" : "bg-primary text-primary-foreground"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs text-right mt-1 opacity-70">
                            {format(new Date(message.timestamp), "HH:mm")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="border-t p-3">
                <div className="flex items-center gap-2 w-full">
                  <Button variant="outline" size="icon">
                    <PaperclipIcon className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Mesajınızı yazın..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button size="icon" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[500px] p-6 text-center">
              <Users className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Mesaj Seçilmedi</h3>
              <p className="text-sm text-muted-foreground mb-4">Bir konuşma seçin veya yeni bir mesaj başlatın.</p>
              <Button onClick={() => setActiveTab("contacts")}>
                <ArrowRight className="mr-2 h-4 w-4" />
                Kişileri Görüntüle
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
