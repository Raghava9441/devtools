import { useState, useEffect, useCallback } from 'react';
import { ManifestService, ManifestInfo } from '../services/manifestService';

export const useManifest = () => {
  const [manifest, setManifest] = useState<ManifestInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } | null>(null);

  // Function to fetch manifest data
  const fetchManifestData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await ManifestService.getManifestData();
      setManifest(data);

      // Validate manifest if found
      if (data) {
        const validationResult = ManifestService.validateManifest(data);
        setValidation(validationResult);
      } else {
        setValidation(null);
      }
    } catch (err) {
      console.error('Error fetching manifest:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch manifest data');
      setManifest(null);
      setValidation(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to update manifest
  const updateManifest = useCallback((updatedManifest: ManifestInfo) => {
    setManifest(updatedManifest);
    const validationResult = ManifestService.validateManifest(updatedManifest);
    setValidation(validationResult);
  }, []);

  // Function to generate sample manifest
  const generateSampleManifest = useCallback(() => {
    const sampleManifest = ManifestService.generateSampleManifest();
    setManifest(sampleManifest);
    const validationResult = ManifestService.validateManifest(sampleManifest);
    setValidation(validationResult);
  }, []);

  // Function to download manifest
  const downloadManifest = useCallback((filename?: string) => {
    if (manifest) {
      try {
        ManifestService.downloadManifest(manifest, filename);
      } catch (err) {
        console.error('Error downloading manifest:', err);
        setError(err instanceof Error ? err.message : 'Failed to download manifest');
      }
    }
  }, [manifest]);

  // Function to validate current manifest
  const validateCurrentManifest = useCallback(() => {
    if (manifest) {
      const validationResult = ManifestService.validateManifest(manifest);
      setValidation(validationResult);
    }
  }, [manifest]);

  // Load data on component mount
  useEffect(() => {
    fetchManifestData();
  }, [fetchManifestData]);

  return {
    manifest,
    loading,
    error,
    validation,
    fetchManifestData,
    updateManifest,
    generateSampleManifest,
    downloadManifest,
    validateCurrentManifest
  };
};
