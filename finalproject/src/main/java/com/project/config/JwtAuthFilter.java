package com.project.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String requestPath = request.getRequestURI();

        // ✅ 인증 필요 없는 경로는 필터 건너뜀
        if (requestPath.startsWith("/user/register") || requestPath.startsWith("/user/login") ||
            requestPath.startsWith("/user/verify-email") || requestPath.startsWith("/user/confirm-email") ||
            requestPath.startsWith("/user/check-email") || requestPath.startsWith("/user/find-id") ||
            requestPath.startsWith("/user/send-verification-code") || requestPath.startsWith("/user/reset-password")) {
            chain.doFilter(request, response);
            return;
        }

        final String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        String token = authorizationHeader.substring(7);
        String email = jwtUtil.extractEmail(token);
        String role = jwtUtil.extractRole(token); // ✅ JWT에서 role 추출

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            if (jwtUtil.validateToken(token, email)) {
                // ✅ 권한 설정: JWT에서 추출한 role을 직접 authority로 사용
                List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role));

                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    userDetails, null, authorities
                );

                // ✅ 디버깅 로그
                System.out.println("🔐 인증된 사용자: " + email);
                System.out.println("🛡️ 부여된 권한: " + authorities);

                SecurityContextHolder.getContext().setAuthentication(auth);
            } else {
                System.out.println("❌ 토큰 검증 실패");
            }
        }

        chain.doFilter(request, response);
    }
}
