package com.project.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Recipe {
    private Long id;
    private String userEmail;
    private String name;
    private String description;
    private String imageUrl;
    private String recipeUrl;
    private String category; // "한식", "중식", "양식", "일식"
    private String createdAt;
}
