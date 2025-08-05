import Navbar from "../../components/Navbar.jsx";

export default function UserDashboard() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: 30 }}>
        <h2>Kullanıcı Paneli</h2>
        <p>Kendi atölyenizi yönetebilirsiniz.</p>
        <ul>
          <li>Görev görüntüleme ve tamamlama</li>
          <li>Duyuru takibi</li>
          <li>Yoklama girişi</li>
        </ul>
      </div>
    </div>
  );
}
