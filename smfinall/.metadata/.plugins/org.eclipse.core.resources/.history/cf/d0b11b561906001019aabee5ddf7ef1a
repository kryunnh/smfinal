package com.project.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.project.config.JwtUtil;
import com.project.mapper.InquiryMapper;
import com.project.mapper.UserMapper;
import com.project.model.Inquiry;
import com.project.model.Notification;
import com.project.model.Post;
import com.project.model.Recipes;
import com.project.model.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final InquiryMapper inquiryMapper;
    // 🔹 이메일 인증 코드 저장
    private final Map<String, String> verificationCodes = new HashMap<>(); // 🔹 이메일-코드 저장
    private final EmailService emailService;
    
    
    // ✅ 회원가입 시 이메일 인증 코드 발송
    public void sendVerificationEmail(String email) {
        // 6자리 랜덤 인증 코드 생성
        String verificationCode = String.format("%06d", new Random().nextInt(1000000));

        // 인증 코드 저장
        verificationCodes.put(email, verificationCode);

        // 이메일 전송
        emailService.sendEmail(email, "회원가입 이메일 인증", "인증 코드: " + verificationCode);
    }

    // ✅ 이메일 인증 코드 확인 후 최종 회원가입
    public void confirmEmailAndRegister(String email, String verificationCode, String password, String name, String phoneNumber, String profileImage) {
        // 🔹 이메일 중복 확인
        if (userMapper.getUserByEmail(email) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 등록된 이메일입니다.");
        }

        // 🔹 인증 코드 검증
        String storedCode = verificationCodes.get(email);
        if (storedCode == null || !storedCode.equals(verificationCode)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "인증 코드가 올바르지 않습니다.");
        }

        // 🔹 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(password);

        // 🔹 새로운 유저 객체 생성 (isVerified = true 설정)
        User newUser = new User(email, encodedPassword, name, phoneNumber, profileImage);
        newUser.setVerified(true);  // ✅ 이메일 인증 완료 후 isVerified = true 설정

        userMapper.registerUser(newUser); // DB에 저장

        // 🔹 인증 코드 삭제
        verificationCodes.remove(email);
    }


    // 🔹 기존 회원가입 (이메일 인증 후 최종 가입 시 사용)
    public void registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userMapper.registerUser(user);
    }

    // ✅ 1. 🔹 이름과 휴대폰 번호로 아이디(이메일) 찾기 (변경)
    public String findUserIdByNameAndPhone(String name, String phoneNumber) {
        String userEmail = userMapper.findEmailByNameAndPhone(name, phoneNumber);
        if (userEmail == null) {
            throw new IllegalArgumentException("입력한 정보와 일치하는 계정이 없습니다.");
        }
        return userEmail;
    }

 // ✅ 2. 🔹 비밀번호 찾기: 이메일 인증 코드 전송 (이메일 + 휴대폰 번호 확인)
    public void sendVerificationCode(String email, String phoneNumber) {
        if (userMapper.countUserByEmailAndPhone(email, phoneNumber) == 0) {
            throw new IllegalArgumentException("해당 이메일과 휴대폰 번호가 일치하는 사용자가 존재하지 않습니다.");
        }
        
        String verificationCode = emailService.generateVerificationCode();
        
        // 🔹 인증 코드 저장 (하나의 맵으로 통일)
        verificationCodes.put(email, verificationCode);
        
        emailService.sendVerificationCode(email, verificationCode);
    }

    // ✅ 3. 🔹 비밀번호 변경 (이메일 + 휴대폰 번호 확인 후)
    public void resetPassword(String email, String phoneNumber, String verificationCode, String newPassword) {
        // 🔹 저장된 인증 코드 가져오기
        String storedCode = verificationCodes.get(email);

        if (storedCode == null || !storedCode.equals(verificationCode)) {
            throw new IllegalArgumentException("인증 코드가 올바르지 않습니다.");
        }

        // 🔹 비밀번호 변경 (해싱 적용 필요)
        String hashedPassword = passwordEncoder.encode(newPassword);
        
        // ✅ 매퍼의 updatePassword 메서드 호출 (매개변수 순서 확인)
        userMapper.updatePassword(email, phoneNumber, hashedPassword);

        // 🔹 인증 코드 삭제 (1회 사용 후 만료)
        verificationCodes.remove(email);
    }


    // 이메일과 비밀번호로 유저 검증
    public User validateUser(String email, String password) {
        User user = userMapper.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "유저를 찾을 수 없습니다."));
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "비밀번호가 일치하지 않습니다.");
        }
        return user;
    }

  

    public String login(String email, String rawPassword) {
        User user = userMapper.getUserByEmail(email);
        if (user == null || !passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }

        String role = user.getRole();  // 🔹 DB에서 role 가져오기

        return jwtUtil.generateToken(user.getEmail(), role);  // ✅ role 포함
    }




    public User getUserByEmail(String email) {
        System.out.println("🔍 유저 이메일 조회 요청: " + email);
        User user = userMapper.getUserByEmail(email);
        System.out.println("🔍 조회된 유저 정보: " + user);
        return user;
    }


    // 🔹 (본인) 유저 정보 수정
    @Transactional
    public void updateUser(User user) {
        System.out.println("🔍 유저 정보 수정 요청: " + user);
        
        int updatedRows = userMapper.updateUser(user);
        System.out.println("✅ 업데이트된 행 수: " + updatedRows);
        
        if (updatedRows == 0) {
            System.out.println("⚠️ 업데이트된 데이터 없음!");
        }
    }
    public void insertPost(Post post) {
        userMapper.insertPost(post);
    }

    public List<Post> getUserPosts(String email) {
        return userMapper.getUserPosts(email);
    }


    // 🔹 회원탈퇴 요청 저장
    public void requestAccountDeletion(String email, String reason) {
        userMapper.requestAccountDeletion(email, reason);
    }

    // 🔹 (본인) 유저 알림 목록 조회
    public List<Notification> getUserNotifications(String email) {
        return userMapper.getUserNotifications(email);
    }

    // 🔹 (본인) 유저 알림 읽음 처리
    public void markUserNotificationAsRead(Long notificationId, String email) {
        userMapper.markUserNotificationAsRead(notificationId, email);
    }

    // 🔹 관심 레시피 조회
    public List<Recipes> getWishlist(String email) {
        return userMapper.getWishlist(email);
    }

    // 🔹 관심 레시피 삭제
    public boolean removeWishlist(Long id, String email) {
        int deletedRows = userMapper.deleteWishlistItem(id, email);
        return deletedRows > 0;  // 삭제된 행 개수를 기준으로 성공 여부 반환
    }


    // 🔹 1:1 문의 등록
    public void insertInquiry(Inquiry inquiry) {
        userMapper.insertInquiry(inquiry);
    }

 // 🔹 로그인한 사용자의 문의 목록 조회
    public List<Inquiry> getUserInquiries(String email) {
        return inquiryMapper.getUserInquiries(email);
    }

    // 🔹 로그인한 사용자가 특정 문의 삭제
    public void deleteInquiry(Long id, String email) {
        Inquiry inquiry = inquiryMapper.findById(id);

        if (inquiry == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "문의가 존재하지 않습니다.");
        }

        // **이메일 비교 불필요 -> JWT에서 추출한 이메일과 동일한 데이터만 조회**
        inquiryMapper.deleteInquiry(id);
    }
    
    // 즐찾 용
    public User findByUserEmail(String email) {
        return userMapper.findByUsername(email); // 사용자 이름으로 사용자 정보를 검색
    }
    
}