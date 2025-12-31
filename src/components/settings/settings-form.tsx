"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { updateSettings } from "@/actions/settings"
import { useTransition, useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { User } from "@prisma/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Common timezones
const TIMEZONES = [
    "UTC",
    "America/New_York",
    "America/Los_Angeles",
    "America/Chicago",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Asia/Kolkata",
    "Australia/Sydney",
]

export function SettingsForm({ user }: { user: User }) {
    const [isPending, startTransition] = useTransition()

    const [timezone, setTimezone] = useState(user.timezone || "UTC")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        startTransition(async () => {
            const res = await updateSettings({ timezone })
            if (res.error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: res.error,
                })
            } else {
                toast({
                    title: "Success",
                    description: "Settings updated",
                })
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-2">
                <Label htmlFor="timezone">Timezone</Label>
                <p className="text-[0.8rem] text-muted-foreground">
                    Calculations for reminders will be based on this timezone.
                </p>
                <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Select a timezone" />
                    </SelectTrigger>
                    <SelectContent>
                        {TIMEZONES.map((tz) => (
                            <SelectItem key={tz} value={tz}>
                                {tz}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save preferences"}
            </Button>
        </form>
    )
}
