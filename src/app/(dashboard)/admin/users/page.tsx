import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserStatusButton } from "@/components/admin/user-status-button"
import { format } from "date-fns"
import { TriggerRemindersButton } from "@/components/admin/trigger-reminders-button"

export default async function AdminUsersPage() {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
        redirect("/dashboard")
    }

    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
                <TriggerRemindersButton />
            </div>
            <div className="grid gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Users ({users.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {users.map(user => (
                                <div key={user.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-medium">{user.name}</p>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                        <p className="text-xs text-muted-foreground">Joined: {format(new Date(user.createdAt), 'PP')}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs px-2 py-1 rounded-full ${user.role === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
                                            {user.role}
                                        </span>
                                        {user.role !== "ADMIN" && (
                                            <UserStatusButton id={user.id} isActive={user.isActive} />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
