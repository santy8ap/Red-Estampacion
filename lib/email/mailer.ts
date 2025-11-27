import nodemailer from 'nodemailer'

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

const emailTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white;">
        <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Red Estampación</h1>
        </div>
        <div style="padding: 30px;">
            ${content}
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 12px;">
            <p style="margin: 5px 0;">© 2024 Red Estampación</p>
        </div>
    </div>
</body>
</html>
`

export async function sendWelcomeEmail(to: string, name: string) {
  const transporter = createTransporter()
  
  const content = `
    <h2 style="color: #333;">¡Bienvenido ${name}!</h2>
    <p style="color: #666;">Gracias por registrarte en Red Estampación.</p>
    <a href="${process.env.NEXTAUTH_URL}/productos" 
       style="display: inline-block; background-color: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">
      Explorar Productos
    </a>
  `
  
  return await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: '¡Bienvenido a Red Estampación!',
    html: emailTemplate(content),
  })
}

export async function sendOrderConfirmation(to: string, orderData: any) {
  const transporter = createTransporter()
  
  const content = `
    <h2 style="color: #333;">¡Orden Confirmada!</h2>
    <p>Tu orden #${orderData.id} ha sido confirmada.</p>
    <p><strong>Total: $${orderData.total.toFixed(2)}</strong></p>
  `
  
  return await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: `Orden confirmada - #${orderData.id}`,
    html: emailTemplate(content),
  })
}

export async function sendCartReminderEmail(to: string, userName: string, items: any[]) {
  const transporter = createTransporter()
  
  const content = `
    <h2 style="color: #333;">¡No olvides tu carrito!</h2>
    <p>Hola ${userName}, tienes ${items.length} productos esperando.</p>
  `
  
  return await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Productos en tu carrito',
    html: emailTemplate(content),
  })
}

export async function sendDailyNewsletter(subscribers: string[]) {
  const transporter = createTransporter()
  const content = `<h2>Ofertas del día</h2><p>Revisa nuestras nuevas ofertas.</p>`
  
  const results = await Promise.allSettled(
    subscribers.map(email => 
      transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Newsletter diario',
        html: emailTemplate(content),
      })
    )
  )
  
  return {
    successful: results.filter(r => r.status === 'fulfilled').length,
    failed: results.filter(r => r.status === 'rejected').length
  }
}
