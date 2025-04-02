import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChatDetailView from './ChatDetailView';

function AdminChatPage() {
  const [roomList, setRoomList] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [senderId, setSenderId] = useState(null); // 관리자 ID

  useEffect(() => {
    console.log("현재 roomList 값:", roomList);
  }, [roomList]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log("✅ 파싱된 payload:", payload);
        setSenderId(payload.id);
      } catch (e) {
        console.error('❌ 토큰 파싱 실패:', e);
      }

      axios.get('/api/chat/admin/rooms', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        console.log('📦 채팅방 응답 구조:', res.data); // 👈 구조 확인
        setRoomList(res.data);
      })
      .catch(err => {
        console.error('❌ 채팅방 리스트 요청 실패:', err);
      });
    }
  }, []);

  return (
    <div style={{ display: 'flex', marginTop:"100px"}}className="club-page">
      <div style={{ width: 300, marginRight: 20, borderRight: '1px solid #ddd' }}>
        <h3 style={{ marginBottom: 10, color:"#FFA575"}}>💬 유저 채팅 목록</h3>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {roomList.map((room) => {
            const roomId = room.roomId || room.id; // 🔧 안정성 확보
            return (
              <li key={roomId}>
                <button
                  onClick={() => {
                    console.log('✅ 클릭됨 - roomId:', roomId);
                    setSelectedRoomId(roomId);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: selectedRoomId === roomId ? '#FFA575' : '#f0f0f0',
                    color: selectedRoomId === roomId ? '#fff' : '#000',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontWeight: selectedRoomId === roomId ? 'bold' : 'normal',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img
                      src={room.profileImageUrl || '/images/default-profile.jpg'}
                      alt="프로필"
                      style={{ width: 30, height: 30, borderRadius: '50%' }}
                    />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{room.userName}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{room.userEmail}</div>
                    </div>
                    {room.unreadCount > 0 && (
                      <div style={{
                        backgroundColor: '#dc3545',
                        color: '#fff',
                        borderRadius: '50%',
                        padding: '2px 8px',
                        fontSize: '12px',
                        marginLeft: 'auto'
                      }}>
                        {room.unreadCount}
                      </div>
                    )}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#444',
                    marginTop: 5,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%'
                  }}>
                    {room.lastMessage || '메시지가 없습니다'}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div style={{ flex: 1 }}>
  {selectedRoomId && senderId !== null ? (
    <ChatDetailView key={selectedRoomId} roomId={selectedRoomId} sender={senderId} />
  ) : (
    <div style={{ padding: 40, textAlign: 'center', color: '#777' }}>
      👈 채팅할 유저를 왼쪽에서 선택해주세요
    </div>
  )}
</div>

    </div>
  );
}

export default AdminChatPage;
