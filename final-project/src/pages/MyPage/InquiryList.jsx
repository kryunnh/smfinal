import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ useNavigate 추가
import axios from "axios";
import "../../styles/InquiryList.css";
import "../../styles/FormStyles.css"; // ✅ 공통 CSS 적용
const InquiryList = () => {
  const [inquiries, setInquiries] = useState([]);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate(); // ✅ 페이지 이동을 위한 훅 추가

  const API_BASE_URL = "http://localhost:8080/user"; // ✅ API 엔드포인트

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

  useEffect(() => {
    if (!email) return;

    axios
      .get(`${API_BASE_URL}/inquiries/list?email=${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setInquiries(response.data);
      })
      .catch((error) => {
        console.error("❌ 문의 목록 조회 오류:", error.response?.data || error.message);
      });
  }, [email, token]);

  // ✅ 삭제 핸들러 추가
  const handleDelete = async (id) => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/inquiries/delete`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { id, email },
      });

      alert("문의가 삭제되었습니다.");
      setInquiries(inquiries.filter((inquiry) => inquiry.id !== id)); // ✅ 리스트에서 삭제
    } catch (error) {
      console.error("❌ 문의 삭제 오류:", error.response?.data || error.message);
      alert("문의 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="inquiry-list-container">
      <div className="inquiry-header">1:1 문의</div>
      <table className="inquiry-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>등록일시</th>
            <th>답변</th>
            <th>삭제</th> {/* ✅ 삭제 열 추가 */}
          </tr>
        </thead>
        <tbody>
          {inquiries.length > 0 ? (
            inquiries.map((inquiry) => (
              <tr key={inquiry.id}>
                <td>{inquiry.id}</td>
                <td>
                  {/* ✅ 제목을 클릭하면 문의 상세 페이지로 이동 */}
                  <Link to={`/mypage/inquiry/${inquiry.id}`} className="inquiry-title-link">
                    {inquiry.title}
                  </Link>
                </td>
                <td>{new Date(inquiry.createdAt).toLocaleString()}</td>
                <td className="reply-status">{inquiry.reply ? "답변" : "미답변"}</td>
                <td>
                  <button className="delete-button" onClick={() => handleDelete(inquiry.id)}>
                    삭제
                  </button>
                </td> {/* ✅ 삭제 버튼 추가 */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-data">📌 문의 내역이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ 문의하기 버튼 추가 */}
      <button className="inquiry-button" onClick={() => navigate("/mypage/inquiry/new")}>
        문의하기
      </button>
    </div>
  );
};

export default InquiryList;
