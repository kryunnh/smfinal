package com.project.controller;

import com.project.model.NotificationMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class NotificationWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    // 🛎️ 게시글 신고 알림 (프론트에서 보낼 수도 있음)
    @MessageMapping("/notify.report")
    public void notifyReport(@Payload NotificationMessage message) {
        messagingTemplate.convertAndSend("/topic/notify/report", message);
    }

    // 🛎️ 공모전 승인 요청 알림
    @MessageMapping("/notify.competition")
    public void notifyCompetition(@Payload NotificationMessage message) {
        messagingTemplate.convertAndSend("/topic/notify/competition", message);
    }

    // 🛎️ 회원 탈퇴 요청 알림
    @MessageMapping("/notify.withdraw")
    public void notifyWithdraw(@Payload NotificationMessage message) {
        messagingTemplate.convertAndSend("/topic/notify/withdraw", message);
    }

    // 💬 채팅 알림 - 서버 내부에서만 사용 (MessageMapping 아님)
    public void notifyChat(String previewMessage) {
        NotificationMessage message = new NotificationMessage(
            "chat",
            previewMessage,
            "/chat" // 유저는 클릭 시 채팅 페이지로 이동
        );
        messagingTemplate.convertAndSend("/topic/notify/chat", message);
    }
}