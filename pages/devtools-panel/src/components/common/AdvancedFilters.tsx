import React from 'react';
import { SearchFilter } from '../../services/advancedSearchService';

interface AdvancedFiltersProps {
  filter: SearchFilter;
  onFilterChange: (filter: SearchFilter) => void;
  onReset: () => void;
  searchStats: {
    total: number;
    byDataType: Record<string, number>;
    bySizeCategory: Record<string, number>;
    byMatchType: Record<string, number>;
  };
}

function AdvancedFilters({
  filter,
  onFilterChange,
  onReset,
  searchStats
}: AdvancedFiltersProps) {
  const dataTypes = [
    { value: 'all', label: 'All Types', icon: '📋' },
    { value: 'string', label: 'String', icon: '📝' },
    { value: 'number', label: 'Number', icon: '🔢' },
    { value: 'boolean', label: 'Boolean', icon: '✅' },
    { value: 'object', label: 'Object', icon: '📦' },
    { value: 'array', label: 'Array', icon: '📊' }
  ];

  const sizeCategories = [
    { value: 'all', label: 'All Sizes', icon: '📏' },
    { value: 'small', label: 'Small (<100B)', icon: '🔹' },
    { value: 'medium', label: 'Medium (100B-1KB)', icon: '🔸' },
    { value: 'large', label: 'Large (>1KB)', icon: '🔺' }
  ];

  const ageFilters = [
    { value: 'all', label: 'All Ages', icon: '⏰' },
    { value: 'recent', label: 'Recent (<24h)', icon: '🕐' },
    { value: 'old', label: 'Old (>24h)', icon: '🕙' }
  ];

  const searchInOptions = [
    { value: 'both', label: 'Keys & Values', icon: '🔍' },
    { value: 'keys', label: 'Keys Only', icon: '🔑' },
    { value: 'values', label: 'Values Only', icon: '💎' }
  ];

  const getDataTypeCount = (type: string) => {
    return searchStats.byDataType[type] || 0;
  };

  const getSizeCategoryCount = (size: string) => {
    return searchStats.bySizeCategory[size] || 0;
  };

  const getMatchTypeCount = (type: string) => {
    return searchStats.byMatchType[type] || 0;
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mt-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Advanced Filters
        </h3>
        <button
          onClick={onReset}
          className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search In Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search In
          </label>
          <select
            value={filter.searchIn}
            onChange={(e) => onFilterChange({ ...filter, searchIn: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
          >
            {searchInOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Data Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Data Type
          </label>
          <select
            value={filter.dataType || 'all'}
            onChange={(e) => onFilterChange({ ...filter, dataType: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
          >
            {dataTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.icon} {type.label} ({getDataTypeCount(type.value)})
              </option>
            ))}
          </select>
        </div>

        {/* Size Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Size Category
          </label>
          <select
            value={filter.sizeFilter || 'all'}
            onChange={(e) => onFilterChange({ ...filter, sizeFilter: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
          >
            {sizeCategories.map(size => (
              <option key={size.value} value={size.value}>
                {size.icon} {size.label} ({getSizeCategoryCount(size.value)})
              </option>
            ))}
          </select>
        </div>

        {/* Age Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Age
          </label>
          <select
            value={filter.ageFilter || 'all'}
            onChange={(e) => onFilterChange({ ...filter, ageFilter: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
          >
            {ageFilters.map(age => (
              <option key={age.value} value={age.value}>
                {age.icon} {age.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Statistics */}
      {searchStats.total > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search Statistics
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {searchStats.total}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Total Results</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {getMatchTypeCount('key')}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Key Matches</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {getMatchTypeCount('value')}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Value Matches</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                {getMatchTypeCount('both')}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Both Matches</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdvancedFilters;
