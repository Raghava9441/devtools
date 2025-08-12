import { useState, useEffect, useCallback } from 'react';
import { NotificationsService, NotificationInfo, NotificationSettings, NotificationPermission } from '../services/notificationsService';

export const useNotifications = () => {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [history, setHistory] = useState<NotificationInfo[]>([]);
  const [activeNotifications, setActiveNotifications] = useState<NotificationInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    total: number;
    unread: number;
    active: number;
    permission: NotificationPermission;
  }>({
    total: 0,
    unread: 0,
    active: 0,
    permission: 'denied'
  });
  const [sendingNotification, setSendingNotification] = useState(false);

  // Function to fetch all notifications data
  const fetchNotificationsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [settingsData, historyData, activeData, statsData] = await Promise.all([
        NotificationsService.getNotificationSettings(),
        NotificationsService.getNotificationHistory(),
        NotificationsService.getActiveNotifications(),
        NotificationsService.getNotificationStats()
      ]);

      setSettings(settingsData);
      setHistory(historyData);
      setActiveNotifications(activeData);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications data');
      setSettings(null);
      setHistory([]);
      setActiveNotifications([]);
      setStats({
        total: 0,
        unread: 0,
        active: 0,
        permission: 'denied'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to request notification permission
  const requestPermission = useCallback(async () => {
    try {
      setError(null);
      const permission = await NotificationsService.requestNotificationPermission();
      
      // Refresh settings to get updated permission
      const updatedSettings = await NotificationsService.getNotificationSettings();
      setSettings(updatedSettings);
      
      // Update stats
      const updatedStats = await NotificationsService.getNotificationStats();
      setStats(updatedStats);
      
      return permission;
    } catch (err) {
      console.error('Error requesting permission:', err);
      setError(err instanceof Error ? err.message : 'Failed to request notification permission');
      throw err;
    }
  }, []);

  // Function to send test notification
  const sendTestNotification = useCallback(async (options: {
    title: string;
    body?: string;
    icon?: string;
    image?: string;
    badge?: string;
    tag?: string;
    data?: any;
    actions?: Array<{ action: string; title: string; icon?: string }>;
    requireInteraction?: boolean;
    silent?: boolean;
    vibrate?: number[];
    dir?: 'auto' | 'ltr' | 'rtl';
    lang?: string;
    renotify?: boolean;
    sticky?: boolean;
  }) => {
    try {
      setSendingNotification(true);
      setError(null);

      const result = await NotificationsService.sendTestNotification(options);
      
      if (result.success) {
        // Refresh data to show the new notification
        await fetchNotificationsData();
      } else {
        setError(result.error || 'Failed to send notification');
      }
      
      return result;
    } catch (err) {
      console.error('Error sending test notification:', err);
      setError(err instanceof Error ? err.message : 'Failed to send test notification');
      throw err;
    } finally {
      setSendingNotification(false);
    }
  }, [fetchNotificationsData]);

  // Function to clear all notifications
  const clearAllNotifications = useCallback(async () => {
    try {
      setError(null);
      const result = await NotificationsService.clearAllNotifications();
      
      if (result.success) {
        setHistory([]);
        setActiveNotifications([]);
        setStats(prev => ({
          ...prev,
          total: 0,
          unread: 0,
          active: 0
        }));
      } else {
        setError(result.error || 'Failed to clear notifications');
      }
      
      return result;
    } catch (err) {
      console.error('Error clearing notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to clear notifications');
      throw err;
    }
  }, []);

  // Function to mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      setError(null);
      const result = await NotificationsService.markNotificationAsRead(notificationId);
      
      if (result.success) {
        // Update local state
        setHistory(prev => prev.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        ));
        
        // Update stats
        setStats(prev => ({
          ...prev,
          unread: Math.max(0, prev.unread - 1)
        }));
      } else {
        setError(result.error || 'Failed to mark notification as read');
      }
      
      return result;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError(err instanceof Error ? err.message : 'Failed to mark notification as read');
      throw err;
    }
  }, []);

  // Function to get notifications by status
  const getNotificationsByStatus = useCallback((isRead: boolean) => {
    return history.filter(n => n.isRead === isRead);
  }, [history]);

  // Function to get notifications by tag
  const getNotificationsByTag = useCallback((tag: string) => {
    return history.filter(n => n.tag === tag);
  }, [history]);

  // Function to refresh all data
  const refreshData = useCallback(async () => {
    await fetchNotificationsData();
  }, [fetchNotificationsData]);

  // Load data on component mount
  useEffect(() => {
    fetchNotificationsData();
  }, [fetchNotificationsData]);

  return {
    settings,
    history,
    activeNotifications,
    loading,
    error,
    stats,
    sendingNotification,
    fetchNotificationsData,
    requestPermission,
    sendTestNotification,
    clearAllNotifications,
    markAsRead,
    getNotificationsByStatus,
    getNotificationsByTag,
    refreshData
  };
};
