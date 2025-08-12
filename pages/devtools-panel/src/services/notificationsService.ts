export type NotificationInfo = {
    id: string;
    title: string;
    body?: string;
    icon?: string;
    image?: string;
    badge?: string;
    tag?: string;
    data?: any;
    timestamp: number;
    isRead: boolean;
    isActive: boolean;
    actions?: Array<{
        action: string;
        title: string;
        icon?: string;
    }>;
    requireInteraction?: boolean;
    silent?: boolean;
    vibrate?: number[];
    dir?: 'auto' | 'ltr' | 'rtl';
    lang?: string;
    renotify?: boolean;
    sticky?: boolean;
};

export type NotificationPermission = 'default' | 'granted' | 'denied';

export type NotificationSettings = {
    permission: NotificationPermission;
    isSupported: boolean;
    canRequest: boolean;
    maxActions: number;
    maxTitleLength: number;
    maxBodyLength: number;
    maxTagLength: number;
    features: {
        actions: boolean;
        badge: boolean;
        body: boolean;
        data: boolean;
        dir: boolean;
        icon: boolean;
        image: boolean;
        lang: boolean;
        renotify: boolean;
        requireInteraction: boolean;
        silent: boolean;
        sticky: boolean;
        tag: boolean;
        vibrate: boolean;
    };
};

