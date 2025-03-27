import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/ReportDetailModal.css";

const ReportDetailModal = ({ report, onClose }) => {
  const [post, setPost] = useState(null);
  const [receiverEmail, setReceiverEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:8080/admin/boards/${report.boardId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPost(res.data);
        setReceiverEmail(res.data.authorEmail); // 작성자 이메일 자동 세팅
      } catch (error) {
        console.error("❌ 게시글 상세 조회 실패:", error);
      }
    };

    fetchPost();
  }, [report.boardId]);

  const deletePost = async () => {
    if (!window.confirm("이 게시글을 정말 삭제하시겠습니까?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/admin/boards/${report.boardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ 게시글이 삭제되었습니다.");
      onClose();
    } catch (error) {
      console.error("❌ 게시글 삭제 실패:", error);
    }
  };

  const sendWarning = async () => {
    if (!receiverEmail || !message) {
      alert("이메일과 메시지를 입력하세요.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/admin/notifications",
        { receiverEmail, message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("⚠️ 경고 알림 전송 완료!");
      setMessage("");
    } catch (error) {
      console.error("❌ 알림 전송 실패:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">

        {/* 🚨 신고 정보 */}
        <div className="report-section report-reporter">
          <h3>🚨 신고 정보</h3>
          <p><strong>신고자:</strong> {report.reporter}</p>
          <p><strong>신고자 ID:</strong> {report.reporterId}</p>
          {report.reporterEmail && (
            <p><strong>신고자 이메일:</strong> {report.reporterEmail}</p>
          )}
          <p><strong>사유:</strong> {report.reason}</p>
          <p><strong>신고 날짜:</strong> {new Date(report.reportedAt).toLocaleString()}</p>
        </div>

        <hr />

        {/* 📝 게시글 정보 */}
        {post ? (
          <div className="report-section report-post">
            <h3>📝 신고당한 게시글</h3>
            <p><strong>제목:</strong> {post.title}</p>
            <p><strong>작성자:</strong> {post.author} (ID: {post.authorId})</p>
            <p><strong>작성자 이메일:</strong> {post.authorEmail}</p>
            <p><strong>작성일:</strong> {new Date(post.createdAt).toLocaleString()}</p>
            <p><strong>내용:</strong></p>
            <pre>{post.content}</pre>

            <button onClick={deletePost}>❌ 게시글 삭제</button>
          </div>
        ) : (
          <p>⏳ 게시글을 불러오는 중...</p>
        )}

        {/* ⚠️ 경고 전송 */}
        <div className="send-warning">
          <h4>⚠️ 작성자에게 경고 알림 보내기</h4>
          <input type="email" value={receiverEmail} readOnly />
          <input
            type="text"
            placeholder="경고 메시지 입력"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendWarning}>📩 전송</button>
        </div>

        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default ReportDetailModal;