import React, { useState } from 'react';
import { useNotifications } from '../../hooks';
import { NotificationInfo } from '../../services';

function NotificationsPanel() {
  const {
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
  } = useNotifications();

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'read' | 'active'>('all');
  const [showTestForm, setShowTestForm] = useState(false);
  const [testNotification, setTestNotification] = useState({
    title: 'Test Notification',
    body: 'This is a test notification from DevTools',
    icon: '',
    image: '',
    badge: '',
    tag: 'test',
    requireInteraction: false,
    silent: false,
    renotify: false,
    sticky: false,
    dir: 'auto' as const,
    lang: 'en'
  });

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case 'granted': return 'text-green-600 dark:text-green-400';
      case 'denied': return 'text-red-600 dark:text-red-400';
      case 'default': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getPermissionBadgeColor = (permission: string) => {
    switch (permission) {
      case 'granted': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'denied': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'default': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      default: return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  const handleRequestPermission = async () => {
    try {
      await requestPermission();
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleSendTestNotification = async () => {
    try {
      await sendTestNotification(testNotification);
      setShowTestForm(false);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      try {
        await clearAllNotifications();
      } catch (error) {
        // Error is already handled in the hook
      }
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const getFilteredNotifications = () => {
    switch (selectedFilter) {
      case 'unread':
        return getNotificationsByStatus(false);
      case 'read':
        return getNotificationsByStatus(true);
      case 'active':
        return activeNotifications;
      default:
        return history;
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading notifications data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-red-600 dark:text-red-400 mb-2">Error loading notifications</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchNotificationsData}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={refreshData}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              Refresh
            </button>
            <button
              onClick={() => setShowTestForm(!showTestForm)}
              className={`px-3 py-1 text-sm rounded ${
                showTestForm 
                  ? 'bg-purple-500 text-white hover:bg-purple-600' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {showTestForm ? 'Hide Test Form' : 'Send Test'}
            </button>
            {settings?.canRequest && stats.permission !== 'granted' && (
              <button
                onClick={handleRequestPermission}
                className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
              >
                Request Permission
              </button>
            )}
            {history.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
              >
                Clear All
              </button>
            )}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {stats.total} total • {stats.unread} unread • {stats.active} active
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.unread}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Unread</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.active}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Active</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getPermissionColor(stats.permission)}`}>
              {stats.permission}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Permission</div>
          </div>
        </div>
      </div>

      {/* Test Notification Form */}
      {showTestForm && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Send Test Notification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={testNotification.title}
                onChange={(e) => setTestNotification(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Notification title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Body
              </label>
              <input
                type="text"
                value={testNotification.body}
                onChange={(e) => setTestNotification(prev => ({ ...prev, body: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Notification body"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Icon URL
              </label>
              <input
                type="text"
                value={testNotification.icon}
                onChange={(e) => setTestNotification(prev => ({ ...prev, icon: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="https://example.com/icon.png"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tag
              </label>
              <input
                type="text"
                value={testNotification.tag}
                onChange={(e) => setTestNotification(prev => ({ ...prev, tag: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="notification-tag"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={testNotification.requireInteraction}
                onChange={(e) => setTestNotification(prev => ({ ...prev, requireInteraction: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Require Interaction</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={testNotification.silent}
                onChange={(e) => setTestNotification(prev => ({ ...prev, silent: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Silent</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={testNotification.renotify}
                onChange={(e) => setTestNotification(prev => ({ ...prev, renotify: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Renotify</span>
            </label>
          </div>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={handleSendTestNotification}
              disabled={sendingNotification || !testNotification.title}
              className={`px-4 py-2 text-sm rounded ${
                sendingNotification || !testNotification.title
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {sendingNotification ? 'Sending...' : 'Send Notification'}
            </button>
            <button
              onClick={() => setShowTestForm(false)}
              className="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', name: 'All', count: history.length },
            { id: 'unread', name: 'Unread', count: stats.unread },
            { id: 'read', name: 'Read', count: stats.total - stats.unread },
            { id: 'active', name: 'Active', count: stats.active }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id as any)}
              className={`px-3 py-1 text-sm rounded ${
                selectedFilter === filter.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {filter.name} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Settings Info */}
      {settings && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
            Notification Settings
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Permission:</span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getPermissionBadgeColor(settings.permission)}`}>
                {settings.permission}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Supported:</span>
              <span className={`ml-2 ${settings.isSupported ? 'text-green-600' : 'text-red-600'}`}>
                {settings.isSupported ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Max Actions:</span>
              <span className="ml-2 text-gray-900 dark:text-gray-100">{settings.maxActions}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Max Title Length:</span>
              <span className="ml-2 text-gray-900 dark:text-gray-100">{settings.maxTitleLength}</span>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Notifications ({filteredNotifications.length})
          </h3>
          
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🔔</div>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedFilter === 'all' 
                  ? 'No notifications found' 
                  : `No ${selectedFilter} notifications found`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div key={notification.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {notification.icon && (
                        <img 
                          src={notification.icon} 
                          alt="Notification icon" 
                          className="w-8 h-8 rounded"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                          {notification.isActive && (
                            <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                              Active
                            </span>
                          )}
                        </div>
                        {notification.body && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {notification.body}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>{formatTimestamp(notification.timestamp)}</span>
                          {notification.tag && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                              {notification.tag}
                            </span>
                          )}
                        </div>
                        {notification.actions && notification.actions.length > 0 && (
                          <div className="flex space-x-2 mt-2">
                            {notification.actions.map((action, index) => (
                              <span key={index} className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                                {action.title}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationsPanel;
