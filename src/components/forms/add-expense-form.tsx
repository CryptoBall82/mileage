'use client';

import { useState, type ChangeEvent } from 'react';
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
import { CalendarIcon, Camera, Loader2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAppContext } from '@/contexts/app-context';
import type { Purpose, Expense } from '@/lib/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const expenseSchema = z.object({
  date: z.date({ required_error: "Date is required." }),
  purpose: z.enum(['business', 'personal'], { required_error: "Purpose is required." }),
  description: z.string().min(1, "Description is required."),
  amount: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Valid amount is required.",
  }),
  receiptImage: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

export function AddExpenseForm() {
  const { addExpense, setActiveView } = useAppContext();
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      purpose: 'business',
    },
  });

  const handleReceiptImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setReceiptPreview(base64String);
        setValue('receiptImage', base64String);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeReceiptImage = () => {
    setReceiptPreview(null);
    setValue('receiptImage', undefined);
    const fileInput = document.getElementById('receiptImage') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };


  const onSubmit = (data: ExpenseFormData) => {
    const expense: Omit<Expense, 'id' | 'type'> = {
      date: data.date.toISOString(),
      purpose: data.purpose as Purpose,
      description: data.description,
      amount: parseFloat(data.amount),
      receiptImage: data.receiptImage,
    };
    addExpense(expense);
    reset();
    setReceiptPreview(null);
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
        <Label htmlFor="description">Description</Label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => <Input id="description" placeholder="e.g., Client lunch, Office supplies" {...field} className="mt-1" />}
        />
        {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Controller
          name="amount"
          control={control}
          render={({ field }) => <Input id="amount" type="number" step="0.01" placeholder="0.00" {...field} className="mt-1" />}
        />
        {errors.amount && <p className="text-sm text-destructive mt-1">{errors.amount.message}</p>}
      </div>

      <div>
        <Label htmlFor="receiptImage">Receipt (Optional)</Label>
        <Input id="receiptImage" type="file" accept="image/*" capture="environment" onChange={handleReceiptImageChange} className="mt-1 file:text-primary file:font-semibold" />
        {receiptPreview && (
          <div className="mt-2 relative w-32 h-32 border rounded-md overflow-hidden">
            <Image src={receiptPreview} alt="Receipt preview" layout="fill" objectFit="cover" />
            <Button 
              type="button" 
              variant="destructive" 
              size="icon" 
              className="absolute top-1 right-1 h-6 w-6"
              onClick={removeReceiptImage}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Add Expense
      </Button>
    </form>
  );
}
