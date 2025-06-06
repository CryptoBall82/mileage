// src/app/mileage-expense/page.tsx (You can create this file at this path)

'use client';

import React, { useState } from 'react';
import { DefaultHeader } from '@/components/layout/DefaultHeader'; // Your existing header component
import { NavbarTools } from '@/components/layout/NavbarTools';     // Your existing navbar component
import { Button } from '@/components/ui/button';             // Your existing button component

// If you have specific UI library components for inputs, selects, textareas,
// you would import them here instead of using native HTML elements.
// Example:
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Optional: Import a camera icon if you have one (e.g., from lucide-react)
// import { Camera } from 'lucide-react';

// --- Data Interfaces (for type safety and example data) ---
interface Trip {
  id: string;
  date: string;
  purpose: 'business' | 'personal';
  mileage: number;
  startLocation?: string;
  endLocation?: string;
  notes?: string;
  type: 'trip';
}

interface Expense {
  id: string;
  date: string;
  purpose: 'business' | 'personal';
  description: string;
  amount: number;
  receiptImage?: string; // Placeholder for receipt image path/data
  type: 'expense';
}

type LogEntry = Trip | Expense; // A union type for items in the log

// --- Main Component ---
export default function MileageExpenseTrackerPage() {
  // State to manage which section (Add Trip, Add Expense, View Log) is currently visible
  const [activeSection, setActiveSection] = useState<'addTrip' | 'addExpense' | 'viewLog'>('addTrip');

  // State to hold the data for the "Add Trip" form
  const [tripForm, setTripForm] = useState({
    date: '',
    purpose: 'business', // Default purpose
    mileage: '', // Stored as string to handle empty input
    startLocation: '',
    endLocation: '',
    notes: ''
  });

  // State to hold the data for the "Add Expense" form
  const [expenseForm, setExpenseForm] = useState({
    date: '',
    purpose: 'business', // Default purpose
    description: '',
    amount: '', // Stored as string to handle empty input
  });

  // State to store the list of trips and expenses (will be replaced by local storage in your real app)
  const [logData, setLogData] = useState<LogEntry[]>([
    // Example data to show how the log will look
    { id: '1', date: '2025-06-01', purpose: 'business', mileage: 15.5, startLocation: 'Office', endLocation: 'Client A', notes: 'Meeting with John', type: 'trip' },
    { id: '2', date: '2025-06-02', purpose: 'personal', description: 'Coffee', amount: 4.50, type: 'expense' },
    { id: '3', date: '2025-06-03', purpose: 'business', mileage: 50.2, startLocation: 'Client A', endLocation: 'Client B', type: 'trip' },
  ]);

  // --- Form Submission Handlers (simplified for UI demonstration) ---

  const handleAddTrip = () => {
    // In your actual app, you'd add input validation here.
    // Also, implement the mileage calculation logic if start/end locations are provided.
    console.log('Attempting to add Trip:', tripForm);

    const newTrip: Trip = {
      id: Date.now().toString(), // Simple unique ID (use UUID in production)
      date: tripForm.date,
      purpose: tripForm.purpose as 'business' | 'personal',
      mileage: parseFloat(tripForm.mileage) || 0, // Convert to number
      startLocation: tripForm.startLocation,
      endLocation: tripForm.endLocation,
      notes: tripForm.notes,
      type: 'trip',
    };
    // Add new trip and sort log chronologically (newest first)
    setLogData(prev => [...prev, newTrip].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

    // Reset the form fields after submission
    setTripForm({ date: '', purpose: 'business', mileage: '', startLocation: '', endLocation: '', notes: '' });
    setActiveSection('viewLog'); // Optionally switch to the log view after adding
  };

  const handleAddExpense = () => {
    // In your actual app, add input validation.
    console.log('Attempting to add Expense:', expenseForm);

    const newExpense: Expense = {
      id: Date.now().toString(), // Simple unique ID
      date: expenseForm.date,
      purpose: expenseForm.purpose as 'business' | 'personal',
      description: expenseForm.description,
      amount: parseFloat(expenseForm.amount) || 0, // Convert to number
      type: 'expense',
    };
    // Add new expense and sort log chronologically
    setLogData(prev => [...prev, newExpense].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

    // Reset the form fields after submission
    setExpenseForm({ date: '', purpose: 'business', description: '', amount: '' });
    setActiveSection('viewLog'); // Optionally switch to the log view after adding
  };

  const handleAddReceipt = () => {
    // This is where you would integrate with a camera API for mobile
    console.log('Activating camera for receipt photo...');
    alert('Camera function not implemented in this UI demo.');
  };

  const handleResetData = () => {
    // Confirmation before clearing all data
    if (window.confirm("Are you sure you want to clear ALL mileage and expense data? This action cannot be undone.")) {
      setLogData([]); // Clear the local state (in a real app, you'd clear local storage)
      console.log('All mileage and expense data has been reset.');
      setActiveSection('viewLog'); // Show empty log
    }
  };

  // --- Render UI ---
  return (
    <div className="flex flex-col h-screen items-center mx-auto max-w-[500px] bg-black text-white">
      {/* Default Header at the top */}
      <DefaultHeader />

      {/* Main Content Area: Scrolls if content overflows */}
      <div className="flex-grow relative w-full overflow-y-auto p-4">
        {/* Page Title */}
        <div className="text-center mb-6 mt-2">
          <span className="font-bold text-3xl">Mileage & Expense Tracker</span>
        </div>

        {/* Section Navigation Buttons (Add Trip, Add Expense, View Log) */}
        <div className="flex justify-around mb-6 px-2">
          <Button
            onClick={() => setActiveSection('addTrip')}
            // Tailwind classes for active/inactive state
            className={`w-1/3 py-2 text-sm font-semibold rounded-md ${activeSection === 'addTrip' ? 'bg-red-700 text-white shadow-md' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            Add Trip
          </Button>
          <Button
            onClick={() => setActiveSection('addExpense')}
            className={`w-1/3 py-2 text-sm font-semibold rounded-md mx-2 ${activeSection === 'addExpense' ? 'bg-red-700 text-white shadow-md' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            Add Expense
          </Button>
          <Button
            onClick={() => setActiveSection('viewLog')}
            className={`w-1/3 py-2 text-sm font-semibold rounded-md ${activeSection === 'viewLog' ? 'bg-red-700 text-white shadow-md' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            View Log
          </Button>
        </div>

        {/* --- Dynamic Content Section (based on activeSection state) --- */}

        {/* 1. Add New Trip Form */}
        {activeSection === 'addTrip' && (
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-4">
            <h2 className="text-2xl font-bold mb-4 text-center text-white">Add New Trip</h2>
            <div className="space-y-4"> {/* Vertical spacing between form fields */}
              {/* Date Input */}
              <div>
                <label htmlFor="trip-date" className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date" // HTML5 date picker
                  id="trip-date"
                  className="w-full p-2 rounded-md bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-700"
                  value={tripForm.date}
                  onChange={(e) => setTripForm({ ...tripForm, date: e.target.value })}
                />
              </div>

              {/* Purpose Dropdown */}
              <div>
                <label htmlFor="trip-purpose" className="block text-sm font-medium mb-1">Purpose</label>
                <select
                  id="trip-purpose"
                  className="w-full p-2 rounded-md bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-700"
                  value={tripForm.purpose}
                  onChange={(e) => setTripForm({ ...tripForm, purpose: e.target.value as 'business' | 'personal' })}
                >
                  <option value="business">Business</option>
                  <option value="personal">Personal</option>
                </select>
              </div>

              {/* Mileage Input / Calculation Block */}
              <div className="bg-gray-800 p-3 rounded-md border border-gray-700">
                <h3 className="text-md font-semibold mb-3 text-white">Mileage</h3>
                <p className="text-sm text-gray-300 mb-2">Enter manually or calculate from locations.</p>
                <div>
                  <label htmlFor="trip-mileage" className="block text-sm font-medium mb-1">Manual Mileage (miles)</label>
                  <input
                    type="number"
                    id="trip-mileage"
                    className="w-full p-2 rounded-md bg-black border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-700"
                    placeholder="e.g., 15.5"
                    step="0.1" // Allows decimal input
                    value={tripForm.mileage}
                    onChange={(e) => setTripForm({ ...tripForm, mileage: e.target.value })}
                  />
                </div>
                <p className="text-center text-gray-400 my-4">- OR -</p>
                <div>
                  <label htmlFor="start-location" className="block text-sm font-medium mb-1">Start Location</label>
                  <input
                    type="text"
                    id="start-location"
                    className="w-full p-2 rounded-md bg-black border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-700 mb-2"
                    placeholder="e.g., 123 Main St, City"
                    value={tripForm.startLocation}
                    onChange={(e) => setTripForm({ ...tripForm, startLocation: e.target.value })}
                  />
                  <label htmlFor="end-location" className="block text-sm font-medium mb-1">End Location</label>
                  <input
                    type="text"
                    id="end-location"
                    className="w-full p-2 rounded-md bg-black border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-700"
                    placeholder="e.g., 456 Oak Ave, City"
                    value={tripForm.endLocation}
                    onChange={(e) => setTripForm({ ...tripForm, endLocation: e.target.value })}
                  />
                  <Button
                    onClick={() => alert("Integration with mapping API for mileage calculation goes here!")}
                    className="mt-3 w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded-md transition-colors shadow-md"
                  >
                    Calculate Mileage
                  </Button>
                </div>
              </div> {/* End Mileage Input / Calculation Block */}

              {/* Notes Textarea */}
              <div>
                <label htmlFor="trip-notes" className="block text-sm font-medium mb-1">Notes (Optional)</label>
                <textarea
                  id="trip-notes"
                  className="w-full p-2 rounded-md bg-gray-800 border border-gray-600 text-white h-20 focus:outline-none focus:ring-2 focus:ring-red-700"
                  placeholder="Any specific details about the trip..."
                  value={tripForm.notes}
                  onChange={(e) => setTripForm({ ...tripForm, notes: e.target.value })}
                ></textarea>
              </div>
              {/* Submit Trip Button */}
              <Button
                onClick={handleAddTrip}
                className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-3 rounded-md text-lg transition-colors shadow-md mt-4"
              >
                Add Trip
              </Button>
            </div>
          </div>
        )}

        {/* 2. Add New Expense Form */}
        {activeSection === 'addExpense' && (
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-4">
            <h2 className="text-2xl font-bold mb-4 text-center text-white">Add New Expense</h2>
            <div className="space-y-4">
              {/* Date Input */}
              <div>
                <label htmlFor="expense-date" className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  id="expense-date"
                  className="w-full p-2 rounded-md bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-700"
                  value={expenseForm.date}
                  onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                />
              </div>

              {/* Purpose Dropdown */}
              <div>
                <label htmlFor="expense-purpose" className="block text-sm font-medium mb-1">Purpose</label>
                <select
                  id="expense-purpose"
                  className="w-full p-2 rounded-md bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-700"
                  value={expenseForm.purpose}
                  onChange={(e) => setExpenseForm({ ...expenseForm, purpose: e.target.value as 'business' | 'personal' })}
                >
                  <option value="business">Business</option>
                  <option value="personal">Personal</option>
                </select>
              </div>

              {/* Description Input */}
              <div>
                <label htmlFor="expense-description" className="block text-sm font-medium mb-1">Description</label>
                <input
                  type="text"
                  id="expense-description"
                  className="w-full p-2 rounded-md bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-700"
                  placeholder="e.g., Gas, Equipment, Food"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                />
              </div>

              {/* Amount Input */}
              <div>
                <label htmlFor="expense-amount" className="block text-sm font-medium mb-1">Amount ($)</label>
                <input
                  type="number"
                  id="expense-amount"
                  className="w-full p-2 rounded-md bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-700"
                  placeholder="e.g., 25.75"
                  step="0.01" // Allows decimal currency input
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                />
              </div>

              {/* Add Receipt Photo Button */}
              <Button
                onClick={handleAddReceipt}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-md transition-colors flex items-center justify-center space-x-2 shadow-md"
              >
                {/* Add a camera icon here if you have one, e.g., <Camera className="h-5 w-5" /> */}
                <span>Add Receipt Photo</span>
              </Button>

              {/* Submit Expense Button */}
              <Button
                onClick={handleAddExpense}
                className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-3 rounded-md text-lg transition-colors shadow-md mt-4"
              >
                Add Expense
              </Button>
            </div>
          </div>
        )}

        {/* 3. Trip & Expense Log Display */}
        {activeSection === 'viewLog' && (
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-4">
            <h2 className="text-2xl font-bold mb-4 text-center text-white">Trip & Expense Log</h2>
            {logData.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No trips or expenses logged yet.</p>
            ) : (
              <div className="space-y-4"> {/* Vertical spacing between log entries */}
                {logData.map((entry) => (
                  <div key={entry.id} className="bg-gray-800 p-4 rounded-md border border-gray-700">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-300 text-sm">{entry.date}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${entry.purpose === 'business' ? 'bg-blue-600' : 'bg-green-600'}`}>
                        {entry.purpose.toUpperCase()}
                      </span>
                    </div>
                    {entry.type === 'trip' ? (
                      // Display for a Trip entry
                      <div>
                        <p className="text-lg font-semibold text-red-400">Trip: {entry.mileage} miles</p>
                        {entry.startLocation && entry.endLocation && (
                          <p className="text-sm text-gray-300">From: {entry.startLocation} To: {entry.endLocation}</p>
                        )}
                        {entry.notes && <p className="text-sm text-gray-400 mt-1">Notes: {entry.notes}</p>}
                      </div>
                    ) : (
                      // Display for an Expense entry
                      <div>
                        <p className="text-lg font-semibold text-red-400">Expense: ${entry.amount.toFixed(2)}</p>
                        <p className="text-sm text-gray-300">Description: {entry.description}</p>
                        {entry.receiptImage && <span className="text-xs text-blue-400"> (Receipt Attached)</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Clear All Data Button */}
            <Button
              onClick={handleResetData}
              className="w-full bg-red-900 hover:bg-red-800 text-white font-bold py-3 rounded-md text-lg transition-colors shadow-md mt-6"
            >
              Clear All Data
            </Button>
          </div>
        )}
      </div>

      {/* Navbar at the bottom */}
      <NavbarTools />
    </div>
  );
}