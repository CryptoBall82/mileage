'use server';

/**
 * @fileOverview Calculates trip mileage between two addresses using a maps API.
 *
 * - calculateMileage - A function that calculates mileage.
 * - CalculateMileageInput - The input type for the calculateMileage function.
 * - CalculateMileageOutput - The return type for the calculateMileage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateMileageInputSchema = z.object({
  startAddress: z.string().describe('The starting address of the trip.'),
  endAddress: z.string().describe('The ending address of the trip.'),
});
export type CalculateMileageInput = z.infer<typeof CalculateMileageInputSchema>;

const CalculateMileageOutputSchema = z.object({
  mileage: z.number().describe('The calculated mileage of the trip.'),
});
export type CalculateMileageOutput = z.infer<typeof CalculateMileageOutputSchema>;

export async function calculateMileage(input: CalculateMileageInput): Promise<CalculateMileageOutput> {
  return calculateMileageFlow(input);
}

const calculateMileageTool = ai.defineTool({
  name: 'getTripMileage',
  description: 'Calculates the trip mileage between a start and end address.',
  inputSchema: z.object({
    startAddress: z.string().describe('The starting address of the trip.'),
    endAddress: z.string().describe('The ending address of the trip.'),
  }),
  outputSchema: z.number().describe('The calculated mileage of the trip.'),
},
async (input) => {
    // In a real application, this would call a maps API to calculate the mileage.
    // This is a placeholder implementation that returns a random number.
    return Math.random() * 100;
  }
);

const calculateMileagePrompt = ai.definePrompt({
  name: 'calculateMileagePrompt',
  tools: [calculateMileageTool],
  input: {schema: CalculateMileageInputSchema},
  output: {schema: CalculateMileageOutputSchema},
  prompt: `You are a travel assistant that calculates the mileage of trips.

  The user will provide a start and end address.
  Use the getTripMileage tool to calculate the trip mileage between the start and end address.
  Return the mileage in the output.

  Start Address: {{{startAddress}}}
  End Address: {{{endAddress}}}
  `,
});

const calculateMileageFlow = ai.defineFlow(
  {
    name: 'calculateMileageFlow',
    inputSchema: CalculateMileageInputSchema,
    outputSchema: CalculateMileageOutputSchema,
  },
  async input => {
    const {output} = await calculateMileagePrompt(input);
    return output!;
  }
);
