import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    const totalBirthdays = await prisma.birthday.count({
        where: { userId: session.user.id }
    })

    // Get all birthdays to filter in memory (better for complex date logic across years)
    const allBirthdays = await prisma.birthday.findMany({
        where: { userId: session.user.id }
    })

    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

    const upcomingCount = allBirthdays.filter(b => {
        const bDate = new Date(b.dob)
        const bMonthDay = `${bDate.getMonth()}-${bDate.getDate()}`

        // Check if birthday is between today and next week (ignoring year)
        // This is a simplified check and might simple edge cases like year boundaries
        // For MVP it's acceptable, or use date-fns logic similar to cron

        const currentYear = today.getFullYear()
        const nextBday = new Date(currentYear, bDate.getMonth(), bDate.getDate())
        if (nextBday < today) {
            nextBday.setFullYear(currentYear + 1)
        }

        return nextBday <= nextWeek
    }).length

    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Birthdays</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalBirthdays}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming (7 Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{upcomingCount}</div>
                        <p className="text-xs text-muted-foreground">Birthdays in the next 7 days</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
