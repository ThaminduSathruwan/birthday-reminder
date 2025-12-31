"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const settingsSchema = z.object({
    timezone: z.string().min(1, "Timezone is required"),
})

export type SettingsInput = z.infer<typeof settingsSchema>

export async function updateSettings(data: SettingsInput) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return { error: "Unauthorized" }
    }

    const result = settingsSchema.safeParse(data)

    if (!result.success) {
        return { error: "Invalid input" }
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                timezone: result.data.timezone,
            }
        })

        revalidatePath("/dashboard")
        return { success: true }
    } catch (error) {
        return { error: "Failed to update settings" }
    }
}
