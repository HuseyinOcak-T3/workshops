import Navbar from "../components/Navbar";

export default function Announcements() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: 30 }}>
        <h2>Duyurular Sayfası</h2>
        <p>Atölye veya kurum tarafından yayınlanan duyurular burada görünür.</p>
        <ul>
          <li>Yeni atölye takvimi yüklendi.</li>
          <li>Etkinlik kaydı başladı.</li>
          <li>Mentör eğitimi tarihi değişti.</li>
        </ul>
      </div>
    </div>
  );
}