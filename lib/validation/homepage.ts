import { z } from 'zod';

export const homepageContentSchema = z.object({
  heroMediaType: z.enum(['IMAGE', 'VIDEO']),
  heroTagline: z.string().trim().max(200).optional().or(z.literal('')),
});
