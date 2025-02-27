package com.project.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminStats {
    private Long id;
    private int totalUsers;
    private int totalRecipes;
    private int totalInquiries;
    private int totalNotifications;
    private String updatedAt;
}
