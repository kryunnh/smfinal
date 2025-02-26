package com.project.model;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class krhClubVO {
	int clubId; //모임 고유번호
	String clubName; //모임명
	int maxMembers; //모집인원수
	String location; //장소
	String recruiterId; //작성자
	String clubFeatures1; //이런 분을 찾아요 1
	String clubFeatures2; //이런 분을 찾아요 2
	String clubFeatures3; //이런 분을 찾아요 3
	String applier; //지원자
	LocalDateTime createdAt;
	
	List<krhTagVO> tags;
}