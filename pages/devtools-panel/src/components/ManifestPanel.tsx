import React, { useState } from 'react';
import { useManifest } from '../hooks';
import { ManifestInfo, ManifestService } from '../services';

function ManifestPanel() {
  const {
    manifest,
    loading,
    error,
    validation,
    fetchManifestData,
    updateManifest,
    generateSampleManifest,
    downloadManifest,
    validateCurrentManifest
  } = useManifest();

  const [isEditing, setIsEditing] = useState(false);
  const [editingManifest, setEditingManifest] = useState<ManifestInfo | null>(null);

  const handleEdit = () => {
    if (manifest) {
      setEditingManifest({ ...manifest });
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (editingManifest) {
      updateManifest(editingManifest);
      setIsEditing(false);
      setEditingManifest(null);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingManifest(null);
  };

  const handleGenerateSample = () => {
    generateSampleManifest();
  };

  const handleDownload = () => {
    if (manifest) {
      const filename = `${manifest.shortName || 'manifest'}.json`;
      downloadManifest(filename);
    }
  };

  const updateEditingField = (field: keyof ManifestInfo, value: any) => {
    if (editingManifest) {
      setEditingManifest({
        ...editingManifest,
        [field]: value
      });
    }
  };

  const updateIcon = (index: number, field: keyof ManifestInfo['icons'][0], value: string) => {
    if (editingManifest && editingManifest.icons) {
      const updatedIcons = [...editingManifest.icons];
      updatedIcons[index] = {
        ...updatedIcons[index],
        [field]: value
      };
      setEditingManifest({
        ...editingManifest,
        icons: updatedIcons
      });
    }
  };

  const addIcon = () => {
    if (editingManifest) {
      const newIcon = {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png'
      };
      setEditingManifest({
        ...editingManifest,
        icons: [...(editingManifest.icons || []), newIcon]
      });
    }
  };

  const removeIcon = (index: number) => {
    if (editingManifest && editingManifest.icons) {
      const updatedIcons = editingManifest.icons.filter((_, i) => i !== index);
      setEditingManifest({
        ...editingManifest,
        icons: updatedIcons
      });
    }
  };

  const addPermission = (permission: string) => {
    if (editingManifest) {
      const updatedPermissions = [...(editingManifest.permissions || []), permission];
      setEditingManifest({
        ...editingManifest,
        permissions: updatedPermissions
      });
    }
  };

  const removePermission = (index: number) => {
    if (editingManifest && editingManifest.permissions) {
      const updatedPermissions = editingManifest.permissions.filter((_, i) => i !== index);
      setEditingManifest({
        ...editingManifest,
        permissions: updatedPermissions
      });
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading manifest data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-red-600 dark:text-red-400 mb-2">Error loading manifest</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <div className="flex space-x-2 justify-center">
            <button
              onClick={fetchManifestData}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              Retry
            </button>
            <button
              onClick={handleGenerateSample}
              className="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
            >
              Generate Sample
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentManifest = isEditing ? editingManifest : manifest;
  const currentValidation = isEditing ?
    (editingManifest ? ManifestService.validateManifest(editingManifest) : null) :
    validation;

  if (!currentManifest) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📋</div>
          <h2 className="text-xl font-medium mb-2">No Manifest Found</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            This website doesn't have a PWA manifest file
          </p>
          <div className="flex space-x-2 justify-center">
            <button
              onClick={handleGenerateSample}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              Generate Sample Manifest
            </button>
            <button
              onClick={fetchManifestData}
              className="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
            >
              Refresh
            </button>
          </div>
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
            {!isEditing ? (
              <>
                <button
                  onClick={handleEdit}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                >
                  Edit Manifest
                </button>
                <button
                  onClick={handleDownload}
                  className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                >
                  Download
                </button>
                <button
                  onClick={validateCurrentManifest}
                  className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
                >
                  Validate
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </>
            )}
            <button
              onClick={fetchManifestData}
              className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
            >
              Refresh
            </button>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {currentValidation?.isValid ? (
              <span className="text-green-600 dark:text-green-400">✓ Valid</span>
            ) : (
              <span className="text-red-600 dark:text-red-400">✗ Invalid</span>
            )}
          </div>
        </div>
      </div>

      {/* Validation Messages */}
      {currentValidation && (
        <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 p-3">
          {currentValidation.errors.length > 0 && (
            <div className="mb-2">
              <h4 className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">Errors:</h4>
              <ul className="text-xs text-red-600 dark:text-red-300 space-y-1">
                {currentValidation.errors.map((error: string, index: number) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
          {currentValidation.warnings.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-yellow-700 dark:text-yellow-400 mb-1">Warnings:</h4>
              <ul className="text-xs text-yellow-600 dark:text-yellow-300 space-y-1">
                {currentValidation.warnings.map((warning: string, index: number) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  App Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={currentManifest.name}
                    onChange={(e) => updateEditingField('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100">
                    {currentManifest.name}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Short Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={currentManifest.shortName}
                    onChange={(e) => updateEditingField('shortName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100">
                    {currentManifest.shortName}
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                {isEditing ? (
                  <textarea
                    value={currentManifest.description}
                    onChange={(e) => updateEditingField('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100">
                    {currentManifest.description}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Display Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start URL
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={currentManifest.startUrl}
                    onChange={(e) => updateEditingField('startUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100">
                    {currentManifest.startUrl}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Display Mode
                </label>
                {isEditing ? (
                  <select
                    value={currentManifest.display}
                    onChange={(e) => updateEditingField('display', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <option value="standalone">Standalone</option>
                    <option value="fullscreen">Fullscreen</option>
                    <option value="minimal-ui">Minimal UI</option>
                    <option value="browser">Browser</option>
                  </select>
                ) : (
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100">
                    {currentManifest.display}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Theme Color
                </label>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: currentManifest.themeColor }}
                  ></div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentManifest.themeColor}
                      onChange={(e) => updateEditingField('themeColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  ) : (
                    <div className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100">
                      {currentManifest.themeColor}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Icons */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Icons
              </h3>
              {isEditing && (
                <button
                  onClick={addIcon}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                >
                  Add Icon
                </button>
              )}
            </div>
            <div className="space-y-3">
              {currentManifest.icons?.map((icon, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {icon.sizes}
                    </span>
                  </div>
                  <div className="flex-1 space-y-2">
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          value={icon.src}
                          onChange={(e) => updateIcon(index, 'src', e.target.value)}
                          placeholder="Icon URL"
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                        <input
                          type="text"
                          value={icon.sizes}
                          onChange={(e) => updateIcon(index, 'sizes', e.target.value)}
                          placeholder="192x192"
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                        <input
                          type="text"
                          value={icon.type}
                          onChange={(e) => updateIcon(index, 'type', e.target.value)}
                          placeholder="image/png"
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </>
                    ) : (
                      <>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {icon.src}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {icon.sizes} • {icon.type}
                        </div>
                      </>
                    )}
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => removeIcon(index)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Permissions
              </h3>
              {isEditing && (
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      addPermission(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                >
                  <option value="">Add Permission</option>
                  <option value="notifications">Notifications</option>
                  <option value="geolocation">Geolocation</option>
                  <option value="camera">Camera</option>
                  <option value="microphone">Microphone</option>
                  <option value="storage">Storage</option>
                </select>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {currentManifest.permissions?.map((permission, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                    {permission}
                  </span>
                  {isEditing && (
                    <button
                      onClick={() => removePermission(index)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManifestPanel;
