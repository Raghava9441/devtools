export type SearchFilter = {
    text: string;
    type: 'exact' | 'fuzzy' | 'regex';
    caseSensitive: boolean;
    searchIn: 'keys' | 'values' | 'both';
    dataType?: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'all';
    sizeFilter?: 'small' | 'medium' | 'large' | 'all';
    ageFilter?: 'recent' | 'old' | 'all';
};

export type SearchResult = {
    item: StorageItem;
    matchType: 'key' | 'value' | 'both';
    matchScore: number;
    highlights: {
        key: string[];
        value: string[];
    };
    metadata: {
        dataType: string;
        size: number;
        sizeCategory: 'small' | 'medium' | 'large';
        lastModified?: number;
    };
};

export type StorageItem = {
    key: string;
    value: string;
    storageType: 'localStorage' | 'sessionStorage' | 'cookies';
    lastModified?: number;
};

export class AdvancedSearchService {
    /**
     * Calculate Levenshtein distance for fuzzy search
     */
    private static levenshteinDistance(str1: string, str2: string): number {
        const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

        for (let i = 0; i <= str1.length; i++) {
            matrix[0][i] = i;
        }

        for (let j = 0; j <= str2.length; j++) {
            matrix[j][0] = j;
        }

        for (let j = 1; j <= str2.length; j++) {
            for (let i = 1; i <= str1.length; i++) {
                const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(
                    matrix[j][i - 1] + 1, // deletion
                    matrix[j - 1][i] + 1, // insertion
                    matrix[j - 1][i - 1] + indicator // substitution
                );
            }
        }

        return matrix[str2.length][str1.length];
    }

    /**
     * Calculate fuzzy search score
     */
    private static calculateFuzzyScore(searchTerm: string, text: string): number {
        if (searchTerm.length === 0) return 1;
        if (text.length === 0) return 0;

        const distance = this.levenshteinDistance(searchTerm.toLowerCase(), text.toLowerCase());
        const maxLength = Math.max(searchTerm.length, text.length);

        // Score is 1 - (distance / maxLength), so perfect match = 1, no match = 0
        return Math.max(0, 1 - (distance / maxLength));
    }

    /**
     * Highlight search terms in text
     */
    private static highlightText(text: string, searchTerm: string, type: 'exact' | 'fuzzy' | 'regex'): string[] {
        if (!searchTerm) return [text];

        const highlights: string[] = [];

        try {
            if (type === 'regex') {
                const regex = new RegExp(searchTerm, 'gi');
                let match;
                let lastIndex = 0;

                while ((match = regex.exec(text)) !== null) {
                    if (match.index > lastIndex) {
                        highlights.push(text.slice(lastIndex, match.index));
                    }
                    highlights.push(`<mark>${match[0]}</mark>`);
                    lastIndex = regex.lastIndex;
                }

                if (lastIndex < text.length) {
                    highlights.push(text.slice(lastIndex));
                }
            } else {
                // For exact and fuzzy search, find all occurrences
                const searchLower = searchTerm.toLowerCase();
                const textLower = text.toLowerCase();
                let lastIndex = 0;
                let index = textLower.indexOf(searchLower);

                while (index !== -1) {
                    if (index > lastIndex) {
                        highlights.push(text.slice(lastIndex, index));
                    }
                    highlights.push(`<mark>${text.slice(index, index + searchTerm.length)}</mark>`);
                    lastIndex = index + searchTerm.length;
                    index = textLower.indexOf(searchLower, lastIndex);
                }

                if (lastIndex < text.length) {
                    highlights.push(text.slice(lastIndex));
                }
            }
        } catch (error) {
            // If regex is invalid, fall back to exact search
            return this.highlightText(text, searchTerm, 'exact');
        }

        return highlights.length > 0 ? highlights : [text];
    }

