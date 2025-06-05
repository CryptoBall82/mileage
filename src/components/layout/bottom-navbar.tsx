'use client';

import { useAppContext, type ActiveView } from '@/contexts/app-context';
import { Button } from '@/components/ui/button';
import { ScrollText, PlaneTakeoff, Receipt, PlusCircle } from 'lucide-react';
import { FIXED_HEADER_NAV_HEIGHT } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface NavItemProps {
  label: string;
  view: ActiveView;
  icon: React.ElementType;
}

export function BottomNavbar() {
  const { activeView, setActiveView } = useAppContext();

  const navItems: NavItemProps[] = [
    { label: 'Log', view: 'log', icon: ScrollText },
    { label: 'Add Trip', view: 'addTrip', icon: PlaneTakeoff },
    { label: 'Add Expense', view: 'addExpense', icon: Receipt },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2 bg-background/80 backdrop-blur-md border-t border-t-[hsl(var(--officiaX-red))]"
      style={{ height: FIXED_HEADER_NAV_HEIGHT }}
    >
      {navItems.map((item) => (
        <Button
          key={item.view}
          variant="ghost"
          onClick={() => setActiveView(item.view)}
          className={cn(
            "flex flex-col items-center justify-center h-full p-2 text-xs text-muted-foreground transition-colors duration-200 ease-in-out",
            activeView === item.view ? "text-primary font-semibold" : "hover:text-foreground",
            activeView === item.view ? "border-b-2 border-primary" : ""
          )}
          aria-current={activeView === item.view ? "page" : undefined}
        >
          <item.icon className={cn(
            "h-6 w-6 mb-1 transition-transform duration-200 ease-in-out",
            activeView === item.view ? "scale-110" : "scale-100"
           )} />
          {item.label}
        </Button>
      ))}
    </nav>
  );
}
