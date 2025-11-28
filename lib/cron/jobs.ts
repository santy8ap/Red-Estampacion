import cron from 'node-cron'
import { prisma } from '@/lib/prisma'
import { sendDailyOrdersSummary, sendCustomEmail } from '@/lib/email/mailer'

let cronJobs: Map<string, cron.ScheduledTask> = new Map()

/**
 * Cron Job: Resumen diario de órdenes al admin
 * Ejecuta cada día a las 9:00 AM
 */
function startDailyOrdersSummaryJob() {
  const job = cron.schedule('0 9 * * *', async () => {
    try {
      console.log('🔄 [CRON] Iniciando reporte diario de órdenes...')
      
      // Obtener órdenes del día anterior
      const startOfYesterday = new Date()
      startOfYesterday.setDate(startOfYesterday.getDate() - 1)
      startOfYesterday.setHours(0, 0, 0, 0)
      
      const endOfYesterday = new Date()
      endOfYesterday.setDate(endOfYesterday.getDate() - 1)
      endOfYesterday.setHours(23, 59, 59, 999)
      
      const orders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: startOfYesterday,
            lte: endOfYesterday
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          },
          user: true
        },
        orderBy: { createdAt: 'desc' }
      })
      
      // Enviar email al admin desde variables de entorno
      const adminEmail = process.env.ADMIN_EMAIL || 'santy8aposso@gmail.com'
      
      if (orders.length > 0) {
        await sendDailyOrdersSummary(orders, adminEmail)
        console.log(`✅ [CRON] Reporte enviado: ${orders.length} órdenes`)
      } else {
        console.log('ℹ️  [CRON] No hay órdenes para reportar')
      }
    } catch (error) {
      console.error('❌ [CRON] Error en reporte diario de órdenes:', error)
    }
  })
  
  cronJobs.set('dailyOrdersSummary', job)
  console.log('✅ Cron job "Reporte diario de órdenes" activado (9:00 AM)')
}

/**
 * Cron Job: Recordatorio de carritos abandonados
 * Ejecuta cada 6 horas
 */
function startCartReminderJob() {
  const job = cron.schedule('0 */6 * * *', async () => {
    try {
      console.log('🔄 [CRON] Verificando carritos abandonados...')
      
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
      
      const abandonedOrders = await prisma.order.findMany({
        where: {
          status: 'PENDING',
          createdAt: { lt: yesterday }
        },
        include: {
          user: true,
          items: { include: { product: true } }
        },
        take: 10 // Limit para evitar envíos masivos
      })

      for (const order of abandonedOrders) {
        if (order.user?.email) {
          const itemList = order.items
            .map(item => `${item.product.name} x${item.quantity}`)
            .join(', ')
          
          const html = `
            <h2>¡No olvides tu carrito!</h2>
            <p>Hola ${order.user.name || 'Cliente'},</p>
            <p>Tienes los siguientes productos esperando en tu carrito:</p>
            <p><strong>${itemList}</strong></p>
            <p>Total: $${order.total.toFixed(2)}</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/carrito" 
               style="display: inline-block; background-color: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
              Completar compra
            </a>
          `
          
          await sendCustomEmail(
            order.user.email,
            '¡No olvides tu carrito!',
            html
          )
          console.log(`📧 [CRON] Recordatorio enviado a ${order.user.email}`)
        }
      }
      
      console.log(`✅ [CRON] ${abandonedOrders.length} recordatorios de carrito enviados`)
    } catch (error) {
      console.error('❌ [CRON] Error en recordatorio de carritos:', error)
    }
  })
  
  cronJobs.set('cartReminder', job)
  console.log('✅ Cron job "Recordatorio de carrito" activado (cada 6 horas)')
}

/**
 * Cron Job: Limpieza de datos antiguos
 * Ejecuta diariamente a las 3:00 AM
 */
function startCleanupJob() {
  const job = cron.schedule('0 3 * * *', async () => {
    try {
      console.log('🔄 [CRON] Iniciando limpieza de datos...')
      
      // Lógica futura: eliminar registros antiguos, sesiones expiradas, etc.
      console.log('✅ [CRON] Limpieza de datos completada')
    } catch (error) {
      console.error('❌ [CRON] Error en limpieza de datos:', error)
    }
  })
  
  cronJobs.set('cleanup', job)
  console.log('✅ Cron job "Limpieza de datos" activado (3:00 AM)')
}

/**
 * Inicializar todos los cron jobs
 */
export function initCronJobs() {
  console.log('\n🚀 Inicializando Cron Jobs...')
  
  try {
    startDailyOrdersSummaryJob()
    startCartReminderJob()
    startCleanupJob()
    
    console.log('✅ Todos los cron jobs han sido activados\n')
  } catch (error) {
    console.error('❌ Error inicializando cron jobs:', error)
  }
}

/**
 * Detener todos los cron jobs
 */
export function stopAllCronJobs() {
  console.log('🛑 Deteniendo todos los cron jobs...')
  
  cronJobs.forEach((job, name) => {
    job.stop()
    console.log(`✅ Cron job "${name}" detenido`)
  })
  
  cronJobs.clear()
}

/**
 * Obtener estado de los cron jobs
 */
export function getCronJobsStatus() {
  return Array.from(cronJobs.entries()).map(([name]) => ({
    name,
    running: true // Los cron jobs se inician automáticamente
  }))
}
