package com.project.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.config.CustomUserDetails;
import com.project.model.ChatMessage;
import com.project.model.ChatRoom;
import com.project.service.ChatMessageService;
import com.project.service.ChatRoomService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
public class ChatRoomController {

    private final ChatRoomService chatRoomService;
    private final ChatMessageService chatMessageService;

    // ✅ 유저: 내 채팅방 ID 조회
    @GetMapping("/room")
    public ResponseEntity<?> getMyChatRoom(@AuthenticationPrincipal CustomUserDetails userDetails) {
    	System.out.println("✅ [ChatRoomController] 접근됨");
    	System.out.println("👉 userDetails: " + userDetails);

    	if (userDetails == null) {
            System.out.println("❌ 인증 실패 - userDetails null");
            return ResponseEntity.status(401).body("로그인 필요");
        }

        ChatRoom room = chatRoomService.getOrCreateChatRoom(userDetails.getId());
        room.setUserId(userDetails.getId());
        System.out.println("✅ 생성된 ChatRoom: " + room);
        return ResponseEntity.ok(room); // room 전체 반환
    }


 // ✅ 채팅방 메시지 조회 (관리자/유저 공통)
    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<List<ChatMessage>> getMessagesByRoomId(@PathVariable Long roomId) {
        return ResponseEntity.ok(chatMessageService.getMessagesByRoomId(roomId));
    }

 // ChatRoomController.java (추가 코드)

 // ChatRoomController.java
    @GetMapping("/rooms/{roomId}/user-info")
    public ResponseEntity<?> getUserInfoByRoomId(@PathVariable Long roomId) {
        return ResponseEntity.ok(chatRoomService.getUserInfoByRoomId(roomId));
    }


    // ✅ 관리자: 전체 유저 채팅방 목록 + 메시지 미리보기
    @GetMapping("/admin/rooms")
    public ResponseEntity<?> getAllChatRoomsForAdmin(@AuthenticationPrincipal CustomUserDetails adminDetails) {
        Long adminId = adminDetails.getId();
        String adminEmail = adminDetails.getEmail();
        return ResponseEntity.ok(chatRoomService.getChatRoomsWithDetails(adminId, adminEmail));
    }

    private record RoomResponse(Long roomId) {}
}