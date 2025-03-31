import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/AdminNotifications.css"; // 스타일 재사용
import ReportDetailModal from "./ReportDetailModal"; // 신고 상세 모달
import SendNotificationModal from "./SendNotificationModal"; 

const AdminReportList = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showSendModal, setShowSendModal] = useState(false);
  // ✅ 신고 목록 불러오기
  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/admin/reports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(res.data);
    } catch (error) {
      console.error("❌ 신고 목록 조회 실패:", error);
    }
  };

  // ✅ 신고 삭제
  const deleteReport = async (reportId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/admin/reports/${reportId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(reports.filter((r) => r.reportId !== reportId));
      alert("✅ 신고가 삭제되었습니다.");
      if (selectedReport?.reportId === reportId) {
        setSelectedReport(null);
      }
    } catch (error) {
      console.error("❌ 신고 삭제 실패:", error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="admin-notifications-container">
      <h2>🚨 신고 알림 목록</h2>

      {/* 📋 신고 리스트 */}
      <div className="notifications-list">
        {reports.length === 0 ? (
          <p>📭 신고가 없습니다.</p>
        ) : (
          reports.map((report) => (
            <div key={report.reportId} className="notification-item unread">
              <p><strong>신고자:</strong> {report.reporter}</p>
              <p><strong>사유:</strong> {report.reason}</p>
              <p><strong>게시글 ID:</strong> {report.boardId}</p>
              <p><strong>신고 일시:</strong> {new Date(report.reportedAt).toLocaleString()}</p>
              <button onClick={() => setSelectedReport(report)}>👁️ 신고 상세 보기</button>
              <button onClick={() => deleteReport(report.reportId)}>❌ 삭제</button>
            </div>
          ))
        )}
      </div>
      {showSendModal && (
  <SendNotificationModal onClose={() => setShowSendModal(false)} />
)}
      <button onClick={() => setShowSendModal(true)}>📢 알림 직접 보내기</button>
      {/* 📌 상세 신고 모달 */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => {
            setSelectedReport(null);
            fetchReports(); // 모달 닫을 때 목록 새로고침
          }}
        />
      )}
    </div>
  );
};

export default AdminReportList;