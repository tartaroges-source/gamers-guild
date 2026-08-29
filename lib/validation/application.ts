import { z } from 'zod';

export const applicationFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Full name is required.')
    .max(120)
    .regex(/^[A-Za-zÀ-ÿ'.\-\s]+$/, 'Name should only contain letters, spaces, and basic punctuation.'),
  email: z.string().trim().email('Enter a valid email address.'),
  studentId: z
    .string()
    .trim()
    .regex(/^\d{5,10}$/, 'Student ID should be numbers only (e.g. 1416392).'),
  courseYear: z.string().trim().min(3, 'Course & year level is required.').max(100),
  gamesPlayed: z.string().trim().min(1, 'Let us know what games you play.').max(300),
  message: z
    .string()
    .trim()
    .min(10, 'Please write at least a short sentence (10+ characters).')
    .max(1000),
  paymentMethod: z.enum(['CASH', 'ONLINE']),
});

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;