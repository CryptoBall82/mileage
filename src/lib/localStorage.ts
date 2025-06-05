import type { Trip, Expense, AppSettings, LogItem } from './types';
import { LOCAL_STORAGE_KEYS } from './constants';

function getItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  const item = window.localStorage.getItem(key);
  return item ? (JSON.parse(item) as T) : null;
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

// Trips
export const getStoredTrips = (): Trip[] => getItem<Trip[]>(LOCAL_STORAGE_KEYS.TRIPS) || [];
export const storeTrips = (trips: Trip[]): void => setItem(LOCAL_STORAGE_KEYS.TRIPS, trips);

// Expenses
export const getStoredExpenses = (): Expense[] => getItem<Expense[]>(LOCAL_STORAGE_KEYS.EXPENSES) || [];
export const storeExpenses = (expenses: Expense[]): void => setItem(LOCAL_STORAGE_KEYS.EXPENSES, expenses);

// Settings
export const getStoredSettings = (): AppSettings => getItem<AppSettings>(LOCAL_STORAGE_KEYS.SETTINGS) || { unit: 'km' };
export const storeSettings = (settings: AppSettings): void => setItem(LOCAL_STORAGE_KEYS.SETTINGS, settings);

// Combined LogItems
export const getStoredLogItems = (): LogItem[] => {
  const trips = getStoredTrips();
  const expenses = getStoredExpenses();
  const combined = [...trips, ...expenses];
  return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const resetAllData = (): void => {
  storeTrips([]);
  storeExpenses([]);
  storeSettings({ unit: 'km' });
};
