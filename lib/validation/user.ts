import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().trim().min(2, 'Name is required.').max(120),
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  role: z.enum(['ADMIN', 'OFFICER']),
});

export const updateUserSchema = z.object({
  name: z.string().trim().min(2, 'Name is required.').max(120),
  role: z.enum(['ADMIN', 'OFFICER']),
  // Blank means "don't change the password" — only validate length if
  // something was actually typed.
  password: z
    .union([z.literal(''), z.string().min(8, 'Password must be at least 8 characters.')])
    .optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(8, "New password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
