import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#2c3e50",
        color: "white",
      }}
    >
      <div>
        <strong>DENEYAP Panel</strong> ({role})
      </div>
      <div style={{ display: "flex", gap: "15px" }}>
        <Link to="/dashboard" style={{ color: "white" }}>Anasayfa</Link>
        <Link to="/tasks" style={{ color: "white" }}>Görevler</Link>
        <Link to="/announcements" style={{ color: "white" }}>Duyurular</Link>
        <Link to="/attendance" style={{ color: "white" }}>Yoklama</Link>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          Çıkış Yap
        </button>
        <Link to="/profile" style={{ color: "white" }}>
          Profil
        </Link>
      </div>
    </div>
  );
}