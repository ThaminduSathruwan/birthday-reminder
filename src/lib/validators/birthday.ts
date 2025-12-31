import { z } from "zod"

export const birthdaySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date",
    }),
    relationship: z.string().optional(),
    notes: z.string().optional(),
    isFavorite: z.boolean().default(false),
    includeYear: z.boolean().default(true),
})

export type BirthdayInput = z.infer<typeof birthdaySchema>
