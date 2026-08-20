import { z } from 'zod';

export const applicationFormSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required.').max(120),
  email: z.string().trim().email('Enter a valid email address.'),
  studentId: z.string().trim().min(1, 'Student ID is required.').max(50),
  courseYear: z.string().trim().min(1, 'Course & year level is required.').max(100),
  gamesPlayed: z.string().trim().min(1, 'Let us know what games you play.').max(300),
  message: z.string().trim().min(1, 'Tell us why you want to join.').max(1000),
  paymentMethod: z.enum(["CASH", "ONLINE"]),
});

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;
