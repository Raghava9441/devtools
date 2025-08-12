import { useState, useEffect, useCallback } from 'react';
import { PermissionsService, PermissionInfo, PermissionRequest } from '../services/permissionsService';

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<PermissionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    total: number;
    granted: number;
    denied: number;
    prompt: number;
    unknown: number;
  }>({
    total: 0,
    granted: 0,
    denied: 0,
    prompt: 0,
    unknown: 0,
  });
  const [history, setHistory] = useState<PermissionRequest[]>([]);
  const [requestingPermission, setRequestingPermission] = useState<string | null>(null);

  // Function to fetch permissions data
  const fetchPermissionsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [permissionsData, statsData, historyData] = await Promise.all([
        PermissionsService.getPermissionsData(),
        PermissionsService.getPermissionStats(),
        PermissionsService.getPermissionHistory()
      ]);

      setPermissions(permissionsData);
      setStats(statsData);
      setHistory(historyData);
    } catch (err) {
      console.error('Error fetching permissions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch permissions data');
      setPermissions([]);
      setStats({
        total: 0,
        granted: 0,
        denied: 0,
        prompt: 0,
        unknown: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to request a permission
  const requestPermission = useCallback(async (permissionName: string) => {
    try {
      setRequestingPermission(permissionName);
      setError(null);

      const result = await PermissionsService.requestPermission(permissionName);
      
      // Add to history
      setHistory(prev => [result, ...prev]);
      
      // Refresh permissions data to get updated states
      await fetchPermissionsData();
      
      return result;
    } catch (err) {
      console.error('Error requesting permission:', err);
      setError(err instanceof Error ? err.message : 'Failed to request permission');
      throw err;
    } finally {
      setRequestingPermission(null);
    }
  }, [fetchPermissionsData]);

  // Function to get permissions by category
  const getPermissionsByCategory = useCallback((category: PermissionInfo['category']) => {
    return permissions.filter(p => p.category === category);
  }, [permissions]);

  // Function to get permissions by state
  const getPermissionsByState = useCallback((state: PermissionInfo['state']) => {
    return permissions.filter(p => p.state === state);
  }, [permissions]);

  // Function to refresh all data
  const refreshData = useCallback(async () => {
    await fetchPermissionsData();
  }, [fetchPermissionsData]);

  // Load data on component mount
  useEffect(() => {
    fetchPermissionsData();
  }, [fetchPermissionsData]);

  return {
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
  };
};
