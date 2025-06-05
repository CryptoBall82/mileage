'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAppContext } from '@/contexts/app-context';
import type { Purpose, MileageType, Unit, Trip } from '@/lib/types';
import { calculateMileage } from '@/ai/flows/calculate-mileage';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const tripSchema = z.object({
  date: z.date({ required_error: "Date is required." }),
  purpose: z.enum(['business', 'personal'], { required_error: "Purpose is required." }),
  mileageType: z.enum(['manual', 'calculated'], { required_error: "Mileage type is required." }),
  manualMileage: z.string().optional(),
  startLocation: z.string().optional(),
  endLocation: z.string().optional(),
  notes: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.mileageType === 'manual') {
    if (!data.manualMileage || isNaN(parseFloat(data.manualMileage)) || parseFloat(data.manualMileage) <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Valid mileage is required for manual entry.",
        path: ['manualMileage'],
      });
    }
  } else if (data.mileageType === 'calculated') {
    if (!data.startLocation) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Start location is required.", path: ['startLocation'] });
    }
    if (!data.endLocation) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "End location is required.", path: ['endLocation'] });
    }
  }
});

type TripFormData = z.infer<typeof tripSchema>;

export function AddTripForm() {
  const { addTrip, settings, setActiveView } = useAppContext();
  const [calculatedMileage, setCalculatedMileage] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const { control, handleSubmit, watch, formState: { errors, isSubmitting }, reset, setValue } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      purpose: 'business',
      mileageType: 'manual',
    },
  });

  const mileageType = watch('mileageType');
  const startLocation = watch('startLocation');
  const endLocation = watch('endLocation');

  const handleCalculateMileage = async () => {
    if (!startLocation || !endLocation) {
      toast({ title: "Error", description: "Please enter both start and end locations.", variant: "destructive" });
      return;
    }
    setIsCalculating(true);
    setCalculatedMileage(null);
    try {
      const result = await calculateMileage({ startAddress: startLocation, endAddress: endLocation });
      if (result && typeof result.mileage === 'number') {
        // Assuming the AI returns mileage in a standard unit (e.g., miles)
        // For simplicity, let's say it returns in miles, convert if current unit is km.
        // Or, better, assume it returns a value that we can tag with a unit.
        // The AI flow current returns a number, let's assume it's in user's preferred unit, or we define a base unit.
        // For now, let's treat it as being in the 'miles' unit.
        let mileageInUserUnit = result.mileage; // Assume AI returns in miles
        if (settings.unit === 'km') {
           mileageInUserUnit = result.mileage * 1.60934; // Convert miles to km
        }
        setCalculatedMileage(mileageInUserUnit);
        toast({ title: "Mileage Calculated", description: `Distance: ${mileageInUserUnit.toFixed(2)} ${settings.unit}` });
      } else {
        throw new Error("Invalid mileage data received.");
      }
    } catch (error) {
      console.error("Mileage calculation error:", error);
      toast({ title: "Calculation Failed", description: "Could not calculate mileage.", variant: "destructive" });
    } finally {
      setIsCalculating(false);
    }
  };

  const onSubmit = (data: TripFormData) => {
    let mileageValue: number;
    let unitValue: Unit = settings.unit;

    if (data.mileageType === 'manual' && data.manualMileage) {
      mileageValue = parseFloat(data.manualMileage);
    } else if (data.mileageType === 'calculated' && calculatedMileage !== null) {
      mileageValue = calculatedMileage;
    } else {
      toast({ title: "Error", description: "Mileage information is missing or invalid.", variant: "destructive" });
      return;
    }

    const trip: Omit<Trip, 'id' | 'type'> = {
      date: data.date.toISOString(),
      purpose: data.purpose as Purpose,
      mileageType: data.mileageType as MileageType,
      mileage: mileageValue,
      unit: unitValue,
      startLocation: data.startLocation,
      endLocation: data.endLocation,
      notes: data.notes,
    };
    addTrip(trip);
    reset();
    setCalculatedMileage(null);
    setActiveView('log');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4 sm:p-6">
      <div>
        <Label htmlFor="date">Date</Label>
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
        />
        {errors.date && <p className="text-sm text-destructive mt-1">{errors.date.message}</p>}
      </div>

      <div>
        <Label htmlFor="purpose">Purpose</Label>
        <Controller
          name="purpose"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger id="purpose" className="mt-1">
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.purpose && <p className="text-sm text-destructive mt-1">{errors.purpose.message}</p>}
      </div>

      <div>
        <Label htmlFor="mileageType">Mileage Type</Label>
        <Controller
          name="mileageType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={(value) => { field.onChange(value); setCalculatedMileage(null); }} defaultValue={field.value}>
              <SelectTrigger id="mileageType" className="mt-1">
                <SelectValue placeholder="Select mileage type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="calculated">Calculated</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {mileageType === 'manual' && (
        <div>
          <Label htmlFor="manualMileage">Mileage ({settings.unit})</Label>
          <Controller
            name="manualMileage"
            control={control}
            render={({ field }) => <Input id="manualMileage" type="number" placeholder={`Enter mileage in ${settings.unit}`} {...field} className="mt-1" />}
          />
          {errors.manualMileage && <p className="text-sm text-destructive mt-1">{errors.manualMileage.message}</p>}
        </div>
      )}

      {mileageType === 'calculated' && (
        <div className="space-y-4 p-4 border rounded-md">
          <div>
            <Label htmlFor="startLocation">Start Location</Label>
            <Controller
              name="startLocation"
              control={control}
              render={({ field }) => <Input id="startLocation" placeholder="e.g., 123 Main St, Anytown" {...field} className="mt-1" />}
            />
            {errors.startLocation && <p className="text-sm text-destructive mt-1">{errors.startLocation.message}</p>}
          </div>
          <div>
            <Label htmlFor="endLocation">End Location</Label>
            <Controller
              name="endLocation"
              control={control}
              render={({ field }) => <Input id="endLocation" placeholder="e.g., 456 Oak Ave, Otherville" {...field} className="mt-1" />}
            />
            {errors.endLocation && <p className="text-sm text-destructive mt-1">{errors.endLocation.message}</p>}
          </div>
          <Button type="button" onClick={handleCalculateMileage} disabled={isCalculating || !startLocation || !endLocation} className="w-full">
            {isCalculating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Calculate Mileage
          </Button>
          {calculatedMileage !== null && (
            <p className="mt-2 text-sm text-foreground">Calculated Distance: {calculatedMileage.toFixed(2)} {settings.unit}</p>
          )}
        </div>
      )}
      
      {(mileageType === 'calculated' && !calculatedMileage && (errors.startLocation || errors.endLocation)) && (
         <p className="text-sm text-destructive mt-1">Enter locations and calculate mileage.</p>
      )}


      <div>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Controller
          name="notes"
          control={control}
          render={({ field }) => <Textarea id="notes" placeholder="Add any relevant notes..." {...field} className="mt-1" />}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting || isCalculating}>
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Add Trip
      </Button>
    </form>
  );
}
