import Navbar from "../../components/Navbar.jsx";

export default function SuperuserDashboard() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: 30 }}>
        <h2>Superuser Paneli</h2>
        <p>Tüm Türkiye genelindeki atölyeleri görebilirsiniz.</p>
        <ul>
          <li>Harita üzerinden atölye detayları</li>
          <li>Yoklama ve görev istatistikleri</li>
          <li>Tüm duyuru ve görevleri yönetme</li>
        </ul>
      </div>
    </div>
  );
}
