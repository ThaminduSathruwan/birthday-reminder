import { sendBirthdayReminders } from "@/lib/reminders"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const result = await sendBirthdayReminders()
        return NextResponse.json(result)
    } catch (error) {
        console.error("Cron Error", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
