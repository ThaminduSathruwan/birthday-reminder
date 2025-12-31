"use client"

import { Button } from "@/components/ui/button"
import { toggleUserStatus } from "@/actions/admin"
import { useTransition } from "react"
import { toast } from "@/components/ui/use-toast"

export function UserStatusButton({ id, isActive }: { id: string, isActive: boolean }) {
    const [isPending, startTransition] = useTransition()

    const handleToggle = () => {
        startTransition(async () => {
            const res = await toggleUserStatus(id)
            if (res.error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: res.error,
                })
            } else {
                toast({
                    title: "Success",
                    description: `User ${isActive ? 'deactivated' : 'activated'}`,
                })
            }
        })
    }

    return (
        <Button
            variant={isActive ? "destructive" : "default"}
            size="sm"
            onClick={handleToggle}
            disabled={isPending}
        >
            {isActive ? "Deactivate" : "Activate"}
        </Button>
    )
}
