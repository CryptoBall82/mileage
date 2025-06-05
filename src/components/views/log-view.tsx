'use client';

import { useAppContext } from '@/contexts/app-context';
import { TripCard } from '@/components/log/trip-card';
import { ExpenseCard } from '@/components/log/expense-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Frown } from 'lucide-react';

export function LogView() {
  const { logItems, isLoading } = useAppContext();

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    );
  }

  if (logItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)] text-center p-4">
        <Frown className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">No Entries Yet</h2>
        <p className="text-muted-foreground">Start by adding a new trip or expense using the buttons below.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-150px)] p-4"> {/* Adjust height based on header/nav height */}
      {logItems.map((item) =>
        item.type === 'trip' ? (
          <TripCard key={item.id} trip={item} />
        ) : (
          <ExpenseCard key={item.id} expense={item} />
        )
      )}
    </ScrollArea>
  );
}
