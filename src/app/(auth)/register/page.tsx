import { RegisterForm } from "@/components/auth/register-form"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Register | Birthday Reminder",
    description: "Create an account",
}

export default function RegisterPage() {
    return <RegisterForm />
}
