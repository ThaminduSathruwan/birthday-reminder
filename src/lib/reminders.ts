import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"
import { format, addDays, getYear } from "date-fns"
import { toZonedTime } from "date-fns-tz"

export async function sendBirthdayReminders() {
    try {
        const users = await prisma.user.findMany({
            include: {
                birthdays: true
            }
        })

        const results = []

        for (const user of users) {
            if (!user.email) continue

            const userTimezone = user.timezone || "UTC"
            const now = toZonedTime(new Date(), userTimezone)

            const checkDates = [0, 1, 7].map(days => {
                const date = addDays(now, days)
                return {
                    date: date,
                    daysStr: format(date, 'MM-dd'),
                    daysOffset: days
                }
            })

            const reminders = []

            for (const birthday of user.birthdays) {
                const bdayStr = format(toZonedTime(birthday.dob, 'UTC'), 'MM-dd')
                const match = checkDates.find(d => d.daysStr === bdayStr)

                if (match) {
                    reminders.push({
                        birthday,
                        daysUntil: match.daysOffset,
                        age: birthday.includeYear ? getYear(now) - getYear(new Date(birthday.dob)) : null
                    })
                }
            }

            if (reminders.length > 0) {
                // Send Email
                let emailHtml = "<h1>Birthday Reminders</h1><ul>"
                for (const r of reminders) {
                    const dayText = r.daysUntil === 0 ? "Today!" : `in ${r.daysUntil} days`
                    const ageText = r.age ? `Turning ${r.age}` : ""
                    emailHtml += `<li><strong>${r.birthday.name}</strong> - ${dayText} ${ageText}</li>`
                }
                emailHtml += "</ul><p><a href='" + process.env.NEXTAUTH_URL + "'>View Dashboard</a></p>"

                await sendEmail({
                    to: user.email,
                    subject: `Birthday Reminder: ${reminders.length} birthdays coming up`,
                    html: emailHtml
                })

                results.push({ user: user.email, count: reminders.length })
            }
        }

        return { success: true, processed: users.length, sent: results }
    } catch (error) {
        console.error("Reminder Error", error)
        throw error
    }
}
