import { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/FormStyles.css"; // ✅ 공통 CSS 적용
import "../../styles/InquiryForm.css";
import { useNavigate } from "react-router-dom"; // 
const InquiryForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [email, setEmail] = useState(""); // 🔥 이메일 저장
  const [token, setToken] = useState("");
  const navigate = useNavigate(); // ✅ 페이지 이동 훅 추가
  const API_BASE_URL = "http://localhost:8080/user"; // ✅ API 엔드포인트

  // ✅ 로그인된 사용자 이메일 가져오기
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      console.log("🔹 저장된 토큰:", storedToken); // 🔥 디버깅 출력

      try {
        const payload = JSON.parse(atob(storedToken.split(".")[1])); // JWT 디코딩
        console.log("🔹 JWT Payload:", payload); // 🔥 디버깅 출력

        // ✅ JWT의 `sub`이 email로 저장됨
        const extractedEmail = payload.email || payload.userEmail || payload.sub;
        if (extractedEmail) {
          setEmail(extractedEmail);
          console.log("✅ 로그인된 이메일:", extractedEmail);
        } else {
          console.error("❌ JWT에서 이메일을 찾을 수 없습니다.");
        }

        setToken(storedToken);
      } catch (error) {
        console.error("❌ 토큰 파싱 오류:", error);
      }
    } else {
      console.warn("⚠️ 저장된 토큰이 없습니다. 사용자가 로그인되지 않았을 수 있습니다.");
    }
  }, []);

  // ✅ 문의 제출 핸들러 (JWT 포함 요청 + 디버깅 추가)
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }
    if (!email) {
      alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }

    // ✅ 백엔드에서 `userEmail` 키를 요구하는지 확인 후 수정 필요!
    const requestData = { userEmail: email, title, content };

    console.log("🔹 전송할 데이터:", requestData); // 🔥 디버깅 출력
    console.log("🔹 전송할 헤더:", {
      Authorization: `Bearer ${token}`,
    });

    try {
      const response = await axios.post(
        `${API_BASE_URL}/inquiries`,
        requestData,
        {
          headers: { Authorization: `Bearer ${token}` }, // ✅ JWT 포함하여 요청
        }
      );

      console.log("✅ 서버 응답:", response); // 🔥 디버깅 출력

      if (response.status === 200) {
        alert("문의가 성공적으로 전송되었습니다.");
        setTitle("");
        setContent("");
      }
      // ✅ 문의 목록 페이지로 이동
      navigate("/mypage/inquiry");
    } catch (error) {
      console.error("❌ 문의 전송 오류:", error);
      if (error.response) {
        console.error("❌ 서버 응답 데이터:", error.response.data);
        console.error("❌ 서버 응답 상태 코드:", error.response.status);
        alert(`문의 전송에 실패했습니다. 오류 코드: ${error.response.status}\n${error.response.data}`);
      } else {
        alert("문의 전송 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="inquiry-form-container">
      <div className="inquiry-header">1:1 문의</div>
      <div className="inquiry-content">
        <input
          className="inquiry-input"
          type="text"
          placeholder="제목을 입력해주세요..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="inquiry-textarea"
          placeholder="문의 내용을 입력해주세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="inquiry-buttons">
          <button className="submit-button" onClick={handleSubmit}>
            문의 내용 전송
          </button>
          <button className="cancel-button" onClick={() => window.history.back()}>
  취소
</button>
        </div>
      </div>
    </div>
  );
};

export default InquiryForm;