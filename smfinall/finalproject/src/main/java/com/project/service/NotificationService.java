package com.project.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.project.mapper.NotificationMapper;
import com.project.model.Notification;
import com.project.model.NotificationMessage;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationMapper notificationMapper;
    private final SimpMessagingTemplate messagingTemplate;
    // 🔹 알림 전송
    public void sendNotification(String email, String message) {
        Notification notification = new Notification();
        notification.setReceiverEmail(email);
        notification.setMessage(message);
        notification.setIsRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        notificationMapper.sendNotification(notification);
    }

    // 🔹 안 읽은 관리자 알림만 가져오기 (이메일 기반)
    public List<Notification> getUnreadAdminNotifications(String email) {
        return notificationMapper.selectUnreadAdminNotifications(email);
    }

    // 🔹 알림 읽음 처리
    public void markNotificationAsRead(Long notificationId) {
        notificationMapper.markNotificationAsRead(notificationId);
    }

    // 🔹 알림 삭제
    public void deleteNotification(Long notificationId) {
        notificationMapper.deleteNotification(notificationId);
    }
    // 🔸 채팅 메시지 알림 (유저 → 관리자)
    public void sendChatNotification(String preview) {
        NotificationMessage noti = new NotificationMessage(
            "chat",
            preview,
            "/chat"
        );
        messagingTemplate.convertAndSend("/topic/notify/chat", noti);
    }

    // 🔸 회원 탈퇴 요청 알림
    public void sendWithdrawNotification(String message) {
        NotificationMessage noti = new NotificationMessage(
            "withdraw",
            message,
            ""
        );
        messagingTemplate.convertAndSend("/topic/notify/withdraw", noti);
    }

    // 🔸 공모전 승인 요청 알림
    public void sendCompetitionNotification(String message) {
        NotificationMessage noti = new NotificationMessage(
            "competition",
            message,
            ""
        );
        messagingTemplate.convertAndSend("/topic/notify/competition", noti);
    }

    // 🔸 게시글 신고 접수 알림
    public void sendReportNotification(String message) {
        NotificationMessage noti = new NotificationMessage(
            "report",
            message,
            ""
        );
        messagingTemplate.convertAndSend("/topic/notify/report", noti);
    }

    // 🔸 1:1 문의 접수 알림
    public void sendInquiryNotification(String message) {
        NotificationMessage noti = new NotificationMessage(
            "inquiry",
            message,
            ""
        );
        messagingTemplate.convertAndSend("/topic/notify/inquiry", noti);
    }
    
} 