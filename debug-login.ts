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
    isActive: user.isActive,
    passwordHash: user.password 
  })
  
  if (!user.password) {
     console.log('User has no password')
     return
  }

  const isValid = await bcrypt.compare(password, user.password)
  console.log('Password valid:', isValid)
  
  const newHash = await bcrypt.hash(password, 10)
  console.log('New hash for comparison:', newHash)
  console.log('Is new hash valid:', await bcrypt.compare(password, newHash))
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
