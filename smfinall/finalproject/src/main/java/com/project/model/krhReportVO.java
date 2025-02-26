package com.project.model;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class krhReportVO {
	int boardId; //게시글 번호
	int reporterId; //신고자 아이디
	String reporter; //신고자 이름
	String reason; //신고 사유
	String description; //추가 설명 (선택적)
	LocalDateTime reportedAt; //시간
}
