import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("access", data.access);

      // Kullanıcı bilgilerini çek
      const userResponse = await fetch("http://127.0.0.1:8000/api/users/", {
        headers: { Authorization: "Bearer " + data.access },
      });
      const users = await userResponse.json();
      // Kendi kullanıcı bilgini bul
      const me = users.find((u) => u.email === email);

      localStorage.setItem("userRole", me.role);
      navigate("/dashboard");
    } else {
      alert("Giriş başarısız!");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>DENEYAP Panel Giriş</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email: </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <label>Şifre: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button style={{ marginTop: 20 }} type="submit">
          Giriş Yap
        </button>
      </form>
    </div>
  );
}
