package com.project.model;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class krhWeatherVO {
    private String region; // 지역
    private LocalDateTime dateTime; // 날짜 및 시간
    private int sky; // 하늘 상태 코드
    private int pty; // 강수 형태 코드
    private String weatherType; // "맑음", "흐림", "비", "눈"
    
    public void setCurrentDateTime() {
    	this.dateTime=LocalDateTime.now();
    }
}