import { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/AdminUsers.css"; // ✅ 스타일 파일 적용

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 회원 목록 불러오기
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token"); // 저장된 JWT 토큰 가져오기
      const response = await axios.get("http://localhost:8080/admin/users", {
        headers: { Authorization: `Bearer ${token}` } // 🔥 헤더에 JWT 토큰 추가
      });

      console.log("✅ API 응답 데이터: ", response.data); // 디버깅 로그
      setUsers(response.data);
    } catch (error) {
      console.error("회원 목록 불러오기 실패:", error);
    }
  };

  // 🔹 회원 삭제 함수
  const deleteUser = async (email) => {
    if (!window.confirm("정말 이 회원을 삭제하시겠습니까?")) return;

    try {
      const token = localStorage.getItem("token"); // JWT 토큰 가져오기
      await axios.delete(`http://localhost:8080/admin/users/${email}`, {
        headers: { Authorization: `Bearer ${token}` } // 🔥 헤더에 JWT 추가
      });

      alert("회원 삭제 완료");
      fetchUsers(); // ✅ 삭제 후 목록 갱신
    } catch (error) {
      console.error("회원 삭제 실패:", error);
      alert("회원 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">회원 관리</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>프로필</th>
            <th>이름</th>
            <th>이메일</th>
            <th>전화번호</th>
            <th>역할</th>
            <th>가입일</th>
            <th>삭제</th> {/* ✅ 삭제 버튼 추가 */}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.email}>
              {/* ✅ 프로필 이미지 추가 (기본 이미지 적용) */}
              <td>
                <img
                  src={user.profileImage 
                    ? `http://localhost:8080/uploads/${user.profileImage}` 
                    : "/images/default-profile.png"} 
                  alt="프로필 이미지"
                  className="profile-img"
                />
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phoneNumber || "정보 없음"}</td>
              <td>{user.role}</td>
              <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "정보 없음"}</td>
              {/* ✅ 삭제 버튼 추가 */}
              <td>
                <button onClick={() => deleteUser(user.email)} className="delete-btn">삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;