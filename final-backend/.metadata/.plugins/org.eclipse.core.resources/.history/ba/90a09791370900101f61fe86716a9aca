package com.project.controller;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.project.config.ClovaSpeechClient;
import com.project.model.Recipes;
import com.project.service.RecipesService;

public class NaverSpeechController {

	private final String secret = "1ee17685ab3845ffa101346fce23b844";
	
	@PostMapping("/recognize")
	public ResponseEntity<Map<String,String>> recognizeSpeech(@RequestParam("file") MultipartFile file){
		try {
			ClovaSpeechClient client = new ClovaSpeechClient();
			String recognizedText = client.upload(file.getResource().getFile());
			
			return ResponseEntity.ok(Collections.singletonMap("text",recognizedText));
		}catch(Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	
	}
	
	
}
