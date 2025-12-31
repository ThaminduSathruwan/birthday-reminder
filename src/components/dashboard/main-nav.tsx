"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"

import { cn } from "@/lib/utils"

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname()
    const { data: session } = useSession()

    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
            {...props}
        >
            <Link
                href="/dashboard"
                className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
                )}
            >
                Overview
            </Link>
            <Link
                href="/birthdays"
                className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname.startsWith("/birthdays") ? "text-primary" : "text-muted-foreground"
                )}
            >
                Birthdays
            </Link>
            <Link
                href="/settings"
                className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === "/settings" ? "text-primary" : "text-muted-foreground"
                )}
            >
                Settings
            </Link>
            {session?.user?.role === "ADMIN" && (
                <Link
                    href="/admin/users"
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        pathname.startsWith("/admin") ? "text-primary" : "text-muted-foreground"
                    )}
                >
                    Admin
                </Link>
            )}
        </nav>
    )
}
