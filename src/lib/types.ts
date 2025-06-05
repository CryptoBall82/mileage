export type Unit = 'km' | 'miles';

export type Purpose = 'business' | 'personal';

export type MileageType = 'manual' | 'calculated';

export interface Trip {
  id: string;
  date: string; // ISO string
  purpose: Purpose;
  mileageType: MileageType;
  mileage: number;
  unit: Unit;
  startLocation?: string;
  endLocation?: string;
  notes?: string;
  type: 'trip'; // To distinguish from Expense
}

export interface Expense {
  id: string;
  date: string; // ISO string
  purpose: Purpose;
  description: string;
  amount: number;
  receiptImage?: string; // base64 string or blob URL
  type: 'expense'; // To distinguish from Trip
}

export type LogItem = Trip | Expense;

export interface AppSettings {
  unit: Unit;
}
