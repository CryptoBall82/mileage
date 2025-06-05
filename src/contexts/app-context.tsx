'use client';

import type React from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Trip, Expense, Unit, LogItem, AppSettings, Purpose, MileageType } from '@/lib/types';
import { getStoredTrips, storeTrips, getStoredExpenses, storeExpenses, getStoredSettings, storeSettings, resetAllData as resetStoredData } from '@/lib/localStorage';
import { useToast } from '@/hooks/use-toast';

export type ActiveView = 'log' | 'addTrip' | 'addExpense';

interface AppContextType {
  trips: Trip[];
  expenses: Expense[];
  logItems: LogItem[];
  settings: AppSettings;
  activeView: ActiveView;
  addTrip: (tripData: Omit<Trip, 'id' | 'type'>) => void;
  addExpense: (expenseData: Omit<Expense, 'id' | 'type'>) => void;
  setUnit: (unit: Unit) => void;
  setActiveView: (view: ActiveView) => void;
  resetData: () => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [logItems, setLogItems] = useState<LogItem[]>([]);
  const [settings, setAppSettings] = useState<AppSettings>({ unit: 'km' });
  const [activeView, setActiveView] = useState<ActiveView>('log');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setTrips(getStoredTrips());
    setExpenses(getStoredExpenses());
    setAppSettings(getStoredSettings());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      storeTrips(trips);
      const combined = [...trips, ...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setLogItems(combined);
    }
  }, [trips, expenses, isLoading]); // Added expenses to dependency array

  useEffect(() => {
    if (!isLoading) {
      storeExpenses(expenses);
       const combined = [...trips, ...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setLogItems(combined);
    }
  }, [expenses, trips, isLoading]); // Added trips to dependency array


  useEffect(() => {
    if (!isLoading) {
      storeSettings(settings);
    }
  }, [settings, isLoading]);

  const addTrip = useCallback((tripData: Omit<Trip, 'id' | 'type'>) => {
    const newTrip: Trip = { ...tripData, id: Date.now().toString(), type: 'trip' };
    setTrips(prev => [newTrip, ...prev]);
    toast({ title: "Trip Added", description: "Your new trip has been logged." });
  }, [toast]);

  const addExpense = useCallback((expenseData: Omit<Expense, 'id' | 'type'>) => {
    const newExpense: Expense = { ...expenseData, id: Date.now().toString(), type: 'expense' };
    setExpenses(prev => [newExpense, ...prev]);
    toast({ title: "Expense Added", description: "Your new expense has been logged." });
  }, [toast]);

  const setUnit = useCallback((unit: Unit) => {
    setAppSettings(prev => ({ ...prev, unit }));
    toast({ title: "Unit Changed", description: `Display unit set to ${unit}.` });
  }, [toast]);

  const resetData = useCallback(() => {
    resetStoredData();
    setTrips([]);
    setExpenses([]);
    setAppSettings({ unit: 'km' });
    toast({ title: "Data Reset", description: "All your data has been cleared." });
  }, [toast]);

  return (
    <AppContext.Provider value={{ trips, expenses, logItems, settings, activeView, addTrip, addExpense, setUnit, setActiveView, resetData, isLoading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
