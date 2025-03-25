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
            .cors().configurationSource(corsConfigurationSource()) // ✅ CORS 설정 추가
            .and()
            .csrf().disable()  // ✅ CSRF 비활성화 (PUT, DELETE 요청 허용)
            .authorizeHttpRequests()
            .requestMatchers("/api/uploads/**").permitAll()  // ✅ 수정
            // 🔹 회원 관련 API 허용
            .requestMatchers(HttpMethod.GET, "/user/get-hashed-password").permitAll()
            .requestMatchers("/user/login", "/user/register", "/user/find-id",  
                    "/user/send-verification-code", "/user/reset-password", 
                    "/user/verify-email", "/user/confirm-email", "/user/check-email", "/user/check-phone").permitAll()

            // 🔹 관리자 페이지 보호 (hasRole 사용)
            .requestMatchers("/admin/**").hasAuthority("ROLE_ADMIN")

            // 🔹 사용자 인증 필요 API
            .requestMatchers("/user/update", "/user/inquiries", "/user/notifications/**", "/user/**").authenticated()
         // 🔹 타로 카드 API는 USER, ADMIN 모두 허용
            .requestMatchers("/tarot/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")

            // ✅ 🔥 `/uploads/**` 경로 모든 사용자 허용 (프로필 이미지, 레시피 이미지 접근 가능)
            .requestMatchers("/uploads/**").permitAll()

            // 🔹 그 외 요청은 인증 필요
            .anyRequest().authenticated()
            
            .and()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        System.out.println("✅ Security 필터가 적용되었습니다.");
        return http.build();
    }

    // ✅ 🔥 CORS 설정 추가 (프론트엔드 PUT 요청 포함 허용)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173")); // 프론트엔드 주소
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("Authorization", "Content-Type")); // ✅ 프론트엔드에서 토큰 접근 허용
        configuration.setAllowCredentials(true); // 인증 포함 허용

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
