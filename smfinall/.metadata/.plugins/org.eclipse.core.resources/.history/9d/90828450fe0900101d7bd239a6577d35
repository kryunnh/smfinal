package com.project.service;

import com.project.mapper.NotificationMapper;
import com.project.model.Notification;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationMapper notificationMapper;

    // 🔹 특정 유저 또는 관리자에게 알림 전송
    public void sendNotification(Notification notification) {
        notificationMapper.sendNotification(notification);
    }

    // 🔹 알림 읽음 처리
    public void markNotificationAsRead(Long notificationId) {
        notificationMapper.markNotificationAsRead(notificationId);
    }

    // 🔹 알림 삭제
    public void deleteNotification(Long notificationId) {
        notificationMapper.deleteNotification(notificationId);
    }
}