    /**
     * Determine data type of a value
     */
    private static getDataType(value: string): string {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) return 'array';
            if (parsed === null) return 'null';
            if (typeof parsed === 'object') return 'object';
            if (typeof parsed === 'number') return 'number';
            if (typeof parsed === 'boolean') return 'boolean';
            return 'string';
        } catch {
            // If it's not valid JSON, check if it's a number or boolean
            if (value === 'true' || value === 'false') return 'boolean';
            if (!isNaN(Number(value)) && value.trim() !== '') return 'number';
            return 'string';
        }
    }

    /**
     * Categorize data size
     */
    private static getSizeCategory(size: number): 'small' | 'medium' | 'large' {
        if (size < 100) return 'small';
        if (size < 1000) return 'medium';
        return 'large';
    }

    /**
     * Check if item matches the search filter
     */
    private static matchesFilter(item: StorageItem, filter: SearchFilter): SearchResult | null {
        const searchText = filter.caseSensitive ? filter.text : filter.text.toLowerCase();
        const keyText = filter.caseSensitive ? item.key : item.key.toLowerCase();
        const valueText = filter.caseSensitive ? item.value : item.value.toLowerCase();

        let keyMatch = false;
        let valueMatch = false;
        let keyScore = 0;
        let valueScore = 0;

        // Check key match
        if (filter.searchIn === 'keys' || filter.searchIn === 'both') {
            if (filter.type === 'exact') {
                keyMatch = keyText.includes(searchText);
                keyScore = keyMatch ? 1 : 0;
            } else if (filter.type === 'fuzzy') {
                keyScore = this.calculateFuzzyScore(filter.text, item.key);
                keyMatch = keyScore > 0.7; // Threshold for fuzzy matching
            } else if (filter.type === 'regex') {
                try {
                    const regex = new RegExp(filter.text, filter.caseSensitive ? '' : 'i');
                    keyMatch = regex.test(item.key);
                    keyScore = keyMatch ? 1 : 0;
                } catch {
                    keyMatch = false;
                    keyScore = 0;
                }
            }
        }

        // Check value match
        if (filter.searchIn === 'values' || filter.searchIn === 'both') {
            if (filter.type === 'exact') {
                valueMatch = valueText.includes(searchText);
                valueScore = valueMatch ? 1 : 0;
            } else if (filter.type === 'fuzzy') {
                valueScore = this.calculateFuzzyScore(filter.text, item.value);
                valueMatch = valueScore > 0.7; // Threshold for fuzzy matching
            } else if (filter.type === 'regex') {
                try {
                    const regex = new RegExp(filter.text, filter.caseSensitive ? '' : 'i');
                    valueMatch = regex.test(item.value);
                    valueScore = valueMatch ? 1 : 0;
                } catch {
                    valueMatch = false;
                    valueScore = 0;
                }
            }
        }

        // If no match found, return null
        if (!keyMatch && !valueMatch) return null;

        // Determine match type and score
        const matchType = keyMatch && valueMatch ? 'both' : keyMatch ? 'key' : 'value';
        const matchScore = Math.max(keyScore, valueScore);

        // Check data type filter
        const dataType = this.getDataType(item.value);
        if (filter.dataType && filter.dataType !== 'all' && dataType !== filter.dataType) {
            return null;
        }

        // Check size filter
        const size = item.value.length;
        const sizeCategory = this.getSizeCategory(size);
        if (filter.sizeFilter && filter.sizeFilter !== 'all' && sizeCategory !== filter.sizeFilter) {
            return null;
        }

        // Check age filter (if lastModified is available)
        if (filter.ageFilter && filter.ageFilter !== 'all' && item.lastModified) {
            const now = Date.now();
            const age = now - item.lastModified;
            const isRecent = age < 24 * 60 * 60 * 1000; // 24 hours

            if (filter.ageFilter === 'recent' && !isRecent) return null;
            if (filter.ageFilter === 'old' && isRecent) return null;
        }

        // Generate highlights
        const keyHighlights = keyMatch ? this.highlightText(item.key, filter.text, filter.type) : [item.key];
        const valueHighlights = valueMatch ? this.highlightText(item.value, filter.text, filter.type) : [item.value];

        return {
            item,
            matchType,
            matchScore,
            highlights: {
                key: keyHighlights,
                value: valueHighlights
            },
            metadata: {
                dataType,
                size,
                sizeCategory,
                lastModified: item.lastModified
            }
        };
    }

    /**
     * Search across multiple storage types
     */
    static searchAcrossStorage(
        items: StorageItem[],
        filter: SearchFilter
    ): SearchResult[] {
        const results: SearchResult[] = [];

        for (const item of items) {
            const result = this.matchesFilter(item, filter);
            if (result) {
                results.push(result);
            }
        }

        // Sort by relevance score (highest first)
        return results.sort((a, b) => b.matchScore - a.matchScore);
    }

    /**
     * Get search suggestions based on existing data
     */
    static getSearchSuggestions(items: StorageItem[], partialQuery: string): string[] {
        const suggestions = new Set<string>();

        for (const item of items) {
            // Add key suggestions
            if (item.key.toLowerCase().includes(partialQuery.toLowerCase())) {
                suggestions.add(item.key);
            }

            // Add value suggestions (for string values)
            if (item.value.toLowerCase().includes(partialQuery.toLowerCase())) {
                const dataType = this.getDataType(item.value);
                if (dataType === 'string') {
                    // Extract words from the value
                    const words = item.value.split(/\s+/).filter(word =>
                        word.toLowerCase().includes(partialQuery.toLowerCase()) && word.length > 2
                    );
                    words.forEach(word => suggestions.add(word));
                }
            }
        }

        return Array.from(suggestions).slice(0, 10); // Limit to 10 suggestions
    }

    /**
     * Get search statistics
     */
    static getSearchStats(results: SearchResult[]): {
        total: number;
        byStorageType: Record<string, number>;
        byDataType: Record<string, number>;
        bySizeCategory: Record<string, number>;
        byMatchType: Record<string, number>;
    } {
        const stats = {
            total: results.length,
            byStorageType: {} as Record<string, number>,
            byDataType: {} as Record<string, number>,
            bySizeCategory: {} as Record<string, number>,
            byMatchType: {} as Record<string, number>
        };

        for (const result of results) {
            // Count by storage type
            const storageType = result.item.storageType;
            stats.byStorageType[storageType] = (stats.byStorageType[storageType] || 0) + 1;

            // Count by data type
            const dataType = result.metadata.dataType;
            stats.byDataType[dataType] = (stats.byDataType[dataType] || 0) + 1;

            // Count by size category
            const sizeCategory = result.metadata.sizeCategory;
            stats.bySizeCategory[sizeCategory] = (stats.bySizeCategory[sizeCategory] || 0) + 1;

            // Count by match type
            const matchType = result.matchType;
            stats.byMatchType[matchType] = (stats.byMatchType[matchType] || 0) + 1;
        }

        return stats;
    }

    /**
     * Validate regex pattern
     */
    static validateRegex(pattern: string): { isValid: boolean; error?: string } {
        try {
            new RegExp(pattern);
            return { isValid: true };
        } catch (error) {
            return {
                isValid: false,
                error: error instanceof Error ? error.message : 'Invalid regex pattern'
            };
        }
    }

    /**
     * Get default search filter
     */
    static getDefaultFilter(): SearchFilter {
        return {
            text: '',
            type: 'fuzzy',
            caseSensitive: false,
            searchIn: 'both',
            dataType: 'all',
            sizeFilter: 'all',
            ageFilter: 'all'
        };
    }
}
