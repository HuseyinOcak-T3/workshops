import Navbar from "../../components/Navbar.jsx";

export default function MemberDashboard() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: 30 }}>
        <h2>Üye Paneli</h2>
        <p>Üye paneli kişisel bilgileri görüntülersiniz</p>
        <ul>
          <li>Görev görüntüleme ve tamamlama</li>
          <li>Duyuru takibi</li>
          <li>Yoklama girişi</li>
        </ul>
      </div>
    </div>
  );
}