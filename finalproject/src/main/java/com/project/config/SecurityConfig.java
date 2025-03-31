package com.project.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;
import com.project.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CustomUserDetailsService customUserDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors().configurationSource(corsConfigurationSource()) // ✅ CORS 설정
            .and()
            .csrf().disable() // ✅ CSRF 비활성화
            .authorizeHttpRequests()
            // ✅ WebSocket 허용 (SockJS 포함 모든 경로)
            .requestMatchers("/ws/**").permitAll()
            .requestMatchers("/app/**", "/topic/**").permitAll() 
            // ✅ 정적 리소스 허용
            .requestMatchers("/api/uploads/**", "/uploads/**").permitAll()

            // ✅ 회원 관련 공개 API
            .requestMatchers(
                HttpMethod.GET, "/user/get-hashed-password"
            ).permitAll()
            .requestMatchers(
                "/user/login", "/user/register", "/user/find-id",
                "/user/send-verification-code", "/user/reset-password",
                "/user/verify-email", "/user/confirm-email", "/user/check-email", "/user/check-phone"
            ).permitAll()

            // ✅ 레시피, 게시판, OCR 등 공개 API
            .requestMatchers(
                "/api/recipes", "/api/recipes/popular", "/api/recognize-speech",
                "/api/recipes/search", "/api/recipes/**", "/api/recipes/review/{id}", "/api/recipes/{id}/increase-view",
                "/api/userrecipes", "/api/userrecipes/{id}", "/api/userrecipes/search", "/api/userrecipes/{id}/increase-view",
                "/api/userrecipes/review/{id}",
                "/api/main/popular", "/api/main/recent",
                "/chatbot/ask",
                "/api/board", "/api/board/{boardId}", "/api/board/{boardId}/comments",
                "/api/board/comment/{commentId}/replies", "/api/board/{boardId}/incrementviews",
                "/api/club", "/api/club/tags", "/api/club/{clubId}/send-application",
                "/api/club/tags/{tagId}", "/api/club/search", "/api/club/{clubId}",
                "/api/weather", "/api/weather/recipe", "/api/ocr/extract-text"
            ).permitAll()

            // ✅ 타로: 로그인한 유저 또는 관리자만
            .requestMatchers("/tarot/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
            
            // ✅ 관리자 전용
            .requestMatchers("/api/admin/**","/admin/**").hasRole("ADMIN")
            .requestMatchers("/admin/**").hasAuthority("ROLE_ADMIN")

            // ✅ 인증된 사용자만 허용
            .requestMatchers(
                "/user/update", "/user/inquiries", "/user/notifications/**", "/user/**",
                "/api/recipes/{id}/favorite", "/api/recipes/review", "/api/recipes/favorite",
                "/api/userrecipes/{id}/favorites", "/api/userrecipes/favorites", "/api/userrecipes/review",
                "/api/urecipe/adduserrecipe", "/api/notifications/**"
            ).authenticated()

            // 🔒 나머지 모든 요청은 인증 필요
            .anyRequest().authenticated()

            .and()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        System.out.println("✅ Security 필터가 적용되었습니다.");
        return http.build();
    }

    // ✅ CORS 설정
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173")); // 프론트엔드 도메인
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
