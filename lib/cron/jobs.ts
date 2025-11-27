import cron from 'node-cron'
import { prisma } from '@/lib/prisma'
import { sendDailyNewsletter, sendCartReminderEmail } from '@/lib/email/mailer'

export function initCronJobs() {
  console.log('🕐 Iniciando Cron Jobs...')

  // Newsletter diario a las 9 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('📧 Ejecutando Newsletter Diario...')
    try {
      const subscribers = await prisma.user.findMany({
        where: { emailVerified: { not: null } },
        select: { email: true }
      })

      const emails = subscribers.map(s => s.email).filter(Boolean) as string[]
      const result = await sendDailyNewsletter(emails)
      
      console.log(`✅ Newsletter: ${result.successful} exitosos, ${result.failed} fallidos`)
    } catch (error) {
      console.error('❌ Error en Newsletter:', error)
    }
  })

  // Recordatorio de carritos cada 6 horas
  cron.schedule('0 */6 * * *', async () => {
    console.log('🛒 Verificando carritos abandonados...')
    try {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
      
      const abandonedOrders = await prisma.order.findMany({
        where: {
          status: 'PENDING',
          createdAt: { lt: yesterday }
        },
        include: {
          user: true,
          items: { include: { product: true } }
        }
      })

      for (const order of abandonedOrders) {
        if (order.user.email) {
          const items = order.items.map(item => ({
            name: item.product.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color
          }))

          await sendCartReminderEmail(order.user.email, order.user.name || 'Cliente', items)
          console.log(`📧 Recordatorio enviado a ${order.user.email}`)
        }
      }
    } catch (error) {
      console.error('❌ Error en carritos:', error)
    }
  })

  console.log('✅ Cron Jobs iniciados')
}
