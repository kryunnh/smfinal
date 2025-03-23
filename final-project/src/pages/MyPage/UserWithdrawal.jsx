import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 페이지 이동을 위해 추가
import axios from "axios";
import "../../styles/UserWithdrawal.css"; // ✅ 스타일 파일 추가
import "../../styles/FormStyles.css"; // ✅ 공통 CSS 적용
const UserWithdrawal = () => {
  const [reason, setReason] = useState(""); // 🔥 탈퇴 사유
  const [email, setEmail] = useState(""); // 🔥 로그인된 사용자 이메일
  const [token, setToken] = useState(""); // 🔥 JWT 토큰 저장
  const navigate = useNavigate(); // ✅ 페이지 이동을 위한 훅 추가

  const API_BASE_URL = "http://localhost:8080/user"; // ✅ API 엔드포인트

  // ✅ 로그인된 사용자 이메일 가져오기
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const payload = JSON.parse(atob(storedToken.split(".")[1])); // JWT 디코딩
        const extractedEmail = payload.email || payload.userEmail || payload.sub;
        if (extractedEmail) setEmail(extractedEmail);
        setToken(storedToken);
      } catch (error) {
        console.error("❌ 토큰 파싱 오류:", error);
      }
    }
  }, []);

  // ✅ 회원 탈퇴 요청 핸들러
  const handleSubmit = async () => {
    if (!reason.trim()) {
      alert("탈퇴 사유를 입력해주세요.");
      return;
    }
    if (!email) {
      alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:8080/user/request-deletion",
        { email, reason },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ 토큰 포함
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 200) {
        alert("회원 탈퇴 요청이 성공적으로 제출되었습니다.");
        localStorage.removeItem("token"); // ✅ 로그아웃 처리
        window.location.href = "/"; // ✅ 홈페이지로 이동
      }
    } catch (error) {
      console.error("❌ 회원 탈퇴 요청 오류:", error.response?.data || error.message);
      alert("회원 탈퇴 요청을 제출하는 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="withdrawal-form-container">
      <div className="withdrawal-header">회원 탈퇴 요청</div>
      <div className="withdrawal-content">
        <textarea
          className="withdrawal-textarea"
          placeholder="탈퇴 사유를 입력해주세요..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="withdrawal-buttons">
          <button className="submit-button" onClick={handleSubmit}>
            탈퇴 요청 제출
          </button>
          <button className="cancel-button" onClick={() => navigate("/mypage")}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserWithdrawal;
