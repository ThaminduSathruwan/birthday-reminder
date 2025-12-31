"use client"

import { Button } from "@/components/ui/button"
import { triggerRemindersManual } from "@/actions/admin"
import { useTransition } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Send } from "lucide-react"

export function TriggerRemindersButton() {
    const [isPending, startTransition] = useTransition()
    const { toast } = useToast()

    const handleTrigger = () => {
        startTransition(async () => {
            const result = await triggerRemindersManual()
            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: result.error,
                })
            } else {
                toast({
                    title: "Success",
                    description: `Reminders triggered for ${result.count} users`,
                })
            }
        })
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleTrigger}
            disabled={isPending}
        >
            {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Send className="mr-2 h-4 w-4" />
            )}
            Run Reminders Now
        </Button>
    )
}
