import { z } from 'zod';

const DEPARTMENTS = ['COE', 'CCS', 'BSBA', 'COED', 'CHAS'] as const;

const COURSES_BY_DEPARTMENT: Record<(typeof DEPARTMENTS)[number], string[]> = {
  COE: ['BSCPE', 'BSIE', 'BSECE'],
  CCS: ['BSIT', 'BSCS'],
  BSBA: ['BSA', 'Marketing', 'Financial Management'],
  COED: [
    'BS Secondary Education - Major in Math',
    'BS Secondary Education - Major in Social Science',
    'BS Secondary Education - Major in English',
    'BS Secondary Education - Major in Filipino',
    'Elementary Education',
  ],
  CHAS: ['BSN', 'BSPSY'],
};

export const applicationFormSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Please enter your full name.'),
    email: z.string().trim().email('Please enter a valid email address.'),
    studentId: z
      .string()
      .trim()
      .regex(/^\d{7}$/, 'Student ID must be exactly 7 digits, numbers only.'),
    department: z.enum(DEPARTMENTS, {
      error: 'Please select a department.',
    }),
    course: z.string().min(1, 'Please select a course.'),
    yearLevel: z.string().min(1, 'Please select a year level.'),
    gamesPlayed: z.string().trim().min(1, 'Please tell us what games you play.'),
    message: z.string().trim().min(10, 'Please write a bit more about why you want to join.'),
    paymentMethod: z.enum(['CASH', 'ONLINE'], {
      error: 'Please select a payment method.',
    }),
  })
  .refine((data) => COURSES_BY_DEPARTMENT[data.department]?.includes(data.course), {
    message: 'Selected course does not match the selected department.',
    path: ['course'],
  });

export type ApplicationFormData = z.infer<typeof applicationFormSchema>;