package com.project.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    private Long id;
    private String receiverEmail;
    private String message;
    private Boolean isRead;
    private String createdAt;
}
