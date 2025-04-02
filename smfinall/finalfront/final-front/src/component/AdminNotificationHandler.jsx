// src/components/AdminNotificationHandler.jsx
import { useEffect } from 'react';
import stompClient from '../utils/websocket';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminNotificationHandler({ userRole }) {
  useEffect(() => {
    if (userRole !== 'admin') return;

    const showStyledToast = (type, prefix, message) => {
      toast.info(`${prefix} ${message}`, {
        icon: type,
        style: {
          backgroundColor: '#fff',
          borderLeft: `5px solid ${type === '📩' ? '#007bff' : type === '⚠️' ? '#dc3545' : '#28a745'}`,
          padding: '10px 15px',
          fontWeight: 'bold',
        },
      });
    };

    stompClient.onConnect = () => {
      console.log('✅ WebSocket 연결 성공');

 

      stompClient.subscribe('/topic/notify/withdraw', (msg) => {
        const data = JSON.parse(msg.body);
        showStyledToast('🚫', '[탈퇴요청]', data.message);
      });

      stompClient.subscribe('/topic/notify/competition', (msg) => {
        const data = JSON.parse(msg.body);
        showStyledToast('🏆', '[공모전]', data.message);
      });

      stompClient.subscribe('/topic/notify/report', (msg) => {
        const data = JSON.parse(msg.body);
        showStyledToast('⚠️', '[신고]', data.message);
      });

      stompClient.subscribe('/topic/notify/inquiry', (msg) => {
        const data = JSON.parse(msg.body);
        showStyledToast('❓', '[1:1 문의]', data.message);
      });
    };

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [userRole]);

  return null;
}

export default AdminNotificationHandler;