import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // 🔹 useNavigate 추가
import axios from "axios";
import "../../styles/InquiryDetail.css";
import "../../styles/FormStyles.css"; // ✅ 공통 CSS 적용
const InquiryDetail = () => {
  const { id } = useParams(); // ✅ URL에서 문의 ID 가져오기
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate(); // 🔹 문의 목록으로 돌아가기 기능 추가

  const API_BASE_URL = "http://localhost:8080/user"; // ✅ API 엔드포인트

  // ✅ 토큰 가져오기 (컴포넌트 마운트 시)
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      console.log("🔹 저장된 토큰:", storedToken); // 🔥 디버깅 출력
      setToken(storedToken);
    } else {
      console.warn("⚠️ 토큰이 없습니다. 로그인해야 조회 가능합니다.");
    }
  }, []);

  // ✅ 문의 상세 조회 API 요청
  useEffect(() => {
    if (!id || !token) {
      console.warn("⏳ 문의 ID 또는 토큰이 없습니다. 요청을 중단합니다.");
      return;
    }

    console.log("🚀 문의 상세 조회 요청:", `${API_BASE_URL}/inquiries/${id}`);
    console.log("🔹 Authorization 헤더:", `Bearer ${token}`);

    axios
      .get(`${API_BASE_URL}/inquiries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("✅ 문의 상세 조회 성공:", response.data);
        setInquiry(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ 문의 상세 조회 오류:", error.response?.data || error.message);
        setError("🚨 문의 내용을 불러올 수 없습니다.");
        setLoading(false);
      });
  }, [id, token]);

  return (
    <div className="inquiry-detail-container">
      {loading ? (
        <p className="loading-text">📌 문의 내용을 불러오는 중...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : inquiry ? (
        <>
          <h2 className="inquiry-title">{inquiry.title}</h2>
          <p className="inquiry-date">📅 작성일: {new Date(inquiry.createdAt).toLocaleString()}</p>
          <div className="inquiry-content-box">
            <p className="inquiry-content">{inquiry.content}</p>
          </div>
          <div className="inquiry-reply-box">
            <p className="inquiry-reply">
              📝 답변: {inquiry.reply ? inquiry.reply : "아직 답변이 없습니다."}
            </p>
          </div>
          <button className="back-button" onClick={() => navigate("/mypage/inquiry")}>
            🔙 목록으로 돌아가기
          </button>
        </>
      ) : (
        <p className="error-text">❌ 문의 내용을 불러오지 못했습니다.</p>
      )}
    </div>
  );
};

export default InquiryDetail;
