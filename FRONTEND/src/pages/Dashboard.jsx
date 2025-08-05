import Navbar from "../components/Navbar";

export default function Dashboard() {
  const role = localStorage.getItem("userRole");

  return (
    <div>
      <Navbar />
      <div style={{ padding: 30 }}>
        <h1>DENEYAP Panel - Dashboard</h1>
        <p>Rol: {role}</p>
      </div>
    </div>
  );
}