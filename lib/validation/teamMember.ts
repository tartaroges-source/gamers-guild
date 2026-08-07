import { z } from "zod";

export const teamMemberFormSchema = z.object({
  name: z.string().trim().min(2, "Name is required.").max(120),
  position: z.string().trim().min(1, "Position is required.").max(100),
  committee: z.string().trim().max(100).optional().or(z.literal("")),
  bio: z.string().trim().max(1000).optional().or(z.literal("")),
  order: z.coerce.number().int().default(0),
});

export type TeamMemberFormValues = z.infer<typeof teamMemberFormSchema>;