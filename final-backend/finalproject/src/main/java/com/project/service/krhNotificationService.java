package com.project.service;

import org.springframework.stereotype.Service;

import com.project.model.Notification;

@Service
public interface krhNotificationService {
	void insertNotification(Notification notification);
}