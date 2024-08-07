package com.TorneosExpress.service;

import com.TorneosExpress.model.Notification;
import com.TorneosExpress.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByToIdAndReadFalse(userId);
    }

    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElseThrow();
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    public Notification createNotification(Long toId, String message) {
        Notification notification = new Notification(toId, message);
        return notificationRepository.save(notification);
    }

    public List<Notification> getActiveNotificationsForUser(Long userId) {
        return notificationRepository.findByToIdAndReadFalse(userId);
    }

    public List<Notification> getNotificationsToUser(Long userId) {
        return notificationRepository.findByToId(userId);
    }

    public void markNotificationsAsRead(Long userId) {
        notificationRepository.markAllAsReadByToId(userId);
    }
}
