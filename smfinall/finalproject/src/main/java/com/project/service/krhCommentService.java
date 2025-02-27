package com.project.service;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.project.model.krhCommentVO;

public interface krhCommentService {
	//댓글 목록 조회
	List<krhCommentVO> commentList(int boardId);
		
	//대댓글 목록 조회
	List<krhCommentVO> commentListReply(int commentId);
	
	//댓글 추가
	void addComment(Map<String, Object>params);
		
	//대댓글 추가
	void addReply(Map<String, Object>params);
		
	//댓글 수정
	void updateComment(Map<String, Object>params);
		
	//댓글 삭제
	void deleteComment(int commentId);
}
