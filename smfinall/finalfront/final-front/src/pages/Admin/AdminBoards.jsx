import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/AdminBoards.css"; // 스타일 파일 연결

const AdminBoards = () => {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 게시글 전체 조회
  const fetchBoards = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/admin/boards", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBoards(res.data);
    } catch (err) {
      console.error("❌ 게시글 목록 불러오기 실패:", err);
    }
  };

  // 게시글 상세 보기
  const handleDetail = async (boardId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8080/admin/boards/${boardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedBoard(res.data);
      setShowModal(true);
    } catch (err) {
      console.error("❌ 게시글 상세 조회 실패:", err);
    }
  };

  // 게시글 삭제
  const handleDelete = async (boardId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/admin/boards/${boardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🗑️ 게시글 삭제 완료!");
      fetchBoards();
    } catch (err) {
      console.error("❌ 게시글 삭제 실패:", err);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <div className="admin-container">
      <h2 className="admin-title">📋 게시글 관리</h2>
      <table className="board-table">
        <thead>
          <tr>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>상세</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {boards.map((board) => (
            <tr key={board.boardId}>
              <td>{board.title}</td>
              <td>{board.writer}</td>
              <td>{new Date(board.createdAt).toLocaleDateString()}</td>
              <td>
                <button className="btn blue" onClick={() => handleDetail(board.boardId)}>🔍 상세</button>
              </td>
              <td>
                <button className="btn red" onClick={() => handleDelete(board.boardId)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 상세 모달 */}
      {showModal && selectedBoard && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedBoard.title}</h3>
            <p><strong>작성자:</strong> {selectedBoard.writer}</p>
            <hr />
            <p>{selectedBoard.content}</p>
            <button className="btn gray" onClick={() => setShowModal(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBoards;