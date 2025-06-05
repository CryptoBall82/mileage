'use client';

import { useAppContext } from '@/contexts/app-context';
import { Button } from '@/components/ui/button';
import { Milestone } from 'lucide-react';

export function UnitSwitcher() {
  const { settings, setUnit } = useAppContext();

  const toggleUnit = () => {
    setUnit(settings.unit === 'km' ? 'miles' : 'km');
  };

  return (
    <Button variant="ghost" size="sm" onClick={toggleUnit} className="text-foreground hover:bg-primary/10">
      <Milestone className="mr-2 h-4 w-4" />
      {settings.unit === 'km' ? 'Switch to Miles' : 'Switch to Km'}
    </Button>
  );
}
