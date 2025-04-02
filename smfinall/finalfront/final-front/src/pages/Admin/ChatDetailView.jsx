// src/components/ChatDetailView.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import ChatBox from '../../components/ChatBox';

function ChatDetailView({ roomId, sender }) {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (!roomId) return;
    const token = localStorage.getItem('token');

    axios.get(`/api/chat/rooms/${roomId}/user-info`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      setUserInfo(res.data);
    })
    .catch(err => {
      console.error('❌ 유저 정보 불러오기 실패:', err);
    });
  }, [roomId]);

  return (
    <div>
      {/* 유저 정보 */}
      {userInfo && (
        <div style={{ marginBottom: 20, padding: 10, border: '1px solid #ddd', borderRadius: 10 }}>
          <h4>👤 유저 정보</h4>
          <p><strong>이름:</strong> {userInfo.name}</p>
          <p><strong>이메일:</strong> {userInfo.email}</p>
          <p><strong>가입일:</strong> {new Date(userInfo.createdAt).toLocaleDateString()}</p>
          <p><strong>최근 접속:</strong> {userInfo.lastLogin
            ? new Date(userInfo.lastLogin).toLocaleString()
            : '정보 없음'}</p>
        </div>
      )}

      {/* 채팅 박스 */}
      <ChatBox roomId={roomId} sender={sender} userInfo={userInfo} senderRole={'ROLE_ADMIN'} />

    </div>
  );
}

export default ChatDetailView;