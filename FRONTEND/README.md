# DENEYAP Yönetim Paneli

DENEYAP Teknoloji Atölyeleri için geliştirilmiş kapsamlı yönetim sistemi. Bu sistem, atölye sorumluları, komisyon çalışanları ve yöneticiler için farklı yetki seviyelerinde yönetim araçları sunar.

## 🚀 Özellikler

### 🎯 Çok Kullanıcılı Sistem
- **Atölye Sorumlusu (User)**: Atölye düzeyinde yönetim
- **Komisyon Çalışanı (Admin)**: Bölgesel/komisyon düzeyinde yönetim  
- **Yönetici (Superuser)**: Sistem geneli yönetim

### 📊 Ana Özellikler

#### Atölye Sorumlusu Özellikleri
- **Yoklama Sistemi**: Bursiyer ve eğitmen yoklamaları
- **Görev Yönetimi**: Atanan görevleri görüntüleme ve tamamlama
- **Bursiyer Yönetimi**: Bursiyer listesi, detayları ve takip
- **Eğitmen Yönetimi**: Eğitmen bilgileri ve koordinasyon
- **Takım Yönetimi**: Proje takımları oluşturma ve yönetme
- **Envanter Yönetimi**: Atölye malzeme envanteri
- **Mesajlaşma**: Komisyonlarla iletişim
- **Duyurular**: Sistem duyurularını görüntüleme
- **Raporlama**: Aylık raporlar ve istatistikler

#### Komisyon Çalışanı Özellikleri
- **Görev Atama**: Atölyelere görev atama ve takip
- **Atölye Yönetimi**: Atölye performansları ve durumları
- **Duyuru Yönetimi**: Sistem geneli duyuru yayınlama
- **Mesaj Yönetimi**: Atölye sorumluları ile iletişim
- **Rapor İnceleme**: Atölyelerden gelen raporları değerlendirme
- **Takvim Yönetimi**: Etkinlik ve son tarih takibi

#### Yönetici Özellikleri
- **Türkiye Geneli Görünüm**: Tüm atölyelerin harita üzerinde görünümü
- **İstatistik Paneli**: Detaylı performans metrikleri
- **Kritik Bildirimler**: Acil durumlar ve uyarılar
- **Komisyon Koordinasyonu**: Tüm komisyonların faaliyetlerini takip
- **Stratejik Raporlama**: Üst düzey analiz ve raporlar
- **Sistem Yönetimi**: Genel sistem ayarları ve kullanıcı yönetimi

### 🛠️ Teknik Özellikler

#### Frontend
- **Next.js 14**: App Router ile modern React framework
- **TypeScript**: Tip güvenliği ve geliştirici deneyimi
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern ve erişilebilir UI bileşenleri
- **Lucide React**: Tutarlı ikon seti
- **Responsive Design**: Tüm cihazlarda uyumlu tasarım

#### UI/UX Özellikleri
- **Dark/Light Mode**: Tema desteği
- **Responsive Layout**: Mobil, tablet ve masaüstü uyumlu
- **Accessibility**: WCAG standartlarına uygun erişilebilirlik
- **Loading States**: Kullanıcı deneyimi için yükleme durumları
- **Toast Notifications**: Kullanıcı geri bildirimleri
- **Modern Sidebar**: Daraltılabilir navigasyon menüsü

## 📁 Proje Yapısı

