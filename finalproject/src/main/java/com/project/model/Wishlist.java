package com.project.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Wishlist {
    private Long id;
    private String userEmail;
    private Long recipeId;
    private String createdAt;
}
