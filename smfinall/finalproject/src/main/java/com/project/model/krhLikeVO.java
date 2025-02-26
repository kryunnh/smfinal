package com.project.model;

import lombok.Data;

@Data
public class krhLikeVO {
	private int boardId; //게시판 아이디 
    private int userId; //회원 아이디
    private String likeType; // "like", "dislike", "none"
    private int likeCount;
    private int dislikeCount;
    
 // 파라미터를 받는 생성자 추가
    public krhLikeVO(int boardId, int userId, String likeType, int likeCount, int dislikeCount) {
        this.boardId = boardId;
        this.userId = userId;
        this.likeType = likeType;
        this.likeCount = likeCount;
        this.dislikeCount = dislikeCount;
    }
}
