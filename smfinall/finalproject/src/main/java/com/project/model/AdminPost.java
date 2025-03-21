package com.project.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminPost {
    private Long id;
    private String adminEmail;
    private String title;
    private String content;
    private String createdAt;
}