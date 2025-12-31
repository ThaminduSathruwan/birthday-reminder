"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { birthdaySchema, type BirthdayInput } from "@/lib/validators/birthday"
import { createBirthday } from "@/actions/birthday"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast" // Note: need to create toast

export function AddBirthdayButton() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const { register, handleSubmit, reset, formState: { errors } } = useForm<BirthdayInput>({
        resolver: zodResolver(birthdaySchema),
        defaultValues: {
            includeYear: true,
            isFavorite: false
        }
    })

    async function onSubmit(data: BirthdayInput) {
        setIsLoading(true)

        try {
            const res = await createBirthday(data)
            if (res.error) {
                alert(res.error) // Replace with toast later
            } else {
                setOpen(false)
                reset()
            }
        } catch (e) {
            alert("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Birthday</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Birthday</DialogTitle>
                    <DialogDescription>
                        Add a new birthday to your reminder list.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                className="col-span-3"
                                {...register("name")}
                            />
                            {errors.name && <p className="col-span-4 text-right text-sm text-red-500">{errors.name.message}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="dob" className="text-right">
                                Date
                            </Label>
                            <Input
                                id="dob"
                                type="date"
                                className="col-span-3"
                                {...register("dob")}
                            />
                            {errors.dob && <p className="col-span-4 text-right text-sm text-red-500">{errors.dob.message}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="relationship" className="text-right">
                                Relation
                            </Label>
                            <Input
                                id="relationship"
                                className="col-span-3"
                                {...register("relationship")}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save changes"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
