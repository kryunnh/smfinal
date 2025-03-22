package com.project.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminContest {
    private Long id;
    private String adminEmail;
    private String title;
    private String description;
    private String status; // "PENDING", "APPROVED", "REJECTED"
    private String createdAt;
}