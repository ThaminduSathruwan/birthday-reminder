"use server"

import { birthdaySchema, type BirthdayInput } from "@/lib/validators/birthday"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createBirthday(data: BirthdayInput) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return { error: "Unauthorized" }
    }

    const result = birthdaySchema.safeParse(data)

    if (!result.success) {
        return { error: "Invalid input" }
    }

    const { name, dob, relationship, notes, isFavorite, includeYear } = result.data

    try {
        await prisma.birthday.create({
            data: {
                userId: session.user.id,
                name,
                dob: new Date(dob),
                relationship,
                notes,
                isFavorite,
                includeYear,
            },
        })

        revalidatePath("/dashboard")
        revalidatePath("/birthdays")
        return { success: true }
    } catch (error) {
        console.error(error)
        return { error: "Something went wrong" }
    }
}

export async function deleteBirthday(id: string) {
    const session = await getServerSession(authOptions)
    if (!session) return { error: "Unauthorized" }

    try {
        const birthday = await prisma.birthday.findUnique({
            where: { id },
        })

        if (!birthday || birthday.userId !== session.user.id) {
            return { error: "Not found or unauthorized" }
        }

        await prisma.birthday.delete({
            where: { id },
        })

        revalidatePath("/dashboard")
        revalidatePath("/birthdays")
        return { success: true }
    } catch (error) {
        return { error: "Failed to delete" }
    }
}

export async function updateBirthday(id: string, data: BirthdayInput) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return { error: "Unauthorized" }
    }

    const result = birthdaySchema.safeParse(data)

    if (!result.success) {
        return { error: "Invalid input" }
    }

    const { name, dob, relationship, notes, isFavorite, includeYear } = result.data

    try {
        const birthday = await prisma.birthday.findUnique({
            where: { id },
        })

        if (!birthday || birthday.userId !== session.user.id) {
            return { error: "Not found or unauthorized" }
        }

        await prisma.birthday.update({
            where: { id },
            data: {
                name,
                dob: new Date(dob),
                relationship,
                notes,
                isFavorite,
                includeYear,
            },
        })

        revalidatePath("/dashboard")
        revalidatePath("/birthdays")
        return { success: true }
    } catch (error) {
        console.error(error)
        return { error: "Something went wrong" }
    }
}
