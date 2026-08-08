import { z } from 'zod';

export const aboutContentSchema = z.object({
  heroTagline: z.string().trim().max(200).optional().or(z.literal('')),
  whoWeAre: z.string().trim().max(3000).optional().or(z.literal('')),
  mission: z.string().trim().max(1500).optional().or(z.literal('')),
  vision: z.string().trim().max(1500).optional().or(z.literal('')),
  whatWeDo: z.string().trim().max(3000).optional().or(z.literal('')),
  gamingCommunities: z.string().trim().max(1500).optional().or(z.literal('')),
  whyJoin: z.string().trim().max(1500).optional().or(z.literal('')),
});

export const coreValueSchema = z.object({
  title: z.string().trim().min(1, 'Title is required.').max(60),
  description: z.string().trim().min(1, 'Description is required.').max(300),
});
