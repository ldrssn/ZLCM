
import { Item } from '../types';

const OLD_STORAGE_KEY = 'zoueLuCollection';
const STORAGE_KEY = 'ZoeLuCollection';

// One-time migration function to move data from the old key to the new one.
const migrateData = () => {
  try {
    const oldData = localStorage.getItem(OLD_STORAGE_KEY);
    // Only migrate if there's old data and no new data yet.
    if (oldData && !localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, oldData);
      localStorage.removeItem(OLD_STORAGE_KEY);
      console.log('Successfully migrated data to new storage key.');
    }
  } catch (error) {
    console.error('Failed to migrate data from old storage key:', error);
  }
};

// Run migration check when the service is loaded.
migrateData();

export const getItems = (): Item[] => {
  try {
    const itemsJson = localStorage.getItem(STORAGE_KEY);
    if (itemsJson) {
      return JSON.parse(itemsJson);
    } else {
      // Return an empty array instead of sample data to prevent overwrites.
      return [];
    }
  } catch (error) {
    console.error("Could not retrieve items from localStorage", error);
    // Return an empty array on error as a safe fallback.
    return [];
  }
};

export const saveItems = (items: Item[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Could not save items to localStorage", error);
  }
};