\`\`\`
app/
├── dashboard/
│   ├── admin/           # Komisyon çalışanı sayfaları
│   │   ├── announcements/
│   │   ├── messages/
│   │   ├── reports/
│   │   ├── tasks/
│   │   └── workshops/
│   ├── superuser/       # Yönetici sayfaları
│   │   ├── announcements/
│   │   ├── reports/
│   │   ├── tasks/
│   │   └── workshops/
│   └── user/            # Atölye sorumlusu sayfaları
│       ├── announcements/
│       ├── attendance/
│       ├── messages/
│       ├── scholars/
│       ├── tasks/
│       ├── teams/
│       ├── trainers/
│       └── workshop/
├── login/               # Giriş sistemi
├── globals.css          # Global stiller
├── layout.tsx           # Ana layout
└── 
\`\`\`

## 🎨 Sayfa Özellikleri

### Ana Sayfa
- Kullanıcı tipi seçimi (Atölye Sorumlusu, Komisyon Çalışanı, Yönetici)
- DENEYAP branding
- Responsive tasarım

### Giriş Sistemi
- Role-based authentication
- Form validasyonu
- Loading states
- Hata yönetimi

### Dashboard Layouts
- **Collapsible Sidebar**: Daraltılabilir yan menü
- **Role-based Navigation**: Kullanıcı rolüne göre menü öğeleri
- **Header**: Bildirimler ve kullanıcı menüsü
- **Breadcrumb Navigation**: Sayfa konumu göstergesi

### Veri Tabloları
- **Filtreleme**: Gelişmiş arama ve filtreleme
- **Sıralama**: Kolon bazlı sıralama
- **Pagination**: Sayfa bazlı gezinme
- **Export**: Veri dışa aktarma özellikleri

### Form Yönetimi
- **Validation**: Kapsamlı form doğrulama
- **File Upload**: Dosya yükleme desteği
- **Date Pickers**: Tarih seçici bileşenleri
- **Rich Text Editor**: Zengin metin editörü

## 🚦 Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn

### Kurulum Adımları

1. **Projeyi klonlayın**
\`\`\`bash
git clone [repository-url]
cd deneyap-panel
\`\`\`

2. **Bağımlılıkları yükleyin**
\`\`\`bash
npm install
# veya
yarn install
\`\`\`
npm install --legacy-peer-deps

3. **Geliştirme sunucusunu başlatın**
\`\`\`bash
npm run dev
# veya
yarn dev
\`\`\`

4. **Tarayıcıda açın**
\`\`\`
http://localhost:3000
\`\`\`

## 🔧 Geliştirme

### Komutlar
\`\`\`bash
npm run dev          # Geliştirme sunucusu
npm run build        # Production build
npm run start        # Production sunucu
npm run lint         # ESLint kontrolü
npm run type-check   # TypeScript kontrolü
\`\`\`

### Kod Yapısı
- **Components**: Yeniden kullanılabilir UI bileşenleri
- **Pages**: Sayfa bileşenleri
- **Hooks**: Custom React hooks
- **Utils**: Yardımcı fonksiyonlar
- **Types**: TypeScript tip tanımları

## 📱 Responsive Tasarım

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Özellikler
- Mobile-first yaklaşım
- Touch-friendly interface
- Adaptive layouts
- Optimized performance

## 🎯 Kullanıcı Rolleri ve Yetkiler

### Atölye Sorumlusu
- Kendi atölyesi ile ilgili tüm işlemler
- Bursiyer ve eğitmen yönetimi
- Görev takibi ve raporlama
- Envanter yönetimi

### Komisyon Çalışanı
- Birden fazla atölye yönetimi
- Görev atama ve takip
- Duyuru yayınlama
- Rapor değerlendirme

### Yönetici
- Sistem geneli görünüm
- Tüm verilere erişim
- Stratejik raporlar
- Sistem yönetimi

## 🔒 Güvenlik

- Role-based access control
- Form validation
- XSS protection
- CSRF protection
- Secure authentication

## 📈 Performans

- Server-side rendering
- Code splitting
- Image optimization
- Lazy loading
- Caching strategies

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje DENEYAP Türkiye tarafından geliştirilmiştir.

## 📞 İletişim

DENEYAP Türkiye - [website](https://deneyap.org)

---

**DENEYAP Teknoloji Atölyeleri Yönetim Sistemi** - Geleceğin Teknoloji Yıldızları'nı yetiştiren DENEYAP Teknoloji Atölyeleri'nin dijital yönetim platformu.
