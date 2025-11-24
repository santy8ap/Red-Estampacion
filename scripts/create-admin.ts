import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL

  if (!adminEmail) {
    console.error('❌ Por favor define ADMIN_EMAIL en tu archivo .env')
    process.exit(1)
  }

  console.log(`🔍 Buscando usuario: ${adminEmail}`)

  const user = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (!user) {
    console.error('❌ Usuario no encontrado. Primero inicia sesión con Google en la aplicación.')
    process.exit(1)
  }

  await prisma.user.update({
    where: { email: adminEmail },
    data: { role: 'ADMIN' }
  })

  console.log('✅ Usuario actualizado a ADMIN exitosamente!')
  console.log(`👤 Usuario: ${user.name} (${user.email})`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })