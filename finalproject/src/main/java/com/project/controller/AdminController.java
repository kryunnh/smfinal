package com.project.controller;

import com.project.model.*;
import com.project.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // 🔹 전체 회원 조회
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    // 🔹 회원 삭제
    @DeleteMapping("/users/{email}")
    public ResponseEntity<String> deleteUser(@PathVariable String email) {
        adminService.deleteUser(email);
        return ResponseEntity.ok("User deleted.");
    }

    // 🔹 회원탈퇴 요청 목록 조회
    @GetMapping("/deletion-requests")
    public ResponseEntity<List<UserDeletionRequest>> getAllDeletionRequests() {
        return ResponseEntity.ok(adminService.getAllDeletionRequests());
    }

    // 🔹 회원탈퇴 요청 승인
    @DeleteMapping("/deletion-requests/{email}")
    public ResponseEntity<String> approveDeletionRequest(@PathVariable String email) {
        adminService.approveDeletionRequest(email);
        return ResponseEntity.ok("User deletion request approved.");
    }

    // 🔹 1:1 문의 전체 목록 조회
    @GetMapping("/inquiries")
    public ResponseEntity<List<Inquiry>> getAllInquiries() {
        return ResponseEntity.ok(adminService.getAllInquiries());
    }

    // 🔹 1:1 문의 답변 등록
    @PatchMapping("/inquiries/reply/{id}")
    public ResponseEntity<String> replyToInquiry(@PathVariable Long id, @RequestParam String reply) {
        adminService.replyToInquiry(id, reply);
        return ResponseEntity.ok("Inquiry reply added.");
    }

    // 🔹 1:1 문의 삭제
    @DeleteMapping("/inquiries/{id}")
    public ResponseEntity<String> deleteInquiry(@PathVariable Long id) {
        adminService.deleteInquiryReply(id);
        return ResponseEntity.ok("Inquiry deleted.");
    }

    // 🔹 특정 유저에게 알림 전송
    @PostMapping("/send-notification")
    public ResponseEntity<String> sendUserNotification(@RequestParam String email, @RequestParam String message) {
        adminService.sendUserNotification(email, message);
        return ResponseEntity.ok("Notification sent to user.");
    }

    // 🔹 공모전 게시물 승인
    @PatchMapping("/contests/approve/{id}")
    public ResponseEntity<String> approveContest(@PathVariable Long id) {
        adminService.approveContest(id);
        return ResponseEntity.ok("Contest approved.");
    }

    // 🔹 공모전 게시물 거절
    @PatchMapping("/contests/reject/{id}")
    public ResponseEntity<String> rejectContest(@PathVariable Long id) {
        adminService.rejectContest(id);
        return ResponseEntity.ok("Contest rejected.");
    }

    // 🔹 공모전 게시물 삭제
    @DeleteMapping("/contests/{id}")
    public ResponseEntity<String> deleteContest(@PathVariable Long id) {
        adminService.deleteContest(id);
        return ResponseEntity.ok("Contest deleted.");
    }

    // 🔹 관리자 게시물 목록 조회
    @GetMapping("/posts")
    public ResponseEntity<List<AdminPost>> getAllPosts() {
        return ResponseEntity.ok(adminService.getAllPosts());
    }

    // 🔹 관리자 게시물 삭제
    @DeleteMapping("/posts/{id}")
    public ResponseEntity<String> deletePost(@PathVariable Long id) {
        adminService.deletePost(id);
        return ResponseEntity.ok("Post deleted.");
    }

    // 🔹 레시피 목록 조회
    @GetMapping("/recipes")
    public ResponseEntity<List<Recipe>> getAllRecipes() {
        return ResponseEntity.ok(adminService.getAllRecipes());
    }

    // 🔹 레시피 등록
    @PostMapping("/recipes")
    public ResponseEntity<String> insertRecipe(@RequestBody Recipe recipe) {
        adminService.insertRecipe(recipe);
        return ResponseEntity.ok("Recipe added successfully.");
    }

    // 🔹 레시피 수정
    @PutMapping("/recipes/{id}")
    public ResponseEntity<String> updateRecipe(@PathVariable Long id, @RequestBody Recipe recipe) {
        recipe.setId(id);
        adminService.updateRecipe(recipe);
        return ResponseEntity.ok("Recipe updated successfully.");
    }

    // 🔹 레시피 삭제
    @DeleteMapping("/recipes/{id}")
    public ResponseEntity<String> deleteRecipe(@PathVariable Long id) {
        adminService.deleteRecipe(id);
        return ResponseEntity.ok("Recipe deleted.");
    }

    // 🔹 관리자 알림 목록 조회
    @GetMapping("/notifications")
    public ResponseEntity<List<Notification>> getAdminNotifications(@RequestParam String email) {
        return ResponseEntity.ok(adminService.getAdminNotifications(email));
    }

    // 🔹 관리자 알림 읽음 처리
    @PatchMapping("/notifications/read/{id}")
    public ResponseEntity<String> readAdminNotification(@PathVariable Long id) {
        adminService.markAdminNotificationAsRead(id);
        return ResponseEntity.ok("Admin notification read.");
    }

    // 🔹 관리자 알림 삭제
    @DeleteMapping("/notifications/{id}")
    public ResponseEntity<String> deleteAdminNotification(@PathVariable Long id) {
        adminService.deleteAdminNotification(id);
        return ResponseEntity.ok("Admin notification deleted.");
    }
}
