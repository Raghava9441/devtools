export type StorageItem = {
  key: string;
  value: string;
};

export class StorageService {
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
        throw new Error('Cannot access storage for this type of page (chrome:// or chrome-extension://)');
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
          throw new Error('Cannot access storage on this type of page (chrome://, chrome-extension://, etc.)');
        }
        throw error;
      }
      throw new Error('Failed to execute script in the current tab');
    }
  }

  /**
   * Fetch localStorage data from the current tab
   */
  static async getLocalStorageData(): Promise<StorageItem[]> {
    try {
      return await this.executeScript(() => {
        try {
          const items: StorageItem[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
              items.push({
                key,
                value: localStorage.getItem(key) || ''
              });
            }
          }
          return items;
        } catch (error) {
          console.error('Error accessing localStorage:', error);
          throw new Error('Failed to access localStorage on this page');
        }
      });
    } catch (error) {
      console.error('Error fetching localStorage:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch localStorage data');
    }
  }

  /**
   * Fetch sessionStorage data from the current tab
   */
  static async getSessionStorageData(): Promise<StorageItem[]> {
    try {
      return await this.executeScript(() => {
        try {
          const items: StorageItem[] = [];
          for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key) {
              items.push({
                key,
                value: sessionStorage.getItem(key) || ''
              });
            }
          }
          return items;
        } catch (error) {
          console.error('Error accessing sessionStorage:', error);
          throw new Error('Failed to access sessionStorage on this page');
        }
      });
    } catch (error) {
      console.error('Error fetching sessionStorage:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch sessionStorage data');
    }
  }

  /**
   * Update localStorage item
   */
  static async updateLocalStorageItem(oldKey: string, newKey: string, newValue: string): Promise<void> {
    try {
      await this.executeScript(
        (oldKey: string, newKey: string, newValue: string) => {
          try {
            if (oldKey !== newKey) {
              localStorage.removeItem(oldKey);
            }
            localStorage.setItem(newKey, newValue);
          } catch (error) {
            console.error('Error updating localStorage:', error);
            throw new Error('Failed to update localStorage on this page');
          }
        },
        [oldKey, newKey, newValue]
      );
    } catch (error) {
      console.error('Error updating localStorage:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update localStorage');
    }
  }

  /**
   * Update sessionStorage item
   */
  static async updateSessionStorageItem(oldKey: string, newKey: string, newValue: string): Promise<void> {
    try {
      await this.executeScript(
        (oldKey: string, newKey: string, newValue: string) => {
          try {
            if (oldKey !== newKey) {
              sessionStorage.removeItem(oldKey);
            }
            sessionStorage.setItem(newKey, newValue);
          } catch (error) {
            console.error('Error updating sessionStorage:', error);
            throw new Error('Failed to update sessionStorage on this page');
          }
        },
        [oldKey, newKey, newValue]
      );
    } catch (error) {
      console.error('Error updating sessionStorage:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update sessionStorage');
    }
  }

  /**
   * Delete localStorage item
   */
  static async deleteLocalStorageItem(key: string): Promise<void> {
    try {
      await this.executeScript(
        (key: string) => {
          try {
            localStorage.removeItem(key);
          } catch (error) {
            console.error('Error deleting localStorage item:', error);
            throw new Error('Failed to delete localStorage item on this page');
          }
        },
        [key]
      );
    } catch (error) {
      console.error('Error deleting localStorage item:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to delete localStorage item');
    }
  }

  /**
   * Delete sessionStorage item
   */
  static async deleteSessionStorageItem(key: string): Promise<void> {
    try {
      await this.executeScript(
        (key: string) => {
          try {
            sessionStorage.removeItem(key);
          } catch (error) {
            console.error('Error deleting sessionStorage item:', error);
            throw new Error('Failed to delete sessionStorage item on this page');
          }
        },
        [key]
      );
    } catch (error) {
      console.error('Error deleting sessionStorage item:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to delete sessionStorage item');
    }
  }

  /**
   * Add new localStorage item
   */
  static async addLocalStorageItem(key: string, value: string): Promise<void> {
    try {
      await this.executeScript(
        (key: string, value: string) => {
          try {
            localStorage.setItem(key, value);
          } catch (error) {
            console.error('Error adding localStorage item:', error);
            throw new Error('Failed to add localStorage item on this page');
          }
        },
        [key, value]
      );
    } catch (error) {
      console.error('Error adding localStorage item:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to add localStorage item');
    }
  }

  /**
   * Add new sessionStorage item
   */
  static async addSessionStorageItem(key: string, value: string): Promise<void> {
    try {
      await this.executeScript(
        (key: string, value: string) => {
          try {
            sessionStorage.setItem(key, value);
          } catch (error) {
            console.error('Error adding sessionStorage item:', error);
            throw new Error('Failed to add sessionStorage item on this page');
          }
        },
        [key, value]
      );
    } catch (error) {
      console.error('Error adding sessionStorage item:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to add sessionStorage item');
    }
  }

  /**
   * Clear all localStorage
   */
  static async clearAllLocalStorage(): Promise<void> {
    try {
      await this.executeScript(() => {
        try {
          localStorage.clear();
        } catch (error) {
          console.error('Error clearing localStorage:', error);
          throw new Error('Failed to clear localStorage on this page');
        }
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to clear localStorage');
    }
  }

  /**
   * Clear all sessionStorage
   */
  static async clearAllSessionStorage(): Promise<void> {
    try {
      await this.executeScript(() => {
        try {
          sessionStorage.clear();
        } catch (error) {
          console.error('Error clearing sessionStorage:', error);
          throw new Error('Failed to clear sessionStorage on this page');
        }
      });
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to clear sessionStorage');
    }
  }
}
