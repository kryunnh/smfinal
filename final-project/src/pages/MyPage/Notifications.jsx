import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Notifications({ userEmail }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios.get(`/user/notifications?email=${userEmail}`)
      .then(res => setNotifications(res.data))
      .catch(console.error);
  }, [userEmail]);

  const markAsRead = (id) => {
    axios.patch('/user/notifications/read', { id, email: userEmail })
      .then(() => alert('알림 읽음 처리 완료'))
      .catch(console.error);
  };

  const deleteNotification = (id) => {
    axios.delete(`/user/notifications/${id}`)
      .then(() => setNotifications(prev => prev.filter(n => n.id !== id)))
      .catch(console.error);
  };

  return (
    <div>
      <h3>내 알림 목록</h3>
      <ul>
        {notifications.map(noti => (
          <li key={noti.id}>
            {noti.content}
            <button onClick={() => markAsRead(noti.id)}>읽음</button>
            <button onClick={() => deleteNotification(noti.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
