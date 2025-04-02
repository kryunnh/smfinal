package com.project.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Component
public class WebSocketHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtUtil jwtUtil;

    public WebSocketHandshakeInterceptor(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes
    ) {
        if (request instanceof ServletServerHttpRequest servletRequest) {
            HttpServletRequest httpRequest = servletRequest.getServletRequest();

            // ✅ 쿼리 파라미터에서 토큰 추출
            String token = httpRequest.getParameter("token");

            if (token != null) {
                String email = jwtUtil.extractEmail(token);

                System.out.println("🔍 받은 토큰: " + token);
                System.out.println("🔍 검증된 이메일: " + email);
                System.out.println("✅ 토큰 유효 여부: " + jwtUtil.validateToken(token, email));

                if (jwtUtil.validateToken(token, email)) {
                    attributes.put("email", email); // 이후 WebSocket에서 사용 가능
                    System.out.println("✅ WebSocket 인증 성공 - " + email);
                    return true;
                }
            }
        }

        System.out.println("❌ WebSocket 인증 실패");
        return false;
    }

    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception exception
    ) {
        // 핸드셰이크 이후 작업 없음
    }
}