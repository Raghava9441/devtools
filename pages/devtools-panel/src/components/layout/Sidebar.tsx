import React from 'react';

type Props = {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
};

const sidebarItems = [
  {
    id: 'storage',
    label: 'Storage',
    icon: '🗄️',
    subItems: [
      { id: 'local-storage', label: 'Local Storage' },
      { id: 'session-storage', label: 'Session Storage' },
      { id: 'indexed-db', label: 'IndexedDB' },
      { id: 'web-sql', label: 'Web SQL' },
      { id: 'cookies', label: 'Cookies' },
      { id: 'cache-storage', label: 'Cache Storage' },
    ]
  },
  // {
  //   id: 'background-services',
  //   label: 'Background Services',
  //   icon: '⚙️',
  //   subItems: [
  //     { id: 'service-workers', label: 'Service Workers' },
  //     { id: 'background-sync', label: 'Background Sync' },
  //     { id: 'push-messaging', label: 'Push Messaging' },
  //   ]
  // },
  {
    id: 'manifest',
    label: 'Manifest',
    icon: '📋',
    subItems: []
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: '🔔',
    subItems: []
  },
  {
    id: 'permissions',
    label: 'Permissions',
    icon: '🔐',
    subItems: []
  },
  // {
  //   id: 'fps',
  //   label: 'FPS',
  //   icon: '📊',
  //   subItems: []
  // },
  // {
  //   id: 'lighthouse',
  //   label: 'Lighthouse',
  //   icon: '🏆',
  //   subItems: []
  // }
];

function Sidebar({ selectedTab, onTabSelect, collapsed, onToggleCollapse }: Props) {
  return (
    <div className={`bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-200 ${
      collapsed ? 'w-12' : 'w-64'
    }`}>
      {/* Collapse Toggle Button */}
      <div className="p-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={onToggleCollapse}
          className="w-full h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Sidebar Items */}
      <div className="py-2">
        {sidebarItems.map((item) => (
          <div key={item.id} className="mb-1">
            {/* Main Item */}
            <button
              onClick={() => onTabSelect(item.id)}
              className={`w-full text-left px-3 py-2 flex items-center space-x-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                selectedTab === item.id ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className="text-sm">{item.icon}</span>
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>

            {/* Sub Items */}
            {!collapsed && item.subItems.length > 0 && (
              <div className="ml-6">
                {item.subItems.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => onTabSelect(subItem.id)}
                    className={`w-full text-left px-3 py-1 text-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                      selectedTab === subItem.id ? 'bg-blue-50 dark:bg-blue-800 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {subItem.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;