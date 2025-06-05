'use client';

import { AddTripForm } from '@/components/forms/add-trip-form';
import { ScrollArea } from '@/components/ui/scroll-area';

export function AddTripView() {
  return (
    <ScrollArea className="h-[calc(100vh-150px)]">
      <AddTripForm />
    </ScrollArea>
  );
}
