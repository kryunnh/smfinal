package com.project.controller;

import java.io.IOException;

import org.apache.hc.core5.http.HttpEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.project.service.SpeechRecognitionService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class SpeechController {

	 @Value("${naver.client.id}")
	    private String clientId;

	    @Value("${naver.client.secret}")
	    private String clientSecret;

	    @PostMapping("/recognize-speech")
	    public ResponseEntity<String> recognizeSpeech(@RequestParam("file") MultipartFile file) {
	        try {
	            // 파일을 네이버 API에 보내기 위한 준비
	            String url = "https://naveropenapi.apis.naver.com/v1/voice/recognize";
	            HttpHeaders headers = new HttpHeaders();
	            headers.add("X-Naver-Client-Id", clientId);
	            headers.add("X-Naver-Client-Secret", clientSecret);
	            headers.add("Content-Type", "multipart/form-data");

	            // MultipartFile을 바이트 배열로 변환하여 요청에 추가
	            byte[] fileBytes = file.getBytes();
	            HttpEntity<byte[]> entity = new HttpEntity<>(fileBytes, headers);

	            // 네이버 음성 인식 API 호출
	            RestTemplate restTemplate = new RestTemplate();
	            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

	            return ResponseEntity.ok(response.getBody()); // 음성 인식 결과 반환
	        } catch (IOException e) {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("음성 파일 처리 오류");
	        }
	    }
}
