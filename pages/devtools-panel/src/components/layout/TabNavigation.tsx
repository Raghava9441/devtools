import React from 'react';

type Props = {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
};

function TabNavigation({ selectedTab, onTabSelect }: Props) {
  const getTabLabel = (tabId: string) => {
    const tabMap: { [key: string]: string } = {
      'local-storage': 'Local Storage',
      'session-storage': 'Session Storage',
      'indexed-db': 'IndexedDB',
      'web-sql': 'Web SQL',
      'cookies': 'Cookies',
      'cache-storage': 'Cache Storage',
      'service-workers': 'Service Workers',
      'background-sync': 'Background Sync',
      'push-messaging': 'Push Messaging',
      'manifest': 'Manifest',
      'notifications': 'Notifications',
      'permissions': 'Permissions',
      'fps': 'FPS',
      'lighthouse': 'Lighthouse',
      'storage': 'Storage',
      'background-services': 'Background Services'
    };
    return tabMap[tabId] || tabId;
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center px-4">
        <div className="flex space-x-1">
          <button
            onClick={() => onTabSelect(selectedTab)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              selectedTab === selectedTab
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-b-2 border-blue-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            {getTabLabel(selectedTab)}
          </button>
        </div>
        
        {/* Tab Actions */}
        <div className="ml-auto flex items-center space-x-2">
          {/* Add/Remove Tab Button */}
          <button
            className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            title="Add tab"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          
          {/* Close Tab Button */}
          <button
            className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            title="Close tab"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TabNavigation;