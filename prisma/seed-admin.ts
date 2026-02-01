import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@maikeldrukuje.pl'
  const password = 'MaikelDrukuje!2025Bezpieczne'
  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
    create: {
      email,
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
      name: 'Admin',
    },
  })

  console.log('Konto admina gotowe!')
  console.log('Login: ' + email)
  console.log('Hasło: ' + password)
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
