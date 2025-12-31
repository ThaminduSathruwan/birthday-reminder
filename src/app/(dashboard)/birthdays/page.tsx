import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { AddBirthdayButton } from "@/components/birthdays/add-birthday-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { deleteBirthday } from "@/actions/birthday"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { DeleteBirthdayButton } from "@/components/birthdays/delete-birthday-button"
import { EditBirthdayButton } from "@/components/birthdays/edit-birthday-button"

export default async function BirthdaysPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    const birthdays = await prisma.birthday.findMany({
        where: { userId: session.user.id },
        orderBy: { dob: 'asc' },
    })

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Birthdays</h2>
                <AddBirthdayButton />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {birthdays.length === 0 ? (
                    <p className="text-muted-foreground col-span-full text-center py-10">
                        No birthdays found. Add one to get started!
                    </p>
                ) : (
                    birthdays.map((birthday: any) => (
                        <Card key={birthday.id}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-bold">{birthday.name}</CardTitle>
                                <div className="flex items-center gap-2">
                                    <EditBirthdayButton birthday={birthday} />
                                    <DeleteBirthdayButton id={birthday.id} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground">
                                    {format(new Date(birthday.dob), 'MMMM do')}
                                    {birthday.includeYear && `, ${new Date(birthday.dob).getFullYear()}`}
                                </div>
                                {birthday.relationship && (
                                    <div className="text-xs mt-2 bg-secondary text-secondary-foreground inline-block px-2 py-1 rounded-full">
                                        {birthday.relationship}
                                    </div>
                                )}
                                {birthday.notes && (
                                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                                        {birthday.notes}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
