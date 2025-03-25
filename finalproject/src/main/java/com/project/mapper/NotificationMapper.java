package com.project.mapper;

import com.project.model.Notification;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface NotificationMapper {

    // 🔹 특정 유저 또는 관리자에게 알림 전송
    @Insert("INSERT INTO notifications (receiver_email, message, is_read, created_at) " +
            "VALUES (#{receiverEmail}, #{message}, FALSE, NOW())")
    void sendNotification(Notification notification);

    // 🔹 알림 읽음 처리
    @Update("UPDATE notifications SET is_read = TRUE WHERE id = #{notificationId}")
    void markNotificationAsRead(@Param("notificationId") Long notificationId);

    // 🔹 알림 삭제
    @Delete("DELETE FROM notifications WHERE id = #{notificationId}")
    void deleteNotification(@Param("notificationId") Long notificationId);
    
    @Select("""
            SELECT * FROM notifications
            WHERE receiver_email = #{email}
            AND is_read = false
            AND message LIKE '[관리자]%'
        """)
        List<Notification> selectUnreadAdminNotifications(@Param("email") String email);
   
    @Select("""
    	    SELECT * FROM notifications
    	    WHERE user_id = #{userId}
    	      AND is_read = false
    	      AND message LIKE '[관리자]%'
    	""")
    	List<Notification> findUnreadAdminNotifications(@Param("userId") Long userId);

}

