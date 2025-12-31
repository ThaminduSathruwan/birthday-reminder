"use client"

import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { deleteBirthday } from "@/actions/birthday"
import { useTransition } from "react"
import { toast } from "@/components/ui/use-toast"

export function DeleteBirthdayButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete this birthday?")) return

        startTransition(async () => {
            const res = await deleteBirthday(id)
            if (res.error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: res.error,
                })
            } else {
                toast({
                    title: "Success",
                    description: "Birthday deleted",
                })
            }
        })
    }

    return (
        <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isPending}>
            <Trash className="h-4 w-4 text-muted-foreground hover:text-destructive" />
        </Button>
    )
}
