import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@example.com'
  const password = 'admin123'
  const user = await prisma.user.findUnique({ where: { email } })
  
  if (!user) { console.log('User not found'); return }
  
  const isValid = await bcrypt.compare(password, user.password!)
  console.log(`Password for ${email} is valid: ${isValid}`)
}

main().catch(console.error).finally(() => prisma.())
