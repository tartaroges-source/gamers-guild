import { z } from 'zod';

export const announcementFormSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters.').max(150),
  body: z.string().trim().min(1, 'Body is required.').max(5000),
});

export type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;
