package com.project.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ChatRoom {
    private Long id;
    private Long userId;               // 유저 ID
    private Long adminId;              // 관리자 ID
    private LocalDateTime createdAt;

    // 🔽 프론트에 보내기 위한 추가 필드 (DB에는 없어도 됨)
    private String userName;
    private String userEmail;
    private String profileImageUrl;
    private String lastMessage;
    private int unreadCount;
}
