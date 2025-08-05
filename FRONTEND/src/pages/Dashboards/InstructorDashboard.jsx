import Navbar from "../../components/Navbar.jsx";

export default function InstructorDashboard() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: 30 }}>
        <h2>Eğitmen Paneli</h2>
        <p>Eğitmen paneli kişisel bilgileri görüntülersiniz</p>
        <ul>
          <li>Görev görüntüleme ve tamamlama</li>
          <li>Duyuru takibi</li>
          <li>Yoklama girişi</li>
        </ul>
      </div>
    </div>
  );
}