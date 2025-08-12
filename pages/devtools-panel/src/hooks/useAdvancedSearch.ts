import { useState, useEffect, useCallback, useMemo } from 'react';
import { AdvancedSearchService, SearchFilter, SearchResult, StorageItem } from '../services/advancedSearchService';

export const useAdvancedSearch = (items: StorageItem[]) => {
  const [filter, setFilter] = useState<SearchFilter>(AdvancedSearchService.getDefaultFilter());
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<Array<{ name: string; filter: SearchFilter }>>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [regexValidation, setRegexValidation] = useState<{ isValid: boolean; error?: string }>({ isValid: true });

  // Search results
  const searchResults = useMemo(() => {
    if (!filter.text.trim()) return [];
    return AdvancedSearchService.searchAcrossStorage(items, filter);
  }, [items, filter]);

  // Search statistics
  const searchStats = useMemo(() => {
    return AdvancedSearchService.getSearchStats(searchResults);
  }, [searchResults]);

  // Search suggestions
  const suggestions = useMemo(() => {
    if (!filter.text.trim()) return [];
    return AdvancedSearchService.getSearchSuggestions(items, filter.text);
  }, [items, filter.text]);

  // Update filter
  const updateFilter = useCallback((updates: Partial<SearchFilter>) => {
    setFilter(prev => ({ ...prev, ...updates }));
  }, []);

  // Reset filter
  const resetFilter = useCallback(() => {
    setFilter(AdvancedSearchService.getDefaultFilter());
  }, []);

  // Perform search
  const performSearch = useCallback((searchText: string, options?: Partial<SearchFilter>) => {
    const newFilter = { ...filter, text: searchText, ...options };
    setFilter(newFilter);
    
    // Add to search history
    if (searchText.trim()) {
      setSearchHistory(prev => {
        const filtered = prev.filter(item => item !== searchText);
        return [searchText, ...filtered].slice(0, 10); // Keep last 10 searches
      });
    }
  }, [filter]);

  // Save current search
  const saveSearch = useCallback((name: string) => {
    setSavedSearches(prev => {
      const filtered = prev.filter(search => search.name !== name);
      return [...filtered, { name, filter: { ...filter } }];
    });
  }, [filter]);

  // Load saved search
  const loadSavedSearch = useCallback((name: string) => {
    const savedSearch = savedSearches.find(search => search.name === name);
    if (savedSearch) {
      setFilter(savedSearch.filter);
    }
  }, [savedSearches]);

  // Delete saved search
  const deleteSavedSearch = useCallback((name: string) => {
    setSavedSearches(prev => prev.filter(search => search.name !== name));
  }, []);

  // Clear search history
  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  // Validate regex when filter type is regex
  useEffect(() => {
    if (filter.type === 'regex' && filter.text) {
      const validation = AdvancedSearchService.validateRegex(filter.text);
      setRegexValidation(validation);
    } else {
      setRegexValidation({ isValid: true });
    }
  }, [filter.type, filter.text]);

  // Export search results
  const exportResults = useCallback((format: 'json' | 'csv') => {
    if (format === 'json') {
      const data = searchResults.map(result => ({
        key: result.item.key,
        value: result.item.value,
        storageType: result.item.storageType,
        matchType: result.matchType,
        matchScore: result.matchScore,
        dataType: result.metadata.dataType,
        size: result.metadata.size
      }));
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `storage-search-results-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      const headers = ['Key', 'Value', 'Storage Type', 'Match Type', 'Match Score', 'Data Type', 'Size'];
      const rows = searchResults.map(result => [
        result.item.key,
        result.item.value,
        result.item.storageType,
        result.matchType,
        result.matchScore,
        result.metadata.dataType,
        result.metadata.size
      ]);
      
      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `storage-search-results-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [searchResults]);

  // Get filtered and sorted results
  const getFilteredResults = useCallback((
    sortBy: 'relevance' | 'key' | 'value' | 'size' | 'type' = 'relevance',
    sortOrder: 'asc' | 'desc' = 'desc'
  ) => {
    let sorted = [...searchResults];
    
    switch (sortBy) {
      case 'key':
        sorted.sort((a, b) => a.item.key.localeCompare(b.item.key));
        break;
      case 'value':
        sorted.sort((a, b) => a.item.value.localeCompare(b.item.value));
        break;
      case 'size':
        sorted.sort((a, b) => a.metadata.size - b.metadata.size);
        break;
      case 'type':
        sorted.sort((a, b) => a.metadata.dataType.localeCompare(b.metadata.dataType));
        break;
      case 'relevance':
      default:
        // Already sorted by relevance
        break;
    }
    
    if (sortOrder === 'asc' && sortBy !== 'relevance') {
      sorted.reverse();
    }
    
    return sorted;
  }, [searchResults]);

  return {
    // State
    filter,
    searchResults,
    searchStats,
    suggestions,
    searchHistory,
    savedSearches,
    showAdvancedFilters,
    regexValidation,
    
    // Actions
    updateFilter,
    resetFilter,
    performSearch,
    saveSearch,
    loadSavedSearch,
    deleteSavedSearch,
    clearSearchHistory,
    setShowAdvancedFilters,
    exportResults,
    getFilteredResults
  };
};
