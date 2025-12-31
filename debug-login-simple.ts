import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@example.com'
  const password = 'admin123'
  
  console.log('Checking user:', email)
  
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    console.log('User not found')
    return
  }
  
  console.log('User found:', { 
    id: user.id, 
    email: user.email, 
    role: user.role, 
    isActive: user.isActive
  })
  
  if (!user.password) {
     console.log('User has no password')
     return
  }

  const isValid = await bcrypt.compare(password, user.password)
  console.log('Password valid:', isValid)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.()
  })
