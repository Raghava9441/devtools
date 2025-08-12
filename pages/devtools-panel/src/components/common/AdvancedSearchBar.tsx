import React, { useState, useRef, useEffect } from 'react';
import { SearchFilter } from '../../services/advancedSearchService';

interface AdvancedSearchBarProps {
  filter: SearchFilter;
  onFilterChange: (filter: SearchFilter) => void;
  suggestions: string[];
  searchHistory: string[];
  onSaveSearch: (name: string) => void;
  onLoadSavedSearch: (name: string) => void;
  savedSearches: Array<{ name: string; filter: SearchFilter }>;
  onDeleteSavedSearch: (name: string) => void;
  regexValidation: { isValid: boolean; error?: string };
  showAdvancedFilters: boolean;
  onToggleAdvancedFilters: () => void;
  onExportResults: (format: 'json' | 'csv') => void;
  hasResults: boolean;
}

function AdvancedSearchBar({
  filter,
  onFilterChange,
  suggestions,
  searchHistory,
  onSaveSearch,
  onLoadSavedSearch,
  savedSearches,
  onDeleteSavedSearch,
  regexValidation,
  showAdvancedFilters,
  onToggleAdvancedFilters,
  onExportResults,
  hasResults
}: AdvancedSearchBarProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setShowHistory(false);
        setShowSavedSearches(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilter = { ...filter, text: e.target.value };
    onFilterChange(newFilter);
    setShowSuggestions(e.target.value.length > 0);
    setShowHistory(false);
    setShowSavedSearches(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onFilterChange({ ...filter, text: suggestion });
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleHistoryClick = (search: string) => {
    onFilterChange({ ...filter, text: search });
    setShowHistory(false);
    inputRef.current?.focus();
  };

  const handleSavedSearchClick = (name: string) => {
    onLoadSavedSearch(name);
    setShowSavedSearches(false);
    inputRef.current?.focus();
  };

  const handleSaveSearch = () => {
    if (saveSearchName.trim()) {
      onSaveSearch(saveSearchName.trim());
      setSaveSearchName('');
      setShowSaveDialog(false);
    }
  };

  const getSearchTypeIcon = (type: string) => {
    switch (type) {
      case 'exact': return '🔍';
      case 'fuzzy': return '🔎';
      case 'regex': return '⚡';
      default: return '🔍';
    }
  };

  const getSearchTypeColor = (type: string) => {
    switch (type) {
      case 'exact': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'fuzzy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'regex': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="relative">
      {/* Main Search Bar */}
      <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-2">
        {/* Search Type Selector */}
        <select
          value={filter.type}
          onChange={(e) => onFilterChange({ ...filter, type: e.target.value as any })}
          className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="fuzzy">🔎 Fuzzy</option>
          <option value="exact">🔍 Exact</option>
          <option value="regex">⚡ Regex</option>
        </select>

        {/* Search Input */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={filter.text}
            onChange={handleInputChange}
            placeholder="Search in storage..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          {/* Search Type Badge */}
          <div className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs rounded-full ${getSearchTypeColor(filter.type)}`}>
            {getSearchTypeIcon(filter.type)}
          </div>
        </div>

        {/* Case Sensitive Toggle */}
        <button
          onClick={() => onFilterChange({ ...filter, caseSensitive: !filter.caseSensitive })}
          className={`px-2 py-1 text-sm rounded ${
            filter.caseSensitive 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
          title="Case Sensitive"
        >
          Aa
        </button>

        {/* Advanced Filters Toggle */}
        <button
          onClick={onToggleAdvancedFilters}
          className={`px-2 py-1 text-sm rounded ${
            showAdvancedFilters 
              ? 'bg-purple-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
          title="Advanced Filters"
        >
          ⚙️
        </button>

        {/* History Button */}
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="px-2 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          title="Search History"
        >
          📜
        </button>

        {/* Saved Searches Button */}
        <button
          onClick={() => setShowSavedSearches(!showSavedSearches)}
          className="px-2 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          title="Saved Searches"
        >
          💾
        </button>

        {/* Export Button */}
        {hasResults && (
          <div className="relative">
            <button
              onClick={() => setShowSavedSearches(!showSavedSearches)}
              className="px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
              title="Export Results"
            >
              📤
            </button>
            {/* Export Dropdown */}
            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-lg z-10">
              <button
                onClick={() => onExportResults('json')}
                className="block w-full px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Export as JSON
              </button>
              <button
                onClick={() => onExportResults('csv')}
                className="block w-full px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Export as CSV
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Regex Validation Error */}
      {filter.type === 'regex' && !regexValidation.isValid && (
        <div className="mt-1 text-sm text-red-600 dark:text-red-400">
          ⚠️ {regexValidation.error}
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-lg z-20 max-h-48 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="block w-full px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
            >
              💡 {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* History Dropdown */}
      {showHistory && searchHistory.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-lg z-20 max-h-48 overflow-y-auto"
        >
          <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
            Recent Searches
          </div>
          {searchHistory.map((search, index) => (
            <button
              key={index}
              onClick={() => handleHistoryClick(search)}
              className="block w-full px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
            >
              🕒 {search}
            </button>
          ))}
        </div>
      )}

      {/* Saved Searches Dropdown */}
      {showSavedSearches && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-lg z-20 max-h-48 overflow-y-auto"
        >
          <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
            Saved Searches
          </div>
          {savedSearches.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
              No saved searches
            </div>
          ) : (
            savedSearches.map((savedSearch, index) => (
              <div key={index} className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <button
                  onClick={() => handleSavedSearchClick(savedSearch.name)}
                  className="flex-1 text-sm text-left"
                >
                  💾 {savedSearch.name}
                </button>
                <button
                  onClick={() => onDeleteSavedSearch(savedSearch.name)}
                  className="ml-2 text-red-500 hover:text-red-700"
                  title="Delete saved search"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Save Search Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Save Search
            </h3>
            <input
              type="text"
              value={saveSearchName}
              onChange={(e) => setSaveSearchName(e.target.value)}
              placeholder="Enter search name..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-4"
              onKeyPress={(e) => e.key === 'Enter' && handleSaveSearch()}
            />
            <div className="flex space-x-2">
              <button
                onClick={handleSaveSearch}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdvancedSearchBar;
