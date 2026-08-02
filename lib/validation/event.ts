import { z } from "zod";

export const eventFormSchema = z
  .object({
    title: z.string().trim().min(3, "Title must be at least 3 characters.").max(120),
    description: z.string().trim().min(1, "Description is required.").max(2000),
    location: z.string().trim().max(200).optional().or(z.literal("")),
    startsAt: z.string().min(1, "Start date and time are required."),
    endsAt: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (!data.endsAt) return true;
      return new Date(data.endsAt) > new Date(data.startsAt);
    },
    { message: "End time must be after the start time.", path: ["endsAt"] }
  );

export type EventFormValues = z.infer<typeof eventFormSchema>;