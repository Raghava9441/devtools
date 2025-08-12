import React from 'react';
import LocalStoragePanel from './storage/LocalStorage/LocalStoragePanel';
import SessionStoragePanel from './storage/SessionStorage/SessionStoragePanel';
import CookiesPanel from './storage/Cookies/CookiesPanel';
import ManifestPanel from './ManifestPanel';
import PermissionsPanel from './security/PermissionsPanel';
import NotificationsPanel from './security/NotificationsPanel';

type Props = {
  selectedTab: string;
};

function ContentRouter({ selectedTab }: Props) {
  const renderContent = () => {
    switch (selectedTab) {
      case 'local-storage':
        return <LocalStoragePanel />;
      case 'session-storage':
        return <SessionStoragePanel />;
      case 'cookies':
        return <CookiesPanel />;
      case 'manifest':
        return <ManifestPanel />;
      case 'indexed-db':
        return <div className="p-4 text-gray-600 dark:text-gray-400">IndexedDB Panel</div>;
      case 'web-sql':
        return <div className="p-4 text-gray-600 dark:text-gray-400">Web SQL Panel</div>;
      case 'cache-storage':
        return <div className="p-4 text-gray-600 dark:text-gray-400">Cache Storage Panel</div>;
      case 'service-workers':
        return <div className="p-4 text-gray-600 dark:text-gray-400">Service Workers Panel</div>;
      case 'background-sync':
        return <div className="p-4 text-gray-600 dark:text-gray-400">Background Sync Panel</div>;
      case 'push-messaging':
        return <div className="p-4 text-gray-600 dark:text-gray-400">Push Messaging Panel</div>;
      case 'notifications':
        return <NotificationsPanel />;
      case 'permissions':
        return <PermissionsPanel />;
      case 'fps':
        return <div className="p-4 text-gray-600 dark:text-gray-400">FPS Panel</div>;
      case 'lighthouse':
        return <div className="p-4 text-gray-600 dark:text-gray-400">Lighthouse Panel</div>;
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <div className="text-6xl mb-4">🗄️</div>
              <h2 className="text-xl font-medium mb-2">Storage</h2>
              <p className="text-sm">Select a storage type from the sidebar to get started</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full">
      {renderContent()}
    </div>
  );
}

export default ContentRouter;
