import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/login.css";
import RegisterModal from "./RegisterModal";
import userApi from "../../api/userApi";

function Login({ setIsLoggedIn }) {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "ROLE_ADMIN") {
      console.log("🚀 관리자 감지됨, 자동 이동");
      navigate("/admin");
    }
  }, []); // 🔥 로그인 후 강제 이동 (한 번만 실행)

  const handleLogin = async () => {
    try {
      const response = await userApi.login({ email, password });
  
      console.log("✅ 로그인 응답 데이터:", response.data);
      console.log("🔍 로그인한 사용자 역할 (원본):", response.data.user.role);
  
      const userRole = response.data.user.role.trim().toUpperCase(); // 🔥 소문자 대문자 변환
      console.log("🔍 변환된 역할:", userRole);
  
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", response.data.user.email);
      localStorage.setItem("user", JSON.stringify(response.data.user));
  
      setIsLoggedIn(true);
      alert("로그인 성공!");
  
      if (userRole === "ROLE_ADMIN" || userRole === "ADMIN") {
        console.log("🚀 관리자 로그인 감지됨, /admin으로 이동");
        navigate("/admin");
      } else {
        console.log("👤 일반 사용자 로그인, /로 이동");
        navigate("/");
      }
    } catch (error) {
      console.error("❌ 로그인 실패:", error);
      alert(`로그인 실패: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">LOGIN</h1>
      <div className="login-box">
        <label className="login-label">ID</label>
        <input
          type="text"
          placeholder="아이디"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="login-label">PASSWORD</label>
        <input
          type="password"
          placeholder="비밀번호"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-button" onClick={handleLogin}>로그인</button>

        <div className="login-links">
          <button className="find-button" onClick={() => navigate("/find-account")}>
            아이디 | 비밀번호 찾기
          </button>
          <button className="register-button" onClick={() => setIsRegisterOpen(true)}>회원가입 하기</button>
        </div>
      </div>

      {isRegisterOpen && <RegisterModal onClose={() => setIsRegisterOpen(false)} />}
    </div>
  );
}

export default Login;
