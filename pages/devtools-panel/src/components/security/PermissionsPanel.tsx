import React, { useState } from 'react';
import { usePermissions } from '../../hooks';
import { PermissionInfo } from '../../services';

function PermissionsPanel() {
  const {
    permissions,
    loading,
    error,
    stats,
    history,
    requestingPermission,
    fetchPermissionsData,
    requestPermission,
    getPermissionsByCategory,
    getPermissionsByState,
    refreshData
  } = usePermissions();

  const [selectedCategory, setSelectedCategory] = useState<PermissionInfo['category'] | 'all'>('all');
  const [selectedState, setSelectedState] = useState<PermissionInfo['state'] | 'all'>('all');
  const [showHistory, setShowHistory] = useState(false);

  const categories = [
    { id: 'all', name: 'All Categories', icon: '📋' },
    { id: 'media', name: 'Media', icon: '🎥' },
    { id: 'location', name: 'Location', icon: '📍' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'storage', name: 'Storage', icon: '💾' },
    { id: 'system', name: 'System', icon: '⚙️' },
    { id: 'other', name: 'Other', icon: '🔧' }
  ];

  const states = [
    { id: 'all', name: 'All States', color: 'gray' },
    { id: 'granted', name: 'Granted', color: 'green' },
    { id: 'denied', name: 'Denied', color: 'red' },
    { id: 'prompt', name: 'Prompt', color: 'yellow' },
    { id: 'unknown', name: 'Unknown', color: 'gray' }
  ];

  const getStateColor = (state: PermissionInfo['state']) => {
    switch (state) {
      case 'granted': return 'text-green-600 dark:text-green-400';
      case 'denied': return 'text-red-600 dark:text-red-400';
      case 'prompt': return 'text-yellow-600 dark:text-yellow-400';
      case 'unknown': return 'text-gray-600 dark:text-gray-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStateBadgeColor = (state: PermissionInfo['state']) => {
    switch (state) {
      case 'granted': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'denied': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'prompt': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'unknown': return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
      default: return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  const handleRequestPermission = async (permission: PermissionInfo) => {
    if (!permission.canRequest) {
      return;
    }
    
    try {
      await requestPermission(permission.name);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const filteredPermissions = permissions.filter(permission => {
    const categoryMatch = selectedCategory === 'all' || permission.category === selectedCategory;
    const stateMatch = selectedState === 'all' || permission.state === selectedState;
    return categoryMatch && stateMatch;
  });

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading permissions data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-red-600 dark:text-red-400 mb-2">Error loading permissions</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchPermissionsData}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
              onClick={() => setShowHistory(!showHistory)}
              className={`px-3 py-1 text-sm rounded ${
                showHistory 
                  ? 'bg-purple-500 text-white hover:bg-purple-600' 
                  : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
            >
              {showHistory ? 'Hide History' : 'Show History'}
            </button>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {stats.granted} granted • {stats.denied} denied • {stats.prompt} prompt
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.granted}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Granted</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.denied}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Denied</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.prompt}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Prompt</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{stats.unknown}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Unknown</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-wrap gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as PermissionInfo['category'] | 'all')}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* State Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              State
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value as PermissionInfo['state'] | 'all')}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
            >
              {states.map(state => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {showHistory ? (
          /* Permission History */
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Permission Request History
            </h3>
            {history.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📜</div>
                <p className="text-gray-600 dark:text-gray-400">No permission requests yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((request, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {request.permission}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(request.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          request.result === 'granted' 
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : request.result === 'denied'
                            ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                            : 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
                        }`}>
                          {request.result}
                        </span>
                      </div>
                    </div>
                    {request.error && (
                      <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                        Error: {request.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Permissions List */
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Website Permissions ({filteredPermissions.length})
            </h3>
            
            {filteredPermissions.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🔒</div>
                <p className="text-gray-600 dark:text-gray-400">No permissions found with current filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPermissions.map((permission) => (
                  <div key={permission.name} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{permission.icon}</div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {permission.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {permission.description}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStateBadgeColor(permission.state)}`}>
                              {permission.state}
                            </span>
                            {!permission.isSupported && (
                              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                                Not Supported
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {permission.canRequest && permission.state !== 'granted' && (
                          <button
                            onClick={() => handleRequestPermission(permission)}
                            disabled={requestingPermission === permission.name}
                            className={`px-3 py-1 text-sm rounded ${
                              requestingPermission === permission.name
                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                          >
                            {requestingPermission === permission.name ? 'Requesting...' : 'Request'}
                          </button>
                        )}
                        {permission.state === 'granted' && (
                          <span className="text-green-600 dark:text-green-400 text-sm">✓ Granted</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PermissionsPanel;
