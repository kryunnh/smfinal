import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Notifications.css";
import "../../styles/FormStyles.css"; // ✅ 공통 스타일 적용

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  const API_BASE_URL = "http://localhost:8080/user";

  /** ✅ 1. 토큰 파싱 및 이메일 추출 */
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;

    try {
      const payload = JSON.parse(atob(storedToken.split(".")[1]));
      const extractedEmail = payload.email || payload.userEmail || payload.sub;
      if (extractedEmail) {
        setEmail(extractedEmail);
        setToken(storedToken);
      }
    } catch (error) {
      console.error("❌ 토큰 파싱 오류:", error);
    }
  }, []);

  /** ✅ 2. 알림 목록 불러오기 */
  const fetchNotifications = async () => {
    if (!email || !token) return;
  
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications?email=${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const normalized = response.data.map((n) => ({
        ...n,
        read: n.read ?? n.isRead ?? false,
      }));
  
      // ✅ createdAt 기준으로 최신순 정렬
      const sorted = normalized.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
  
      setNotifications(sorted);
    } catch (error) {
      console.error("❌ 알림 목록 조회 오류:", error.response?.data || error.message);
    }
  };

  /** ✅ 3. 이메일 로딩 후 알림 목록 로드 */
  useEffect(() => {
    if (email && token) {
      fetchNotifications();
    }
  }, [email, token]);

  /** ✅ 4. 알림 읽음 처리 */
  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/notifications/read`,
        { email, notificationId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ 읽음 상태 UI에 반영
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("❌ 알림 읽음 처리 오류:", error.response?.data || error.message);
    }
  };

  /** ✅ 5. 알림 삭제 */
  const handleDelete = async (id) => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("❌ 알림 삭제 오류:", error.response?.data || error.message);
    }
  };

  return (
    <div className="notifications-container">
      <div className="notifications-header">📢 내 알림</div>
      <table className="notifications-table">
        <thead>
          <tr>
            <th>내용</th>
            <th>등록일시</th>
            <th>읽음</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <tr key={notification.id}>
                {/* ✅ 클릭 시 읽음 처리 */}
                <td
                  className={`notification-content ${notification.read ? "read" : "unread"}`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  {notification.message}
                </td>
                <td>{new Date(notification.createdAt).toLocaleString()}</td>

                {/* ✅ 읽음 여부 표시 */}
                <td>
                  {notification.read ? (
                    "✅ 읽음"
                  ) : (
                    <>
                      <span className="unread-label">❌ 미확인</span>
                      <button
                        className="mark-read-btn"
                        onClick={() => markAsRead(notification.id)}
                      >
                        확인
                      </button>
                    </>
                  )}
                </td>

                <td>
                  <button className="delete-button" onClick={() => handleDelete(notification.id)}>
                    삭제
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-data">📌 알림이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Notifications;