export class NotificationsService {
    /**
     * Get the current active tab
     */
    private static async getCurrentTab() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab.id) {
                throw new Error('No active tab found');
            }

            // Check if the tab URL is accessible
            if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
                throw new Error('Cannot access notifications for this type of page (chrome:// or chrome-extension://)');
            }

            return tab;
        } catch (error) {
            console.error('Error getting current tab:', error);
            throw new Error('Failed to get current tab. Please make sure you are on a regular website.');
        }
    }

    /**
     * Execute script in the current tab
     */
    private static async executeScript<T>(func: (...args: any[]) => T, args: any[] = []): Promise<T> {
        try {
            const tab = await this.getCurrentTab();

            // Check if we can inject scripts into this tab
            if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
                throw new Error('Cannot execute scripts on this type of page');
            }

            const result = await chrome.scripting.executeScript({
                target: { tabId: tab.id! },
                func,
                args
            });

            if (result && result[0] && result[0].result !== undefined) {
                return result[0].result as T;
            }
            throw new Error('Failed to execute script');
        } catch (error) {
            if (error instanceof Error) {
                // Check for specific Chrome extension errors
                if (error.message.includes('Cannot access contents of url')) {
                    throw new Error('Permission denied. Please make sure the extension has permission to access this website.');
                }
                if (error.message.includes('Cannot execute scripts on this type of page')) {
                    throw new Error('Cannot access notifications on this type of page (chrome://, chrome-extension://, etc.)');
                }
                throw error;
            }
            throw new Error('Failed to execute script in the current tab');
        }
    }

    /**
     * Get notification settings and capabilities
     */
    static async getNotificationSettings(): Promise<NotificationSettings> {
        try {
            return await this.executeScript(() => {
                try {
                    const isSupported = 'Notification' in window;
                    const permission = isSupported ? Notification.permission : 'denied';
                    const canRequest = isSupported && 'requestPermission' in Notification;

                    // Get notification limits (these are browser-specific)
                    const maxActions = 2; // Most browsers support 2 actions
                    const maxTitleLength = 50; // Typical limit
                    const maxBodyLength = 200; // Typical limit
                    const maxTagLength = 50; // Typical limit

                    // Check feature support
                    const features = {
                        actions: true, // Most modern browsers support actions
                        badge: true, // Most modern browsers support badge
                        body: true, // All browsers support body
                        data: true, // All browsers support data
                        dir: true, // Most modern browsers support dir
                        icon: true, // All browsers support icon
                        image: true, // Most modern browsers support image
                        lang: true, // Most modern browsers support lang
                        renotify: true, // Most modern browsers support renotify
                        requireInteraction: true, // Most modern browsers support requireInteraction
                        silent: true, // Most modern browsers support silent
                        sticky: true, // Most modern browsers support sticky
                        tag: true, // All browsers support tag
                        vibrate: true, // Most modern browsers support vibrate
                    };

                    return {
                        permission,
                        isSupported,
                        canRequest,
                        maxActions,
                        maxTitleLength,
                        maxBodyLength,
                        maxTagLength,
                        features
                    };
                } catch (error) {
                    console.error('Error getting notification settings:', error);
                    throw new Error('Failed to get notification settings');
                }
            });
        } catch (error) {
            console.error('Error fetching notification settings:', error);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Failed to fetch notification settings');
        }
    }

    /**
     * Request notification permission
     */
    static async requestNotificationPermission(): Promise<NotificationPermission> {
        try {
            return await this.executeScript(() => {
                return new Promise(async (resolve) => {
                    try {
                        if ('Notification' in window && 'requestPermission' in Notification) {
                            const permission = await Notification.requestPermission();
                            resolve(permission);
                        } else {
                            resolve('denied');
                        }
                    } catch (error) {
                        console.error('Error requesting notification permission:', error);
                        resolve('denied');
                    }
                });
            });
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Failed to request notification permission');
        }
    }

    /**
     * Send a test notification
     */
    static async sendTestNotification(options: {
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
    }): Promise<{ success: boolean; error?: string }> {
        try {
            return await this.executeScript((options) => {
                return new Promise(async (resolve) => {
                    try {
                        if (!('Notification' in window)) {
                            resolve({ success: false, error: 'Notifications not supported' });
                            return;
                        }

                        if (Notification.permission !== 'granted') {
                            resolve({ success: false, error: 'Notification permission not granted' });
                            return;
                        }

                        // Create notification options
                        const notificationOptions: NotificationOptions = {
                            body: options.body,
                            icon: options.icon,
                            image: options.image,
                            badge: options.badge,
                            tag: options.tag,
                            data: options.data,
                            requireInteraction: options.requireInteraction,
                            silent: options.silent,
                            vibrate: options.vibrate,
                            dir: options.dir,
                            lang: options.lang,
                            renotify: options.renotify,
                            sticky: options.sticky
                        };

                        // Add actions if supported and provided
                        if (options.actions && options.actions.length > 0) {
                            notificationOptions.actions = options.actions;
                        }

                        // Create and show notification
                        const notification = new Notification(options.title, notificationOptions);

                        // Set up event listeners
                        notification.onclick = () => {
                            console.log('Notification clicked');
                        };

                        notification.onshow = () => {
                            console.log('Notification shown');
                        };

                        notification.onclose = () => {
                            console.log('Notification closed');
                        };

                        notification.onerror = (error) => {
                            console.error('Notification error:', error);
                        };

                        resolve({ success: true });
                    } catch (error) {
                        console.error('Error sending test notification:', error);
                        resolve({
                            success: false,
                            error: error instanceof Error ? error.message : 'Unknown error'
                        });
                    }
                });
            }, [options]);
        } catch (error) {
            console.error('Error sending test notification:', error);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Failed to send test notification');
        }
    }

    /**
     * Get active notifications (simulated - browsers don't provide this API)
     */
    static async getActiveNotifications(): Promise<NotificationInfo[]> {
        try {
            return await this.executeScript(() => {
                try {
                    // Note: Browsers don't provide an API to get active notifications
                    // This is a simulation for demonstration purposes
                    const activeNotifications: NotificationInfo[] = [];

                    // Check if there are any notifications in the current page context
                    // This would typically be stored in the page's memory
                    if (window.notificationHistory) {
                        return window.notificationHistory.filter((n: NotificationInfo) => n.isActive);
                    }

                    return activeNotifications;
                } catch (error) {
                    console.error('Error getting active notifications:', error);
                    return [];
                }
            });
        } catch (error) {
            console.error('Error fetching active notifications:', error);
            return [];
        }
    }

    /**
     * Get notification history (simulated)
     */
    static async getNotificationHistory(): Promise<NotificationInfo[]> {
        try {
            return await this.executeScript(() => {
                try {
                    // Note: Browsers don't provide an API to get notification history
                    // This is a simulation for demonstration purposes
                    if (window.notificationHistory) {
                        return window.notificationHistory;
                    }

                    // Return sample data for demonstration
                    return [
                        {
                            id: '1',
                            title: 'Welcome to DevTools',
                            body: 'Your notification panel is ready!',
                            icon: '/icon-192.png',
                            timestamp: Date.now() - 3600000, // 1 hour ago
                            isRead: true,
                            isActive: false,
                            tag: 'welcome'
                        },
                        {
                            id: '2',
                            title: 'Test Notification',
                            body: 'This is a test notification from the DevTools panel',
                            icon: '/icon-192.png',
                            timestamp: Date.now() - 1800000, // 30 minutes ago
                            isRead: false,
                            isActive: true,
                            tag: 'test',
                            actions: [
                                { action: 'view', title: 'View' },
                                { action: 'dismiss', title: 'Dismiss' }
                            ]
                        }
                    ];
                } catch (error) {
                    console.error('Error getting notification history:', error);
                    return [];
                }
            });
        } catch (error) {
            console.error('Error fetching notification history:', error);
            return [];
        }
    }

    /**
     * Clear all notifications
     */
    static async clearAllNotifications(): Promise<{ success: boolean; error?: string }> {
        try {
            return await this.executeScript(() => {
                try {
                    // Note: Browsers don't provide an API to clear notifications
                    // This is a simulation for demonstration purposes
                    if (window.notificationHistory) {
                        window.notificationHistory = [];
                    }
                    return { success: true };
                } catch (error) {
                    console.error('Error clearing notifications:', error);
                    return {
                        success: false,
                        error: error instanceof Error ? error.message : 'Unknown error'
                    };
                }
            });
        } catch (error) {
            console.error('Error clearing notifications:', error);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Failed to clear notifications');
        }
    }

    /**
     * Mark notification as read
     */
    static async markNotificationAsRead(notificationId: string): Promise<{ success: boolean; error?: string }> {
        try {
            return await this.executeScript((notificationId) => {
                try {
                    // Note: Browsers don't provide an API to mark notifications as read
                    // This is a simulation for demonstration purposes
                    if (window.notificationHistory) {
                        const notification = window.notificationHistory.find((n: NotificationInfo) => n.id === notificationId);
                        if (notification) {
                            notification.isRead = true;
                        }
                    }
                    return { success: true };
                } catch (error) {
                    console.error('Error marking notification as read:', error);
                    return {
                        success: false,
                        error: error instanceof Error ? error.message : 'Unknown error'
                    };
                }
            }, [notificationId]);
        } catch (error) {
            console.error('Error marking notification as read:', error);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Failed to mark notification as read');
        }
    }

    /**
     * Get notification statistics
     */
    static async getNotificationStats(): Promise<{
        total: number;
        unread: number;
        active: number;
        permission: NotificationPermission;
    }> {
        try {
            const [settings, history] = await Promise.all([
                this.getNotificationSettings(),
                this.getNotificationHistory()
            ]);

            const stats = {
                total: history.length,
                unread: history.filter(n => !n.isRead).length,
                active: history.filter(n => n.isActive).length,
                permission: settings.permission
            };

            return stats;
        } catch (error) {
            console.error('Error getting notification stats:', error);
            return {
                total: 0,
                unread: 0,
                active: 0,
                permission: 'denied'
            };
        }
    }
}
