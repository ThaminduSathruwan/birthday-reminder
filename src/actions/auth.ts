"use server"

import { registerSchema } from "@/lib/validators/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

export async function registerUser(data: z.infer<typeof registerSchema>) {
    const result = registerSchema.safeParse(data)

    if (!result.success) {
        return { error: "Invalid input" }
    }

    const { email, password, name } = result.data

    try {
        const existing = await prisma.user.findUnique({
            where: { email },
        })

        if (existing) {
            return { error: "Email already in use" }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        })

        return { success: true }
    } catch (error) {
        console.error(error)
        return { error: "Something went wrong" }
    }
}
