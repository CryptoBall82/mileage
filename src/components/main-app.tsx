'use client';

import { AppProvider, useAppContext } from '@/contexts/app-context';
import { AppHeader } from '@/components/layout/app-header';
import { BottomNavbar } from '@/components/layout/bottom-navbar';
import { LogView } from '@/components/views/log-view';
import { AddTripView } from '@/components/views/add-trip-view';
import { AddExpenseView } from '@/components/views/add-expense-view';
import { FIXED_HEADER_NAV_HEIGHT } from '@/lib/constants';

function AppContent() {
  const { activeView, isLoading } = useAppContext();

  if (isLoading) {
    // You might want a more sophisticated loading state here
    return <div className="flex items-center justify-center h-screen"><p>Loading XpenseTracker...</p></div>;
  }
  
  const renderView = () => {
    switch (activeView) {
      case 'log':
        return <LogView />;
      case 'addTrip':
        return <AddTripView />;
      case 'addExpense':
        return <AddExpenseView />;
      default:
        return <LogView />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main 
        className="flex-grow overflow-y-auto"
        style={{ paddingTop: FIXED_HEADER_NAV_HEIGHT, paddingBottom: FIXED_HEADER_NAV_HEIGHT }}
      >
        {renderView()}
      </main>
      <BottomNavbar />
    </div>
  );
}

export default function MainApp() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
