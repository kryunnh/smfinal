import React, { useState } from "react";
import "../../styles/login.css";
import RegisterModal from "./RegisterModal";
import userApi from "../../api/userApi";
import { useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn }) {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await userApi.login({ email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", response.data.user.email);
      setIsLoggedIn(true);  // ✅ 로그인 상태 즉시 반영
      alert("로그인 성공!");
      navigate("/"); // ✅ 메인 페이지로 이동
    } catch (error) {
      alert(`로그인 실패: ${error.response?.data?.message || error.message}`);
    }
  }

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
           {/* ✅ 아이디/비밀번호 찾기 페이지로 이동 */}
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
