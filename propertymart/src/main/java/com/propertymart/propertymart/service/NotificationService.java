
package com.propertymart.propertymart.service;

import com.propertymart.propertymart.entity.Notification;
import com.propertymart.propertymart.entity.User;
import com.propertymart.propertymart.repository.NotificationRepo;
import com.propertymart.propertymart.repository.UserRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepo notificationRepo;
    private final UserRepo userRepo;

    public NotificationService(
            NotificationRepo notificationRepo,
            UserRepo userRepo) {
        this.notificationRepo = notificationRepo;
        this.userRepo = userRepo;
    }

    public Notification createNotification(
            Long recipientId,
            String title,
            String message,
            String type) {

        User recipient = userRepo.findById(recipientId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Notification recipient not found."));

        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRead(false);

        return notificationRepo.save(notification);
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepo.findByRecipientIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepo.countByRecipientIdAndIsReadFalse(userId);
    }

    @Transactional
    public boolean markAsRead(Long notificationId, Long userId) {
        return notificationRepo.findById(notificationId)
                .filter(notification ->
                        notification.getRecipient().getId().equals(userId))
                .map(notification -> {
                    notification.setRead(true);
                    return true;
                })
                .orElse(false);
    }

    @Transactional
    public int markAllAsRead(Long userId) {
        List<Notification> notifications =
                notificationRepo.findByRecipientIdOrderByCreatedAtDesc(userId);

        int updated = 0;

        for (Notification notification : notifications) {
            if (!notification.isRead()) {
                notification.setRead(true);
                updated++;
            }
        }

        return updated;
    }
}
