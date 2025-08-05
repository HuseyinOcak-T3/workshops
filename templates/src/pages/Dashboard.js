import { useEffect, useState } from "react";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("access");
  const role = localStorage.getItem("userRole");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/users/", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, [token]);

  return (
    <div style={{ padding: 30 }}>
      <h1>Dashboard ({role})</h1>
      <p>Hoş geldiniz!</p>

      {role === "superuser" && <p>Tüm atölyelere erişim hakkınız var.</p>}
      {role === "admin" && <p>Görev atama ve duyuru yapabilirsiniz.</p>}
      {role === "user" && <p>Kendi atölyenizi yönetebilirsiniz.</p>}

      <h2>Kullanıcılar</h2>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.username} - {u.role}
          </li>
        ))}
      </ul>
    </div>
  );
}
