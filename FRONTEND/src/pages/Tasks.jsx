import Navbar from "../components/Navbar";

export default function Tasks() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: 30 }}>
        <h2>Görevler Sayfası</h2>
        <p>Burada kullanıcıya atanmış görevler listelenir.</p>
        <ul>
          <li>Görev 1</li>
          <li>Görev 2</li>
          <li>Görev 3</li>
        </ul>
      </div>
    </div>
  );
}