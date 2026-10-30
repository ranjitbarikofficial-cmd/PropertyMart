
package com.propertymart.propertymart.controller;

import com.propertymart.propertymart.entity.Notification;
import com.propertymart.propertymart.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notification")
@CrossOrigin(
        origins = "http://localhost:4200",
        allowCredentials = "true"
)
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getNotifications(
            @PathVariable Long userId) {

        List<Map<String, Object>> notifications =
                notificationService.getUserNotifications(userId)
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread/{userId}")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                Map.of(
                        "count",
                        notificationService.getUnreadCount(userId)
                )
        );
    }

    @PutMapping("/read/{notificationId}/{userId}")
    public ResponseEntity<Map<String, String>> markAsRead(
            @PathVariable Long notificationId,
            @PathVariable Long userId) {

        boolean updated = notificationService.markAsRead(
                notificationId,
                userId
        );

        if (!updated) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(
                Map.of("message", "Notification marked as read")
        );
    }

    @PutMapping("/read-all/{userId}")
    public ResponseEntity<Map<String, Integer>> markAllAsRead(
            @PathVariable Long userId) {

        int updated = notificationService.markAllAsRead(userId);

        return ResponseEntity.ok(Map.of("updated", updated));
    }

    private Map<String, Object> toResponse(Notification notification) {
        Map<String, Object> response = new LinkedHashMap<>();

        response.put("id", notification.getId());
        response.put("title", notification.getTitle());
        response.put("message", notification.getMessage());
        response.put("type", notification.getType());
        response.put("read", notification.isRead());
        response.put("createdAt", notification.getCreatedAt());

        return response;
    }
}
