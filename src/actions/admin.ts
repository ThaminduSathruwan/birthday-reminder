"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function toggleUserStatus(userId: string) {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" }
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) return { error: "User not found" }
        if (user.role === "ADMIN") return { error: "Cannot deactivate admin" }

        await prisma.user.update({
            where: { id: userId },
            data: { isActive: !user.isActive }
        })

        revalidatePath("/admin/users")
        return { success: true }
    } catch (error) {
        return { error: "Something went wrong" }
    }
}

import { sendBirthdayReminders } from "@/lib/reminders"

export async function triggerRemindersManual() {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "ADMIN") {
        return { error: "Unauthorized" }
    }

    try {
        const result = await sendBirthdayReminders()
        return { success: true, count: result.processed }
    } catch (error) {
        return { error: "Failed to trigger reminders" }
    }
}
