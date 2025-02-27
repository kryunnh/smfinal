package com.project.controller;

import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.service.TarotService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/tarot")
@RequiredArgsConstructor
public class TarotController {

    private final TarotService tarotService;

    // 🔹 랜덤 타로 카드 4장 + 랜덤 레시피 이미지 제공
    @GetMapping("/random")
    public ResponseEntity<Map<String, Object>> getRandomTarotAndRecipe() {
        return ResponseEntity.ok(tarotService.getRandomTarotAndRecipe());
    }
}
