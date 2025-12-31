import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  })
  console.log(admin)
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
