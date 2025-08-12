import React, { useState, useMemo } from 'react';
import { useStorage, StorageType } from '../../hooks';
import { useAdvancedSearch } from '../../hooks';
import { StorageItem as BaseStorageItem } from '../../services';
import { StorageItem as AdvancedStorageItem } from '../../services/advancedSearchService';
import AdvancedSearchBar from '../common/AdvancedSearchBar';
import AdvancedFilters from '../common/AdvancedFilters';

type Props = {
  storageType: StorageType;
};

function EnhancedStoragePanel({ storageType }: Props) {
  const {
    storageItems,
    loading,
    error,
    fetchStorageData,
    updateStorageItem,
    deleteStorageItem,
    addStorageItem,
    clearAllStorage
  } = useStorage(storageType);

  const [selectedItem, setSelectedItem] = useState<BaseStorageItem | null>(null);
  const [editingKey, setEditingKey] = useState('');
  const [editingValue, setEditingValue] = useState('');
  const [sortBy, setSortBy] = useState<'relevance' | 'key' | 'value' | 'size' | 'type'>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Convert storage items to advanced search format
  const advancedStorageItems = useMemo(() => {
    return storageItems.map(item => ({
      key: item.key,
      value: item.value,
      storageType: storageType as 'localStorage' | 'sessionStorage',
      lastModified: Date.now() // In a real implementation, you'd track this
    })) as AdvancedStorageItem[];
  }, [storageItems, storageType]);

  // Advanced search functionality
  const {
    filter,
    searchResults,
    searchStats,
    suggestions,
    searchHistory,
    savedSearches,
    showAdvancedFilters,
    regexValidation,
    updateFilter,
    resetFilter,
    performSearch,
    saveSearch,
    loadSavedSearch,
    deleteSavedSearch,
    setShowAdvancedFilters,
    exportResults,
    getFilteredResults
  } = useAdvancedSearch(advancedStorageItems);

  // Get items to display (search results or all items)
  const displayItems = useMemo(() => {
    if (filter.text.trim()) {
      return getFilteredResults(sortBy, sortOrder);
    }
    return storageItems;
  }, [filter.text, searchResults, storageItems, sortBy, sortOrder, getFilteredResults]);

  const handleEdit = (item: BaseStorageItem) => {
    setSelectedItem(item);
    setEditingKey(item.key);
    setEditingValue(item.value);
  };

  const handleSave = () => {
    if (selectedItem) {
      updateStorageItem(selectedItem.key, editingKey, editingValue);
      setSelectedItem(null);
    }
  };

  const handleAdd = () => {
    const newKey = `new_key_${Date.now()}`;
    const newValue = '';
    addStorageItem(newKey, newValue);
  };

  const getStorageTypeLabel = () => {
    return storageType === 'localStorage' ? 'Local Storage' : 'Session Storage';
  };

  const getDataTypeIcon = (value: string) => {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return '📊';
      if (parsed === null) return '❌';
      if (typeof parsed === 'object') return '📦';
      if (typeof parsed === 'number') return '🔢';
      if (typeof parsed === 'boolean') return '✅';
      return '📝';
    } catch {
      if (value === 'true' || value === 'false') return '✅';
      if (!isNaN(Number(value)) && value.trim() !== '') return '🔢';
      return '📝';
    }
  };

  const getSizeCategory = (size: number) => {
    if (size < 100) return { label: 'Small', color: 'text-green-600 dark:text-green-400' };
    if (size < 1000) return { label: 'Medium', color: 'text-yellow-600 dark:text-yellow-400' };
    return { label: 'Large', color: 'text-red-600 dark:text-red-400' };
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading {getStorageTypeLabel().toLowerCase()} data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-red-600 dark:text-red-400 mb-2">Error loading {getStorageTypeLabel().toLowerCase()}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchStorageData}
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
      {/* Advanced Search Bar */}
      <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 p-3">
        <AdvancedSearchBar
          filter={filter}
          onFilterChange={updateFilter}
          suggestions={suggestions}
          searchHistory={searchHistory}
          onSaveSearch={saveSearch}
          onLoadSavedSearch={loadSavedSearch}
          savedSearches={savedSearches}
          onDeleteSavedSearch={deleteSavedSearch}
          regexValidation={regexValidation}
          showAdvancedFilters={showAdvancedFilters}
          onToggleAdvancedFilters={setShowAdvancedFilters}
          onExportResults={exportResults}
          hasResults={searchResults.length > 0}
        />
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="px-3 pb-3">
          <AdvancedFilters
            filter={filter}
            onFilterChange={updateFilter}
            onReset={resetFilter}
            searchStats={searchStats}
          />
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleAdd}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              Add Item
            </button>
            <button 
              onClick={clearAllStorage}
              className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
            >
              Clear All
            </button>
            <button 
              onClick={fetchStorageData}
              className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
            >
              Refresh
            </button>
          </div>
          <div className="flex items-center space-x-4">
            {/* Sort Controls */}
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="relevance">Relevance</option>
                <option value="key">Key</option>
                <option value="value">Value</option>
                <option value="size">Size</option>
                <option value="type">Type</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-2 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filter.text.trim() ? `${searchResults.length} of ${storageItems.length}` : storageItems.length} items
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex">
        {/* Table View */}
        <div className="flex-1 border-r border-gray-200 dark:border-gray-600">
          <div className="bg-white dark:bg-gray-800">
            {displayItems.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-2">
                    {filter.text.trim() ? '🔍' : '📭'}
                  </div>
                  <p>
                    {filter.text.trim() 
                      ? 'No search results found' 
                      : `No ${getStorageTypeLabel().toLowerCase()} items found`}
                  </p>
                  <p className="text-sm">
                    {filter.text.trim() 
                      ? 'Try adjusting your search criteria' 
                      : `This website doesn't have any ${getStorageTypeLabel().toLowerCase()} data`}
                  </p>
                </div>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                      Type
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                      Key
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                      Value
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                      Size
                    </th>
                    <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayItems.map((item) => {
                    const dataTypeIcon = getDataTypeIcon(item.value);
                    const sizeCategory = getSizeCategory(item.value.length);
                    const isSearchResult = filter.text.trim() && searchResults.some(result => result.item.key === item.key);
                    
                    return (
                      <tr
                        key={item.key}
                        className={`border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          isSearchResult ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''
                        }`}
                      >
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                          <span className="text-lg">{dataTypeIcon}</span>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 font-mono">
                          {isSearchResult ? (
                            <div dangerouslySetInnerHTML={{ 
                              __html: searchResults.find(r => r.item.key === item.key)?.highlights.key.join('') || item.key 
                            }} />
                          ) : (
                            item.key
                          )}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                          {isSearchResult ? (
                            <div dangerouslySetInnerHTML={{ 
                              __html: searchResults.find(r => r.item.key === item.key)?.highlights.value.join('') || 
                                (item.value.length > 50 ? `${item.value.substring(0, 50)}...` : item.value)
                            }} />
                          ) : (
                            item.value.length > 50 ? `${item.value.substring(0, 50)}...` : item.value
                          )}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <span className={`${sizeCategory.color}`}>
                            {sizeCategory.label} ({item.value.length}B)
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteStorageItem(item.key)}
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Edit Panel */}
        {selectedItem && (
          <div className="w-80 bg-gray-50 dark:bg-gray-700 p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Edit Item
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Key
                </label>
                <input
                  type="text"
                  value={editingKey}
                  onChange={(e) => setEditingKey(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Value
                </label>
                <textarea
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EnhancedStoragePanel;
