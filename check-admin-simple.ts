import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany()
  console.log('Users found:', users.length)
  users.forEach(u => console.log(u.email, u.role))
}

main()
  .then(async () => {
    await prisma.()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.()
    process.exit(1)
  })
