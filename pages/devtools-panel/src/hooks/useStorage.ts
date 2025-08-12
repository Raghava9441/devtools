import { useState, useEffect, useCallback } from 'react';
import { StorageService, StorageItem } from '../services/storageService';

export type StorageType = 'localStorage' | 'sessionStorage';

export const useStorage = (storageType: StorageType) => {
  const [storageItems, setStorageItems] = useState<StorageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch storage data
  const fetchStorageData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = storageType === 'localStorage' 
        ? await StorageService.getLocalStorageData()
        : await StorageService.getSessionStorageData();
      
      setStorageItems(data);
    } catch (err) {
      console.error(`Error fetching ${storageType}:`, err);
      setError(err instanceof Error ? err.message : `Failed to fetch ${storageType} data`);
      setStorageItems([]);
    } finally {
      setLoading(false);
    }
  }, [storageType]);

  // Function to update storage item
  const updateStorageItem = useCallback(async (oldKey: string, newKey: string, newValue: string) => {
    try {
      if (storageType === 'localStorage') {
        await StorageService.updateLocalStorageItem(oldKey, newKey, newValue);
      } else {
        await StorageService.updateSessionStorageItem(oldKey, newKey, newValue);
      }
      await fetchStorageData();
    } catch (err) {
      console.error(`Error updating ${storageType}:`, err);
      setError(err instanceof Error ? err.message : `Failed to update ${storageType}`);
    }
  }, [storageType, fetchStorageData]);

  // Function to delete storage item
  const deleteStorageItem = useCallback(async (key: string) => {
    try {
      if (storageType === 'localStorage') {
        await StorageService.deleteLocalStorageItem(key);
      } else {
        await StorageService.deleteSessionStorageItem(key);
      }
      await fetchStorageData();
    } catch (err) {
      console.error(`Error deleting ${storageType} item:`, err);
      setError(err instanceof Error ? err.message : `Failed to delete ${storageType} item`);
    }
  }, [storageType, fetchStorageData]);

  // Function to add new storage item
  const addStorageItem = useCallback(async (key: string, value: string) => {
    try {
      if (storageType === 'localStorage') {
        await StorageService.addLocalStorageItem(key, value);
      } else {
        await StorageService.addSessionStorageItem(key, value);
      }
      await fetchStorageData();
    } catch (err) {
      console.error(`Error adding ${storageType} item:`, err);
      setError(err instanceof Error ? err.message : `Failed to add ${storageType} item`);
    }
  }, [storageType, fetchStorageData]);

  // Function to clear all storage
  const clearAllStorage = useCallback(async () => {
    try {
      if (storageType === 'localStorage') {
        await StorageService.clearAllLocalStorage();
      } else {
        await StorageService.clearAllSessionStorage();
      }
      await fetchStorageData();
    } catch (err) {
      console.error(`Error clearing ${storageType}:`, err);
      setError(err instanceof Error ? err.message : `Failed to clear ${storageType}`);
    }
  }, [storageType, fetchStorageData]);

  // Load data on component mount and when storage type changes
  useEffect(() => {
    fetchStorageData();
  }, [fetchStorageData]);

  return {
    storageItems,
    loading,
    error,
    fetchStorageData,
    updateStorageItem,
    deleteStorageItem,
    addStorageItem,
    clearAllStorage
  };
};
