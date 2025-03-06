package com.project.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Long id;
    private String email;
    private String password;
    private String name;
    private String phoneNumber;
    private String profileImage;
    private String role = "USER";
    private boolean isVerified;

    // ✅ 추가할 생성자 (에러 해결)
    public User(String email, String password, String name, String phoneNumber, String profileImage) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.profileImage = profileImage;
        this.role = "USER";
        this.isVerified = false;
    }
}