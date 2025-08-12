export type PermissionInfo = {
    name: string;
    state: 'granted' | 'denied' | 'prompt' | 'unknown';
    description: string;
    category: 'media' | 'location' | 'notifications' | 'storage' | 'system' | 'other';
    icon: string;
    isSupported: boolean;
    canRequest: boolean;
};

export type PermissionRequest = {
    permission: string;
    timestamp: number;
    result: 'granted' | 'denied' | 'error';
    error?: string;
};

export class PermissionsService {
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
                throw new Error('Cannot access permissions for this type of page (chrome:// or chrome-extension://)');
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
                    throw new Error('Cannot access permissions on this type of page (chrome://, chrome-extension://, etc.)');
                }
                throw error;
            }
            throw new Error('Failed to execute script in the current tab');
        }
    }

    /**
     * Get all available permissions with their current states
     */
    static async getPermissionsData(): Promise<PermissionInfo[]> {
        try {
            return await this.executeScript(() => {
                try {
                    const permissions: PermissionInfo[] = [
                        // Media Permissions
                        {
                            name: 'camera',
                            state: 'unknown',
                            description: 'Access to camera for video calls and photo capture',
                            category: 'media',
                            icon: '📷',
                            isSupported: 'mediaDevices' in navigator,
                            canRequest: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices
                        },
                        {
                            name: 'microphone',
                            state: 'unknown',
                            description: 'Access to microphone for audio recording and calls',
                            category: 'media',
                            icon: '🎤',
                            isSupported: 'mediaDevices' in navigator,
                            canRequest: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices
                        },
                        {
                            name: 'speaker',
                            state: 'unknown',
                            description: 'Access to speakers for audio playback',
                            category: 'media',
                            icon: '🔊',
                            isSupported: 'mediaDevices' in navigator,
                            canRequest: false
                        },

                        // Location Permissions
                        {
                            name: 'geolocation',
                            state: 'unknown',
                            description: 'Access to device location for maps and location-based services',
                            category: 'location',
                            icon: '📍',
                            isSupported: 'geolocation' in navigator,
                            canRequest: 'geolocation' in navigator && 'getCurrentPosition' in navigator.geolocation
                        },

                        // Notification Permissions
                        {
                            name: 'notifications',
                            state: 'unknown',
                            description: 'Send push notifications to the user',
                            category: 'notifications',
                            icon: '🔔',
                            isSupported: 'Notification' in window,
                            canRequest: 'Notification' in window && 'requestPermission' in Notification
                        },

                        // Storage Permissions
                        {
                            name: 'persistent-storage',
                            state: 'unknown',
                            description: 'Persistent storage for offline data',
                            category: 'storage',
                            icon: '💾',
                            isSupported: 'storage' in navigator && 'persist' in navigator.storage,
                            canRequest: 'storage' in navigator && 'persist' in navigator.storage
                        },

                        // System Permissions
                        {
                            name: 'clipboard-read',
                            state: 'unknown',
                            description: 'Read data from clipboard',
                            category: 'system',
                            icon: '📋',
                            isSupported: 'clipboard' in navigator && 'read' in navigator.clipboard,
                            canRequest: 'clipboard' in navigator && 'read' in navigator.clipboard
                        },
                        {
                            name: 'clipboard-write',
                            state: 'unknown',
                            description: 'Write data to clipboard',
                            category: 'system',
                            icon: '📋',
                            isSupported: 'clipboard' in navigator && 'write' in navigator.clipboard,
                            canRequest: 'clipboard' in navigator && 'write' in navigator.clipboard
                        },
                        {
                            name: 'fullscreen',
                            state: 'unknown',
                            description: 'Enter fullscreen mode',
                            category: 'system',
                            icon: '🖥️',
                            isSupported: 'fullscreenEnabled' in document || 'webkitFullscreenEnabled' in document,
                            canRequest: 'requestFullscreen' in document || 'webkitRequestFullscreen' in document
                        },

                        // Other Permissions
                        {
                            name: 'midi',
                            state: 'unknown',
                            description: 'Access to MIDI devices',
                            category: 'other',
                            icon: '🎹',
                            isSupported: 'requestMIDIAccess' in navigator,
                            canRequest: 'requestMIDIAccess' in navigator
                        },
                        {
                            name: 'payment',
                            state: 'unknown',
                            description: 'Process payments',
                            category: 'other',
                            icon: '💳',
                            isSupported: 'PaymentRequest' in window,
                            canRequest: 'PaymentRequest' in window
                        },
                        {
                            name: 'background-sync',
                            state: 'unknown',
                            description: 'Background synchronization',
                            category: 'other',
                            icon: '🔄',
                            isSupported: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration?.prototype,
                            canRequest: false
                        }
                    ];

                    // Check current permission states
                    return Promise.all(permissions.map(async (permission) => {
                        try {
                            switch (permission.name) {
                                case 'camera':
                                case 'microphone':
                                    if (permission.isSupported) {
                                        try {
                                            const stream = await navigator.mediaDevices.getUserMedia({
                                                [permission.name === 'camera' ? 'video' : 'audio']: true
                                            });
                                            stream.getTracks().forEach(track => track.stop());
                                            permission.state = 'granted';
                                        } catch (error) {
                                            permission.state = error instanceof Error && error.name === 'NotAllowedError' ? 'denied' : 'prompt';
                                        }
                                    }
                                    break;

                                case 'geolocation':
                                    if (permission.isSupported) {
                                        try {
                                            await new Promise((resolve, reject) => {
                                                navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 1000 });
                                            });
                                            permission.state = 'granted';
                                        } catch (error) {
                                            permission.state = error instanceof Error && error.code === 1 ? 'denied' : 'prompt';
                                        }
                                    }
                                    break;

                                case 'notifications':
                                    if (permission.isSupported) {
                                        permission.state = Notification.permission;
                                    }
                                    break;

                                case 'persistent-storage':
                                    if (permission.isSupported) {
                                        try {
                                            const isPersisted = await navigator.storage.persist();
                                            permission.state = isPersisted ? 'granted' : 'denied';
                                        } catch (error) {
                                            permission.state = 'unknown';
                                        }
                                    }
                                    break;

                                case 'clipboard-read':
                                case 'clipboard-write':
                                    if (permission.isSupported) {
                                        try {
                                            if (permission.name === 'clipboard-read') {
                                                await navigator.clipboard.readText();
                                            } else {
                                                await navigator.clipboard.writeText('test');
                                            }
                                            permission.state = 'granted';
                                        } catch (error) {
                                            permission.state = error instanceof Error && error.name === 'NotAllowedError' ? 'denied' : 'prompt';
                                        }
                                    }
                                    break;

                                case 'fullscreen':
                                    if (permission.isSupported) {
                                        permission.state = (document.fullscreenEnabled || (document as any).webkitFullscreenEnabled) ? 'granted' : 'denied';
                                    }
                                    break;

                                default:
                                    permission.state = 'unknown';
                            }
                        } catch (error) {
                            permission.state = 'unknown';
                        }
                        return permission;
                    }));
                } catch (error) {
                    console.error('Error checking permissions:', error);
                    throw new Error('Failed to check permissions on this page');
                }
            });
        } catch (error) {
            console.error('Error fetching permissions:', error);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Failed to fetch permissions data');
        }
    }

    /**
     * Request a specific permission
     */
    static async requestPermission(permissionName: string): Promise<PermissionRequest> {
        try {
            return await this.executeScript((permissionName: string) => {
                return new Promise(async (resolve) => {
                    try {
                        let result: 'granted' | 'denied' | 'error' = 'error';
                        let error: string | undefined;

                        switch (permissionName) {
                            case 'camera':
                                try {
                                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                                    stream.getTracks().forEach(track => track.stop());
                                    result = 'granted';
                                } catch (err) {
                                    result = err instanceof Error && err.name === 'NotAllowedError' ? 'denied' : 'error';
                                    error = err instanceof Error ? err.message : 'Unknown error';
                                }
                                break;

                            case 'microphone':
                                try {
                                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                                    stream.getTracks().forEach(track => track.stop());
                                    result = 'granted';
                                } catch (err) {
                                    result = err instanceof Error && err.name === 'NotAllowedError' ? 'denied' : 'error';
                                    error = err instanceof Error ? err.message : 'Unknown error';
                                }
                                break;

                            case 'geolocation':
                                try {
                                    await new Promise((resolve, reject) => {
                                        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
                                    });
                                    result = 'granted';
                                } catch (err) {
                                    result = err instanceof Error && (err as any).code === 1 ? 'denied' : 'error';
                                    error = err instanceof Error ? err.message : 'Unknown error';
                                }
                                break;

                            case 'notifications':
                                try {
                                    const permission = await Notification.requestPermission();
                                    result = permission === 'granted' ? 'granted' : 'denied';
                                } catch (err) {
                                    result = 'error';
                                    error = err instanceof Error ? err.message : 'Unknown error';
                                }
                                break;

                            case 'persistent-storage':
                                try {
                                    const isPersisted = await navigator.storage.persist();
                                    result = isPersisted ? 'granted' : 'denied';
                                } catch (err) {
                                    result = 'error';
                                    error = err instanceof Error ? err.message : 'Unknown error';
                                }
                                break;

                            case 'clipboard-read':
                                try {
                                    await navigator.clipboard.readText();
                                    result = 'granted';
                                } catch (err) {
                                    result = err instanceof Error && err.name === 'NotAllowedError' ? 'denied' : 'error';
                                    error = err instanceof Error ? err.message : 'Unknown error';
                                }
                                break;

                            case 'clipboard-write':
                                try {
                                    await navigator.clipboard.writeText('Permission test');
                                    result = 'granted';
                                } catch (err) {
                                    result = err instanceof Error && err.name === 'NotAllowedError' ? 'denied' : 'error';
                                    error = err instanceof Error ? err.message : 'Unknown error';
                                }
                                break;

                            case 'fullscreen':
                                try {
                                    if (document.requestFullscreen) {
                                        await document.requestFullscreen();
                                        await document.exitFullscreen();
                                    } else if ((document as any).webkitRequestFullscreen) {
                                        await (document as any).webkitRequestFullscreen();
                                        await (document as any).webkitExitFullscreen();
                                    }
                                    result = 'granted';
                                } catch (err) {
                                    result = err instanceof Error && err.name === 'NotAllowedError' ? 'denied' : 'error';
                                    error = err instanceof Error ? err.message : 'Unknown error';
                                }
                                break;

                            default:
                                result = 'error';
                                error = 'Permission not supported for requesting';
                        }

                        resolve({
                            permission: permissionName,
                            timestamp: Date.now(),
                            result,
                            error
                        });
                    } catch (err) {
                        resolve({
                            permission: permissionName,
                            timestamp: Date.now(),
                            result: 'error',
                            error: err instanceof Error ? err.message : 'Unknown error'
                        });
                    }
                });
            }, [permissionName]);
        } catch (error) {
            console.error('Error requesting permission:', error);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Failed to request permission');
        }
    }

    /**
     * Get permission history (simulated for demo)
     */
    static async getPermissionHistory(): Promise<PermissionRequest[]> {
        // This would typically come from a database or storage
        // For now, we'll return an empty array
        return [];
    }

    /**
     * Get permission statistics
     */
    static async getPermissionStats(): Promise<{
        total: number;
        granted: number;
        denied: number;
        prompt: number;
        unknown: number;
    }> {
        try {
            const permissions = await this.getPermissionsData();
            const stats = {
                total: permissions.length,
                granted: permissions.filter(p => p.state === 'granted').length,
                denied: permissions.filter(p => p.state === 'denied').length,
                prompt: permissions.filter(p => p.state === 'prompt').length,
                unknown: permissions.filter(p => p.state === 'unknown').length,
            };
            return stats;
        } catch (error) {
            console.error('Error getting permission stats:', error);
            return {
                total: 0,
                granted: 0,
                denied: 0,
                prompt: 0,
                unknown: 0,
            };
        }
    }
}
