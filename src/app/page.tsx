import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-background to-muted">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex flex-col text-center gap-8">
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
          Birthday Reminder
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Never miss a birthday again. Automated email and in-app reminders for your loved ones.
        </p>

        <div className="flex gap-4">
          <Link href="/login">
            <Button size="lg">Login</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg">Get Started</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
