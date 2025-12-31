# Birthday Reminder App

A full-stack Next.js application to manage birthdays and receive automated email reminders.

## Features

- **Dashboard**: Overview of total and upcoming birthdays.
- **Birthday Management**: Add, view, delete birthdays with details (Relationship, Notes, Favorites).
- **Automated Reminders**: Daily checks via Cron jobs (Vercel Cron) to send emails 7 days before, 1 day before, and on the day.
- **Authentication**: Secure login/signup using NextAuth.js.
- **Theme**: Light/Dark mode support (System default).
- **Responsive Design**: Built with Tailwind CSS and Shadcn/UI.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL (Neon) with Prisma ORM
- **Auth**: NextAuth.js v4
- **Email**: Nodemailer (Gmail SMTP)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Getting Started

1. **Clone the repository**
   \`\`\`bash
   git clone <url>
   cd birthday-reminder
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configure Environment Variables**
   Copy \`.env.example\` to \`.env\` and fill in the details:
   \`\`\`env
   DATABASE_URL="your_neon_postgres_url"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="generate_with_openssl_rand_base64_32"
   SMTP_HOST="smtp.gmail.com"
   SMTP_USER="your_email@gmail.com"
   SMTP_PASSWORD="your_app_password"
   \`\`\`

4. **Initialize Database**
   \`\`\`bash
   npx prisma migrate dev --name init
   npx prisma db seed # Creates Admin user (optional)
   \`\`\`

5. **Run Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

## Deployment to Vercel

1. Push code to GitHub.
2. Import project in Vercel.
3. Add Environment Variables in Vercel settings (same as .env).
4. **Cron Jobs**: Vercel automatically detects \`vercel.json\` and sets up the Cron job (Daily at 12:00 UTC).

## Cron Job Testing

To manually test the reminder check locally:
\`\`\`bash
curl http://localhost:3000/api/cron/reminders
\`\`\`
