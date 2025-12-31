import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'admin@example.com'
  const password = await bcrypt.hash('admin123', 10)

  // Clear existing data
  await prisma.notification.deleteMany()
  await prisma.birthday.deleteMany()
  await prisma.user.deleteMany()

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password,
      role: Role.ADMIN,
      isActive: true,
    },
    create: {
      email: adminEmail,
      name: 'Admin User',
      password,
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
  })

  console.log({ admin })

  // Create Test User
  const testEmail = 'sathruwan99@gmail.com'
  const testUser = await prisma.user.create({
    data: {
      email: testEmail,
      name: 'Sathruwan',
      password,
      role: Role.USER,
      isActive: true,
    },
  })

  // Create Birthdays for Test User
  const today = new Date()
  const bday1 = new Date(today)
  bday1.setFullYear(2000) // Born in 2000

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setFullYear(1995) // Born in 1995

  await prisma.birthday.create({
    data: {
      userId: testUser.id,
      name: 'Best Friend (Today)',
      dob: bday1,
      relationship: 'Friend',
      includeYear: true,
      isFavorite: true,
    }
  })

  await prisma.birthday.create({
    data: {
      userId: testUser.id,
      name: 'Cousin (Tomorrow)',
      dob: tomorrow,
      relationship: 'Family',
      includeYear: false, // Don't show age
    }
  })

  console.log({ testUser })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
