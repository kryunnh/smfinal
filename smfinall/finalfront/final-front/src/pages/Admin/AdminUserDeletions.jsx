import { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/AdminPage.css"; // ✅ 기존 스타일 적용

const AdminUserDeletions = () => {
  const [deletionRequests, setDeletionRequests] = useState([]);

  useEffect(() => {
    let isMounted = true; // ✅ 깜빡거림 방지용 플래그

    const fetchDeletionRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/admin/deletion-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ API 응답 데이터:", response.data); // 🔥 디버깅용 로그

        if (isMounted) {
          setDeletionRequests(response.data);
        }
      } catch (error) {
        console.error("회원 탈퇴 요청 목록 불러오기 실패:", error);
      }
    };

    fetchDeletionRequests();

    return () => {
      isMounted = false; // ✅ 컴포넌트 언마운트 시 데이터 업데이트 방지
    };
  }, []);

  const approveDeletion = async (email) => {
    if (!window.confirm("정말 이 사용자의 탈퇴를 승인하시겠습니까?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/admin/deletion-requests/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ 탈퇴 요청이 승인되었습니다.");
      setDeletionRequests((prev) => prev.filter((req) => req.email !== email)); // ✅ UI에서 즉시 삭제
    } catch (error) {
      console.error("❌ [Error] 탈퇴 승인 실패:", error);
      alert("탈퇴 승인에 실패했습니다.");
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">회원 탈퇴 요청 관리</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>이메일</th>
            <th>탈퇴 사유</th>
            <th>요청 날짜</th>
            <th>승인</th>
          </tr>
        </thead>
        <tbody>
          {deletionRequests.length > 0 ? (
            deletionRequests.map((request) => (
              <tr key={`${request.email}-${request.createdAt}`}>
                <td>{request.email}</td>
                <td>{request.reason || "사유 없음"}</td>
                <td>
                  {request.createdAt
                    ? new Date(request.createdAt).toLocaleString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "정보 없음"}
                </td>
                <td>
                  <button className="approve-btn" onClick={() => approveDeletion(request.email)}>
                    승인
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-data">탈퇴 요청이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserDeletions;