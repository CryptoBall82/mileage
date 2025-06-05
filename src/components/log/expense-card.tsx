'use client';

import type { Expense } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Receipt, Briefcase, User, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


interface ExpenseCardProps {
  expense: Expense;
}

export function ExpenseCard({ expense }: ExpenseCardProps) {
  return (
    <Card className="mb-4 shadow-lg bg-card">
      <CardHeader>
         <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline text-lg flex items-center">
                <Receipt className="mr-2 h-5 w-5 text-primary" /> Expense on {format(new Date(expense.date), 'PPP')}
                </CardTitle>
                <CardDescription className="flex items-center mt-1">
                {expense.purpose === 'business' ? <Briefcase className="mr-2 h-4 w-4" /> : <User className="mr-2 h-4 w-4" />}
                {expense.purpose.charAt(0).toUpperCase() + expense.purpose.slice(1)}
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-2xl font-semibold text-primary">${expense.amount.toFixed(2)}</p>
        <p className="text-sm text-foreground">{expense.description}</p>
        {expense.receiptImage && (
          <div className="mt-2">
            <Dialog>
              <DialogTrigger asChild>
                <button className="focus:outline-none group">
                  <div className="relative w-24 h-24 border rounded-md overflow-hidden group-hover:opacity-80 transition-opacity cursor-pointer">
                    <Image src={expense.receiptImage} alt="Receipt" layout="fill" objectFit="cover" data-ai-hint="receipt document" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <ImageIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[70vw] md:max-w-[50vw] lg:max-w-[40vw] p-2">
                <DialogHeader>
                  <DialogTitle>Receipt Preview</DialogTitle>
                </DialogHeader>
                <div className="relative w-full h-auto max-h-[80vh] aspect-auto">
                   <Image src={expense.receiptImage} alt="Receipt Full Preview" layout="responsive" width={800} height={1200} objectFit="contain" data-ai-hint="receipt document" />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
