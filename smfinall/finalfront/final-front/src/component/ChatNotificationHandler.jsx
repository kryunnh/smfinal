import { useEffect } from "react";
import stompClient from "../utils/websocket"; // stompClient 경로에 맞게 조정
import { toast } from 'react-toastify';

const ChatNotificationHandler = () => {
  useEffect(() => {
    if (!stompClient || !stompClient.connected) return;

    const subscription = stompClient.subscribe('/topic/notify/chat', (message) => {
      const data = JSON.parse(message.body);
      console.log('📣 채팅 알림 수신:', data);

      // ✅ toast로 알림 표시
      toast.info(`[채팅 알림] ${data.senderName || '상대방'}: ${data.message}`);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [stompClient.connected]);

  return null;
};

export default ChatNotificationHandler;