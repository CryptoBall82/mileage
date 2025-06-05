'use client';

import { APP_NAME, FIXED_HEADER_NAV_HEIGHT } from '@/lib/constants';
import { UnitSwitcher } from '@/components/common/unit-switcher';
import { DataResetButton } from '@/components/common/data-reset-button';

export function AppHeader() {
  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 bg-background/80 backdrop-blur-md border-b border-b-[hsl(var(--officiaX-red))]"
      style={{ height: FIXED_HEADER_NAV_HEIGHT }}
    >
      <h1 className="text-xl font-headline font-bold text-foreground">{APP_NAME}</h1>
      <div className="flex items-center space-x-2">
        <UnitSwitcher />
        <DataResetButton />
      </div>
    </header>
  );
}
