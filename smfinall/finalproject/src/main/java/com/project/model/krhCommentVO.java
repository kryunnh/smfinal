package com.project.model;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class krhCommentVO {
	private int commentId;        // 댓글 고유 ID (자동 증가)
    private LocalDateTime createdAt;  // 댓글 작성 시간
    private LocalDateTime updatedAt;  // 댓글 수정 시간
    private String content;       // 댓글 내용
    private String author;        // 댓글 작성자
    private int authorId; //댓글 작성자 고유 아이디
    private boolean isEdited;     // 댓글 수정 여부
    private int replyId; //대댓글 Id
    private int boardId; //게시글 아이디

    List<krhCommentVO> replies; //목록? 이지 않을까 함..
}
