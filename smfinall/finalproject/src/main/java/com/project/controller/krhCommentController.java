package com.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.model.krhCommentVO;
import com.project.service.krhBoardService;
import com.project.service.krhCommentService;


@RestController
@RequestMapping("/api/comment")
public class krhCommentController {
	//private final JwtTokenUtil jwtTokenUtil;
	
	@Autowired
    private krhCommentService krhcommentService;
	
	//댓글 목록 구현
	@GetMapping
	public ResponseEntity<List<krhCommentVO>> commentList(@RequestParam int boardId){
		List<krhCommentVO> comments = krhcommentService.commentList(boardId);
		return new ResponseEntity<>(comments, HttpStatus.OK);
	}
	
	//대댓글 목록 구현
	@GetMapping("/reply")
	public ResponseEntity<List<krhCommentVO>> commentListReply(@RequestParam int commentId){
		List<krhCommentVO> replies = krhcommentService.commentListReply(commentId);
		return new ResponseEntity<>(replies, HttpStatus.OK);
	}
	
	//댓글 추가 (로그인된 사용자만 가능)
	
	//대댓글 추가 (로그인된 사용자만 가능)
	
	//댓글 삭제 (해당 사용자만 가능)
	
	//댓글 수정 (해당 사용자만 가능)
	
}
