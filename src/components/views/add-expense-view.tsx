'use client';

import { AddExpenseForm } from '@/components/forms/add-expense-form';
import { ScrollArea } from '@/components/ui/scroll-area';

export function AddExpenseView() {
  return (
    <ScrollArea className="h-[calc(100vh-150px)]">
      <AddExpenseForm />
    </ScrollArea>
  );
}
