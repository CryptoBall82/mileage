'use client';

import type { Trip } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { MapPin, Edit2, Plane, Briefcase, User } from 'lucide-react';
import { MILE_TO_KM_CONVERSION_RATE, KM_TO_MILE_CONVERSION_RATE } from '@/lib/constants';
import { useAppContext } from '@/contexts/app-context';

interface TripCardProps {
  trip: Trip;
}

export function TripCard({ trip }: TripCardProps) {
  const { settings } = useAppContext();

  let displayMileage = trip.mileage;
  let displayUnit = trip.unit;

  if (trip.unit === 'km' && settings.unit === 'miles') {
    displayMileage = trip.mileage * KM_TO_MILE_CONVERSION_RATE;
    displayUnit = 'miles';
  } else if (trip.unit === 'miles' && settings.unit === 'km') {
    displayMileage = trip.mileage * MILE_TO_KM_CONVERSION_RATE;
    displayUnit = 'km';
  }

  return (
    <Card className="mb-4 shadow-lg bg-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline text-lg flex items-center">
              <Plane className="mr-2 h-5 w-5 text-primary" /> Trip on {format(new Date(trip.date), 'PPP')}
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              {trip.purpose === 'business' ? <Briefcase className="mr-2 h-4 w-4" /> : <User className="mr-2 h-4 w-4" />}
              {trip.purpose.charAt(0).toUpperCase() + trip.purpose.slice(1)}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-2xl font-semibold text-primary">
          {displayMileage.toFixed(2)} <span className="text-sm text-muted-foreground">{displayUnit}</span>
        </p>
        {trip.mileageType === 'calculated' && (trip.startLocation || trip.endLocation) && (
          <div className="text-sm text-muted-foreground space-y-1">
            {trip.startLocation && <p className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-green-500" /> From: {trip.startLocation}</p>}
            {trip.endLocation && <p className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-red-500" /> To: {trip.endLocation}</p>}
          </div>
        )}
        {trip.notes && (
          <div className="pt-2">
            <h4 className="font-semibold text-sm mb-1 flex items-center"><Edit2 className="mr-2 h-4 w-4" /> Notes:</h4>
            <p className="text-sm text-muted-foreground bg-secondary p-2 rounded-md">{trip.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
