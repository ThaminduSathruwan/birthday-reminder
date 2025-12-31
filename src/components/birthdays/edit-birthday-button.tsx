"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition } from "react"
import { CalendarIcon, Loader2, Pencil } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { updateBirthday } from "@/actions/birthday"
import { birthdaySchema, type BirthdayInput } from "@/lib/validators/birthday"
import { useToast } from "@/components/ui/use-toast"
import { Birthday } from "@prisma/client"

export function EditBirthdayButton({ birthday }: { birthday: Birthday }) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const { toast } = useToast()

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(birthdaySchema),
        defaultValues: {
            name: birthday.name,
            dob: format(new Date(birthday.dob), 'yyyy-MM-dd'),
            relationship: birthday.relationship || "",
            notes: birthday.notes || "",
            isFavorite: birthday.isFavorite || false,
            includeYear: birthday.includeYear || false,
        },
    })

    const onSubmit = (data: BirthdayInput) => {
        startTransition(async () => {
            const result = await updateBirthday(birthday.id, data)

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: result.error,
                })
            } else {
                toast({
                    title: "Success",
                    description: "Birthday updated successfully",
                })
                setOpen(false)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4 text-muted-foreground hover:text-primary" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Birthday</DialogTitle>
                    <DialogDescription>
                        Update the birthday details.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Input
                                id="dob"
                                type="date"
                                {...register("dob")}
                            />
                            {errors.dob && (
                                <p className="text-sm text-destructive">{errors.dob.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="relationship">Relationship (Optional)</Label>
                            <Input
                                id="relationship"
                                placeholder="Friend, Family, Co-worker"
                                {...register("relationship")}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <Input
                                id="notes"
                                placeholder="Likes coffee, Size M"
                                {...register("notes")}
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="includeYear"
                                defaultChecked={birthday.includeYear}
                                onCheckedChange={(checked) => setValue("includeYear", checked as boolean)}
                            />
                            <Label htmlFor="includeYear">Include Year?</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isFavorite"
                                defaultChecked={birthday.isFavorite}
                                onCheckedChange={(checked) => setValue("isFavorite", checked as boolean)}
                            />
                            <Label htmlFor="isFavorite">Favorite?</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
