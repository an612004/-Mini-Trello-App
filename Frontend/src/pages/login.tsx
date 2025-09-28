
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.sendEmail(email);
      localStorage.setItem("email", email);
      alert("Verification code has been sent. Please check your email!");
      navigate("/auth/signin");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/auth/github`;
  };
///dwedwd
  return (
    <div className="login-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)" }}>
      <div className="login-card" style={{ background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: 32, width: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <img src="/assets/logo.png" alt="Logo" style={{ width: 64, marginBottom: 8 }} />
          <h2 style={{ fontWeight: 700 }}>Đăng nhập vào Trello Mini</h2>
        </div>
        <form onSubmit={handleSendEmail} style={{ marginBottom: 16 }}>
          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: 500 }}>Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ marginBottom: 12 }}
            />
          </div>
          <button className="btn btn-primary w-100" type="submit" disabled={loading} style={{ marginBottom: 8 }}>
            {loading ? "Đang gửi..." : "Gửi mã xác thực qua Email"}
          </button>
        </form>
        <div style={{ textAlign: "center", margin: "16px 0" }}>
          <span style={{ color: "#888" }}>Hoặc</span>
        </div>
        <button
          type="button"
          className="btn btn-dark w-100"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 500 }}
          onClick={handleGithubLogin}
        >
          <img src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" alt="GitHub" style={{ width: 24, height: 24 }} />
          Đăng nhập bằng GitHub
        </button>
      </div>
    </div>
  );
};

export default Login;

