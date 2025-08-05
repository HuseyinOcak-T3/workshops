import Navbar from "../components/Navbar";

export default function Attendance() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: 30 }}>
        <h2>Yoklama Sayfası</h2>
        <p>Bugünkü öğrenci yoklaması burada tutulur.</p>
        <table border="1" cellPadding="10" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Ad Soyad</th>
              <th>Katılım Durumu</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ali Yılmaz</td>
              <td>✔ Katıldı</td>
            </tr>
            <tr>
              <td>Ayşe Demir</td>
              <td>✖ Katılmadı</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
