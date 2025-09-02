// @ts-nocheck
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
    clearAllStorage,
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
      lastModified: Date.now(), // In a real implementation, you'd track this
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
    getFilteredResults,
  } = useAdvancedSearch(advancedStorageItems);

  const [isJsonMode, setIsJsonMode] = useState(false);
  const [jsonError, setJsonError] = useState('');

  // Get items to display (search results or all items)
  const displayItems = useMemo(() => {
    if (filter.text.trim()) {
      return getFilteredResults(sortBy, sortOrder);
    }
    return storageItems;
  }, [filter.text, searchResults, storageItems, sortBy, sortOrder, getFilteredResults]);

  const handleEdit = item => {
    setSelectedItem(item);
    setEditingKey(item.key);

    // Check if the value is valid JSON and format it
    try {
      const parsed = JSON.parse(item.value);
      if (typeof parsed === 'object' && parsed !== null) {
        setEditingValue(JSON.stringify(parsed, null, 2));
        setIsJsonMode(true);
      } else {
        setEditingValue(item.value);
        setIsJsonMode(false);
      }
      setJsonError('');
    } catch {
      setEditingValue(item.value);
      setIsJsonMode(false);
      setJsonError('');
    }
  };

  const handleSave = () => {
    if (selectedItem) {
      let finalValue = editingValue;

      // If in JSON mode, validate the JSON before saving
      if (isJsonMode) {
        try {
          JSON.parse(editingValue);
          setJsonError('');
        } catch (error) {
          setJsonError('Invalid JSON format');
          return;
        }
      }

      updateStorageItem(selectedItem.key, editingKey, finalValue);
      setSelectedItem(null);
      setIsJsonMode(false);
      setJsonError('');
    }
  };

  const toggleJsonMode = () => {
    if (!isJsonMode) {
      // Switch to JSON mode - try to format the current value
      try {
        const parsed = JSON.parse(editingValue);
        setEditingValue(JSON.stringify(parsed, null, 2));
        setIsJsonMode(true);
        setJsonError('');
      } catch (error) {
        setJsonError('Cannot format as JSON: Invalid format');
      }
    } else {
      // Switch to raw mode - minify the JSON
      try {
        const parsed = JSON.parse(editingValue);
        setEditingValue(JSON.stringify(parsed));
        setIsJsonMode(false);
        setJsonError('');
      } catch (error) {
        // If JSON is invalid, keep current value and show error
        setJsonError('Invalid JSON format');
      }
    }
  };

  const handleValueChange = value => {
    setEditingValue(value);

    if (isJsonMode) {
      try {
        JSON.parse(value);
        setJsonError('');
      } catch (error) {
        setJsonError('Invalid JSON format');
      }
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
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const EditModal = () => {
    if (!selectedItem) return null;

    const getDataType = () => {
      try {
        const parsed = JSON.parse(editingValue);
        if (Array.isArray(parsed)) return 'Array';
        if (parsed === null) return 'Null';
        if (typeof parsed === 'object') return 'Object';
        if (typeof parsed === 'number') return 'Number';
        if (typeof parsed === 'boolean') return 'Boolean';
        return 'String';
      } catch {
        if (editingValue === 'true' || editingValue === 'false') return 'Boolean';
        if (!isNaN(Number(editingValue)) && editingValue.trim() !== '') return 'Number';
        return 'String';
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-[600px] max-h-[90vh] bg-gray-50 dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Edit Storage Item</h3>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                  {getDataType()}
                </span>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[calc(90vh-120px)] overflow-y-auto">
            <div className="space-y-4">
              {/* Key Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Key</label>
                <input
                  type="text"
                  value={editingKey}
                  onChange={e => setEditingKey(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm"
                  placeholder="Enter key name..."
                />
              </div>

              {/* Value Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Value</label>
                  <div className="flex items-center space-x-2">
                    {/* JSON Mode Toggle */}
                    <button
                      onClick={toggleJsonMode}
                      className={`px-3 py-1 text-xs rounded ${
                        isJsonMode
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                      title={isJsonMode ? 'Switch to Raw Mode' : 'Format as JSON'}>
                      {isJsonMode ? '📝 Raw' : '{ } JSON'}
                    </button>

                    {/* Character Count */}
                    <span className="text-xs text-gray-500 dark:text-gray-400">{editingValue.length} chars</span>
                  </div>
                </div>

                {/* Error Message */}
                {jsonError && (
                  <div className="mb-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300 text-sm">
                    ⚠️ {jsonError}
                  </div>
                )}

                {/* Textarea */}
                <textarea
                  value={editingValue}
                  onChange={e => handleValueChange(e.target.value)}
                  rows={isJsonMode ? 15 : 8}
                  className={`w-full px-3 py-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm resize-none ${
                    jsonError ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  } ${isJsonMode ? 'leading-relaxed' : ''}`}
                  placeholder="Enter value..."
                  spellCheck={false}
                />

                {/* JSON Helper Text */}
                {isJsonMode && (
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    💡 Tip: Use proper JSON syntax with double quotes for strings. Press Tab for indentation.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800">
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Size: {editingValue.length} bytes
                {isJsonMode && <span className="ml-2">• Lines: {editingValue.split('\n').length}</span>}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedItem(null);
                    setIsJsonMode(false);
                    setJsonError('');
                  }}
                  className="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!!jsonError}
                  className={`px-4 py-2 text-sm rounded transition-colors ${
                    jsonError
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
            <button onClick={handleAdd} className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
              Add Item
            </button>
            <button
              onClick={clearAllStorage}
              className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600">
              Clear All
            </button>
            <button
              onClick={fetchStorageData}
              className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600">
              Refresh
            </button>
          </div>
          <div className="flex items-center space-x-4">
            {/* Sort Controls */}
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Sort by:</label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <option value="relevance">Relevance</option>
                <option value="key">Key</option>
                <option value="value">Value</option>
                <option value="size">Size</option>
                <option value="type">Type</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-2 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600">
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
                  <div className="text-4xl mb-2">{filter.text.trim() ? '🔍' : '📭'}</div>
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
                    <th className="px-2 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 w-16">
                      Actions
                    </th>

                    <th className="px-2 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Key</th>
                    <th className="px-2 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Value</th>
                    <th className="px-2 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 w-20">
                      Size
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayItems.map(item => {
                    const dataTypeIcon = getDataTypeIcon(item.value);
                    const sizeCategory = getSizeCategory(item.value.length);
                    const isSearchResult =
                      filter.text.trim() && searchResults.some(result => result.item.key === item.key);

                    return (
                      <tr
                        key={item.key}
                        className={`border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          isSearchResult ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''
                        }`}>
                        <td className="px-2 py-2 text-sm">
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs px-1"
                              title="Edit">
                              ✏️
                            </button>
                            <button
                              onClick={() => deleteStorageItem(item.key)}
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-xs px-1"
                              title="Delete">
                              🗑️
                            </button>
                          </div>
                        </td>

                        <td className="px-2 py-2 text-sm text-gray-900 dark:text-gray-100 font-mono">
                          {isSearchResult ? (
                            <div
                              dangerouslySetInnerHTML={{
                                __html:
                                  searchResults.find(r => r.item.key === item.key)?.highlights.key.join('') || item.key,
                              }}
                            />
                          ) : (
                            <span className="break-all">{item.key}</span>
                          )}
                        </td>
                        <td className="px-2 py-2 text-sm text-gray-900 dark:text-gray-100">
                          {isSearchResult ? (
                            <div
                              dangerouslySetInnerHTML={{
                                __html:
                                  searchResults.find(r => r.item.key === item.key)?.highlights.value.join('') ||
                                  (item.value.length > 40 ? `${item.value.substring(0, 40)}...` : item.value),
                              }}
                            />
                          ) : (
                            <span className="break-all">
                              {item.value.length > 40 ? `${item.value.substring(0, 40)}...` : item.value}
                            </span>
                          )}
                        </td>
                        <td className="px-2 py-2 text-xs">
                          <div className="text-center">
                            <div className={`${sizeCategory.color} text-xs`}>{sizeCategory.label}</div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs">{item.value.length}B</div>
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
        {
          selectedItem && <EditModal />
          // (
          //   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          //     <div className="w-96 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-lg">
          //       <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          //         Edit Item
          //       </h3>
          //       <div className="space-y-4">
          //         <div>
          //           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          //             Key
          //           </label>
          //           <input
          //             type="text"
          //             value={editingKey}
          //             onChange={(e) => setEditingKey(e.target.value)}
          //             className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono"
          //           />
          //         </div>
          //         <div>
          //           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          //             Value
          //           </label>
          //           <textarea
          //             value={editingValue}
          //             onChange={(e) => setEditingValue(e.target.value)}
          //             rows={6}
          //             className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono"
          //           />
          //         </div>
          //         <div className="flex justify-end space-x-2">
          //           <button
          //             onClick={handleSave}
          //             className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          //           >
          //             Save
          //           </button>
          //           <button
          //             onClick={() => setSelectedItem(null)}
          //             className="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
          //           >
          //             Cancel
          //           </button>
          //         </div>
          //       </div>
          //     </div>
          //   </div>
          // )
        }
      </div>
    </div>
  );
}

export default EnhancedStoragePanel;
