package com.project.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.config.JwtUtil;
import com.project.model.*;
import com.project.service.EmailService;
import com.project.service.RecipesService;
import com.project.service.UserService;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;
    private final RecipesService recipesService;

    
    // ✅ 1️⃣ 이메일 인증 코드 요청
    @PostMapping("/verify-email")
    public ResponseEntity<String> sendVerificationEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        userService.sendVerificationEmail(email);
        return ResponseEntity.ok("이메일 인증 코드가 전송되었습니다.");
    }

    // ✅ 2️⃣ 이메일 인증 후 최종 회원가입 완료
    @PostMapping("/confirm-email")
    public ResponseEntity<String> confirmEmailAndRegister(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String verificationCode = request.get("verificationCode");
        String password = request.get("password");
        String name = request.get("name");
        String phoneNumber = request.get("phoneNumber");
        String profileImage = request.get("profileImage");

        // ✅ 올바른 인자 개수로 메서드 호출
        userService.confirmEmailAndRegister(email, verificationCode, password, name, phoneNumber, profileImage);

        return ResponseEntity.ok("Email verified and user registered successfully.");
    }

   
    // ✅ 4. 🔹 회원가입
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        userService.registerUser(user);
        return ResponseEntity.ok("User registered successfully");
    }

    // ✅ 5. 🔹 로그인 (JWT 발급)
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody User user) {
        User validUser = userService.validateUser(user.getEmail(), user.getPassword());
        if (validUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
        }

        String token = jwtUtil.generateToken(validUser.getEmail(), validUser.getRole()); // ✅ 역할 포함

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", validUser);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/favorites")
    public ResponseEntity<Map<String, Object>> getUserFavorites(@RequestHeader("Authorization") String token) {
        // JWT 토큰에서 사용자 정보를 추출
        String jwtToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        Claims  claims;
        try {
            claims = jwtUtil.extractAllClaims(jwtToken); 
        } catch (Exception e) {
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }

        String email = claims.getSubject(); 

        if (email == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        User user = userService.findByUserEmail(email);
        if (user == null) {
            throw new RuntimeException("사용자를 찾을 수 없습니다.");
        }
        // 사용자의 즐겨찾기 목록을 가져옴
        List<Recipes> favoriteRecipes = recipesService.getFavoritesByUserId(user.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("favorites", favoriteRecipes);

        return ResponseEntity.ok(response);
    }



}