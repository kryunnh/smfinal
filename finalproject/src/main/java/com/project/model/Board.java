package com.project.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Board {
    private int boardId;      // 게시물 ID (PK)
    private String title;      // 제목
    private String content;    // 내용
    private Long authorId;     // 작성자 ID (users 테이블의 id)
    private String author;     // 작성자 이름
    private String authorEmail; // 작성자 이메일 (FK)
    private int views;         // 조회수
    private int likes;         // 좋아요 수
    private int dislikes;      // 싫어요 수
    private LocalDateTime createdAt;  // 생성일자
    private LocalDateTime updatedAt;  // 수정일자
}
