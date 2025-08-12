export type ManifestInfo = {
  name: string;
  shortName: string;
  description: string;
  startUrl: string;
  display: string;
  themeColor: string;
  backgroundColor: string;
  icons: Array<{
    src: string;
    sizes: string;
    type: string;
  }>;
  permissions: string[];
  scope?: string;
  orientation?: string;
  categories?: string[];
  lang?: string;
  dir?: string;
  preferRelatedApplications?: boolean;
  relatedApplications?: Array<{
    platform: string;
    url?: string;
    id?: string;
  }>;
};

export class ManifestService {
  /**
   * Get the current active tab
   */
  private static async getCurrentTab() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab.id) {
        throw new Error('No active tab found');
      }
      
      // Check if the tab URL is accessible
      if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
        throw new Error('Cannot access manifest for this type of page (chrome:// or chrome-extension://)');
      }
      
      return tab;
    } catch (error) {
      console.error('Error getting current tab:', error);
      throw new Error('Failed to get current tab. Please make sure you are on a regular website.');
    }
  }

  /**
   * Execute script in the current tab
   */
  private static async executeScript<T>(func: (...args: any[]) => T, args: any[] = []): Promise<T> {
    try {
      const tab = await this.getCurrentTab();
      
      // Check if we can inject scripts into this tab
      if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
        throw new Error('Cannot execute scripts on this type of page');
      }

      const result = await chrome.scripting.executeScript({
        target: { tabId: tab.id! },
        func,
        args
      });

      if (result && result[0] && result[0].result !== undefined) {
        return result[0].result as T;
      }
      throw new Error('Failed to execute script');
    } catch (error) {
      if (error instanceof Error) {
        // Check for specific Chrome extension errors
        if (error.message.includes('Cannot access contents of url')) {
          throw new Error('Permission denied. Please make sure the extension has permission to access this website.');
        }
        if (error.message.includes('Cannot execute scripts on this type of page')) {
          throw new Error('Cannot access manifest on this type of page (chrome://, chrome-extension://, etc.)');
        }
        throw error;
      }
      throw new Error('Failed to execute script in the current tab');
    }
  }

  /**
   * Fetch manifest data from the current tab
   */
  static async getManifestData(): Promise<ManifestInfo | null> {
    try {
      return await this.executeScript(() => {
        try {
          // Method 1: Check for manifest link in HTML
          const manifestLink = document.querySelector('link[rel="manifest"]');
          if (manifestLink && manifestLink.getAttribute('href')) {
            const manifestUrl = new URL(manifestLink.getAttribute('href')!, window.location.href);
            return fetch(manifestUrl.href)
              .then(response => {
                if (!response.ok) {
                  throw new Error(`Failed to fetch manifest: ${response.status}`);
                }
                return response.json();
              })
              .catch(error => {
                console.error('Error fetching manifest:', error);
                return null;
              });
          }

          // Method 2: Check if manifest is embedded in HTML
          const manifestScript = document.querySelector('script[type="application/manifest+json"]');
          if (manifestScript && manifestScript.textContent) {
            try {
              return JSON.parse(manifestScript.textContent);
            } catch (error) {
              console.error('Error parsing embedded manifest:', error);
              return null;
            }
          }

          // Method 3: Try to get manifest from navigator
          if ('serviceWorker' in navigator && 'getManifest' in navigator) {
            try {
              return (navigator as any).getManifest();
            } catch (error) {
              console.error('Error getting manifest from navigator:', error);
              return null;
            }
          }

          return null;
        } catch (error) {
          console.error('Error accessing manifest:', error);
          throw new Error('Failed to access manifest on this page');
        }
      });
    } catch (error) {
      console.error('Error fetching manifest:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch manifest data');
    }
  }

  /**
   * Validate manifest data
   */
  static validateManifest(manifest: ManifestInfo): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!manifest.name) {
      errors.push('name is required');
    }
    if (!manifest.shortName) {
      errors.push('shortName is required');
    }
    if (!manifest.startUrl) {
      errors.push('startUrl is required');
    }
    if (!manifest.display) {
      errors.push('display is required');
    }

    // Icon validation
    if (!manifest.icons || manifest.icons.length === 0) {
      errors.push('At least one icon is required');
    } else {
      const has192Icon = manifest.icons.some(icon => icon.sizes.includes('192'));
      const has512Icon = manifest.icons.some(icon => icon.sizes.includes('512'));
      
      if (!has192Icon) {
        warnings.push('192x192 icon is recommended for better compatibility');
      }
      if (!has512Icon) {
        warnings.push('512x512 icon is recommended for better compatibility');
      }
    }

    // Display mode validation
    const validDisplayModes = ['standalone', 'fullscreen', 'minimal-ui', 'browser'];
    if (!validDisplayModes.includes(manifest.display)) {
      errors.push(`display must be one of: ${validDisplayModes.join(', ')}`);
    }

    // Theme color validation
    if (manifest.themeColor && !/^#[0-9A-F]{6}$/i.test(manifest.themeColor)) {
      warnings.push('themeColor should be a valid hex color');
    }

    // Background color validation
    if (manifest.backgroundColor && !/^#[0-9A-F]{6}$/i.test(manifest.backgroundColor)) {
      warnings.push('backgroundColor should be a valid hex color');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Generate a sample manifest template
   */
  static generateSampleManifest(): ManifestInfo {
    return {
      name: "My Progressive Web App",
      shortName: "MyPWA",
      description: "A sample progressive web application with modern features",
      startUrl: "/",
      display: "standalone",
      themeColor: "#3B82F6",
      backgroundColor: "#FFFFFF",
      icons: [
        {
          src: "/icon-192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "/icon-512.png",
          sizes: "512x512",
          type: "image/png"
        }
      ],
      permissions: [
        "notifications",
        "geolocation",
        "camera"
      ],
      scope: "/",
      orientation: "portrait",
      categories: ["productivity", "utilities"],
      lang: "en",
      dir: "ltr",
      preferRelatedApplications: false,
      relatedApplications: []
    };
  }

  /**
   * Download manifest as JSON file
   */
  static downloadManifest(manifest: ManifestInfo, filename: string = 'manifest.json'): void {
    try {
      const dataStr = JSON.stringify(manifest, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading manifest:', error);
      throw new Error('Failed to download manifest file');
    }
  }
}
