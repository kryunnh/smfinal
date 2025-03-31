import { useEffect, useState } from 'react';
import axios from 'axios';
import ChatBox from '../../components/ChatBox';
import { jwtDecode } from 'jwt-decode';

function MyChatPage() {
  const [roomId, setRoomId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인이 필요합니다');
        return;
      }

      try {
        // ✅ 토큰에서 직접 디코딩하여 사용자 정보 추출
        const decoded = jwtDecode(token);
        console.log('📧 이메일:', decoded.sub);
        console.log('🆔 사용자 ID:', decoded.id);

        // ✅ 바로 ID 설정
        setUserId(decoded.id);

        // ✅ 채팅방 정보 조회
        const roomRes = await axios.get(`/api/chat/room`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const rid = roomRes.data.id;
        setRoomId(rid);
        console.log('✅ 채팅방 roomId:', rid);

      } catch (err) {
        console.error('❌ 채팅 정보 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatInfo();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h3>💬 실시간 고객센터 채팅</h3>
      {loading ? (
        <p>채팅방 정보를 불러오는 중입니다...</p>
      ) : roomId && userId !== null ? (
        <ChatBox roomId={roomId} sender={userId} />
      ) : (
        <p>❗ 채팅방을 찾을 수 없습니다.</p>
      )}
    </div>
  );
}

export default MyChatPage;
