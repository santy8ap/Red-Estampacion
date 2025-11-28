import nodemailer from 'nodemailer'
import { orderConfirmationTemplate, dailyOrdersSummaryTemplate, welcomeTemplate } from './templates'

// Configurar transporter de Nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})

// Test de conexión
export async function testEmailConnection() {
    try {
        await transporter.verify()
        console.log('✅ Email service connected successfully')
        return true
    } catch (error) {
        console.error('❌ Email service connection failed:', error)
        return false
    }
}

export async function sendOrderConfirmation(orderData: {
    orderId: string
    customerName: string
    customerEmail: string
    total: number
    items: any[]
    shippingAddress: any
}) {
    try {
        const template = orderConfirmationTemplate(orderData)
        
        const result = await transporter.sendMail({
            from: process.env.SMTP_FROM || 'noreply@redeestampacion.com',
            to: orderData.customerEmail,
            subject: template.subject,
            html: template.html,
        })
        
        console.log('✅ Orden confirmada enviada a:', orderData.customerEmail)
        return result
    } catch (error) {
        console.error('❌ Error enviando confirmación de orden:', error)
        throw error
    }
}

export async function sendDailyOrdersSummary(
    orders: any[],
    adminEmail: string
) {
    try {
        if (!orders.length) {
            console.log('ℹ️  No hay órdenes para enviar resumen')
            return
        }

        const template = dailyOrdersSummaryTemplate(orders)
        
        const result = await transporter.sendMail({
            from: process.env.SMTP_FROM || 'noreply@redeestampacion.com',
            to: adminEmail,
            subject: template.subject,
            html: template.html,
        })
        
        console.log('✅ Resumen diario de órdenes enviado')
        return result
    } catch (error) {
        console.error('❌ Error enviando resumen diario:', error)
        throw error
    }
}

export async function sendWelcomeEmail(email: string, name: string) {
    try {
        const template = welcomeTemplate(name)
        
        const result = await transporter.sendMail({
            from: process.env.SMTP_FROM || 'noreply@redeestampacion.com',
            to: email,
            subject: template.subject,
            html: template.html,
        })
        
        console.log('✅ Email de bienvenida enviado a:', email)
        return result
    } catch (error) {
        console.error('❌ Error enviando email de bienvenida:', error)
        throw error
    }
}

export async function sendCustomEmail(
    to: string,
    subject: string,
    html: string
) {
    try {
        const result = await transporter.sendMail({
            from: process.env.SMTP_FROM || 'noreply@redeestampacion.com',
            to,
            subject,
            html,
        })
        
        console.log('✅ Email personalizado enviado a:', to)
        return result
    } catch (error) {
        console.error('❌ Error enviando email personalizado:', error)
        throw error
    }
}
