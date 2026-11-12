/**
 * GlobalReach Web Presence & Growth Portal
 * Local Storage Abstraction & Safe Persistence Layer
 * File: js/storage.js
 */

const StorageKeys = {
  THEME: 'globalreach_theme',
  USER: 'globalreach_user',
  SESSION: 'globalreach_session',
  ESTIMATE: 'globalreach_last_estimate',
  CHAT_HISTORY: 'globalreach_chat_history',
  ENQUIRIES: 'globalreach_enquiries'
};

const StorageService = (() => {
  // In-memory fallback if localStorage is disabled or throws QuotaExceededError
  const memoryFallback = {};

  const isLocalStorageAvailable = () => {
    try {
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn('localStorage is not available, using in-memory store:', e);
      return false;
    }
  };

  const hasStorage = isLocalStorageAvailable();

  const get = (key, defaultValue = null) => {
    try {
      if (hasStorage) {
        const item = window.localStorage.getItem(key);
        if (item === null) return defaultValue;
        return JSON.parse(item);
      }
      return memoryFallback[key] !== undefined ? memoryFallback[key] : defaultValue;
    } catch (err) {
      console.error(`Error reading ${key} from storage:`, err);
      return defaultValue;
    }
  };

  const set = (key, value) => {
    try {
      if (hasStorage) {
        window.localStorage.setItem(key, JSON.stringify(value));
      } else {
        memoryFallback[key] = value;
      }
      return true;
    } catch (err) {
      console.error(`Error writing ${key} to storage:`, err);
      // Try memory fallback on quota exceed
      memoryFallback[key] = value;
      return false;
    }
  };

  const remove = (key) => {
    try {
      if (hasStorage) {
        window.localStorage.removeItem(key);
      }
      delete memoryFallback[key];
      return true;
    } catch (err) {
      console.error(`Error removing ${key} from storage:`, err);
      return false;
    }
  };

  const clear = () => {
    try {
      if (hasStorage) {
        window.localStorage.clear();
      }
      Object.keys(memoryFallback).forEach((k) => delete memoryFallback[k]);
      return true;
    } catch (err) {
      console.error('Error clearing storage:', err);
      return false;
    }
  };

  return {
    KEYS: StorageKeys,
    get,
    set,
    remove,
    clear
  };
})();

// Export globally for browser use without build steps
window.StorageService = StorageService;
