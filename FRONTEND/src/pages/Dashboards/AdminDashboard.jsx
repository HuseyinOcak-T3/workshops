import Navbar from "../../components/Navbar.jsx";

export default function AdminDashboard() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: 30 }}>
        <h2>Admin Paneli</h2>
        <p>Komisyon görev ve duyurularını yönetebilirsiniz.</p>
        <ul>
          <li>Görev atama</li>
          <li>Duyuru gönderme</li>
          <li>Atölye listesi ve durumu</li>
        </ul>
      </div>
    </div>
  );
}
