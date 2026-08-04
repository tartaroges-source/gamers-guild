import { z } from 'zod';

const optionalUrl = z
  .union([z.literal(''), z.string().trim().url('Enter a valid URL.')])
  .optional();

export const siteSettingsSchema = z.object({
  clubName: z.string().trim().min(1, 'Club name is required.').max(100),
  contactEmail: z
    .union([z.literal(''), z.string().trim().email('Enter a valid email address.')])
    .optional(),
  discordUrl: optionalUrl,
  facebookUrl: optionalUrl,
  instagramUrl: optionalUrl,
});
