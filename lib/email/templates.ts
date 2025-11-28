// Email Templates para notificaciones
export const orderConfirmationTemplate = (orderData: any) => {
    const { orderId, customerName, total, items, shippingAddress } = orderData

    return {
        subject: `Confirmación de Pedido #${orderId.slice(-8).toUpperCase()}`,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
                .header { background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 20px; border-radius: 8px; }
                .content { background: white; padding: 20px; margin-top: 20px; border-radius: 8px; }
                .item { padding: 10px 0; border-bottom: 1px solid #eee; }
                .item:last-child { border-bottom: none; }
                .total { font-size: 24px; font-weight: bold; color: #dc2626; text-align: right; padding-top: 10px; }
                .button { display: inline-block; background: #dc2626; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin-top: 20px; }
                .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>¡Orden Confirmada!</h1>
                    <p>Gracias por tu compra, ${customerName}</p>
                </div>
                
                <div class="content">
                    <h2>Resumen del Pedido</h2>
                    <p><strong>Número de Orden:</strong> #${orderId.slice(-8).toUpperCase()}</p>
                    
                    <h3>Productos</h3>
                    ${items.map((item: any) => `
                        <div class="item">
                            <p><strong>${item.name}</strong></p>
                            <p>Cantidad: ${item.quantity} | Talla: ${item.size} | Color: ${item.color}</p>
                            <p>Precio: $${item.price.toFixed(2)}</p>
                        </div>
                    `).join('')}
                    
                    <div class="total">Total: $${total.toFixed(2)}</div>
                    
                    <h3 style="margin-top: 30px;">Dirección de Envío</h3>
                    <p>${shippingAddress.address}<br>${shippingAddress.city}, ${shippingAddress.zip}</p>
                    
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/mis-ordenes" class="button">Ver Mi Orden</a>
                </div>
                
                <div class="footer">
                    <p>Red Estampación &copy; ${new Date().getFullYear()}. Todos los derechos reservados.</p>
                    <p>Si tienes preguntas, contáctanos en support@redeestampacion.com</p>
                </div>
            </div>
        </body>
        </html>
        `
    }
}

export const dailyOrdersSummaryTemplate = (orders: any[]) => {
    const totalSales = orders.reduce((sum, o) => sum + o.total, 0)

    return {
        subject: `Resumen de Órdenes - ${new Date().toLocaleDateString('es-ES')}`,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                th { background: #dc2626; color: white; }
                .total { font-weight: bold; font-size: 18px; text-align: right; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>📊 Resumen de Órdenes del Día</h1>
                <p>Fecha: ${new Date().toLocaleDateString('es-ES')}</p>
                
                <table>
                    <thead>
                        <tr>
                            <th>ID Orden</th>
                            <th>Cliente</th>
                            <th>Total</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orders.map(order => `
                            <tr>
                                <td>#${order.id.slice(-8).toUpperCase()}</td>
                                <td>${order.shippingName}</td>
                                <td>$${order.total.toFixed(2)}</td>
                                <td>${order.status || 'PENDING'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="total">
                    Total Ventas del Día: $${totalSales.toFixed(2)}
                </div>
            </div>
        </body>
        </html>
        `
    }
}

export const welcomeTemplate = (name: string) => {
    return {
        subject: 'Bienvenido a Red Estampación',
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
                .header { background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 40px 20px; border-radius: 8px; text-align: center; }
                .content { background: white; padding: 30px; margin-top: 20px; border-radius: 8px; }
                .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>¡Bienvenido ${name}!</h1>
                    <p>Red Estampación</p>
                </div>
                
                <div class="content">
                    <p>Gracias por unirte a nuestra comunidad de amantes del buen estilo.</p>
                    <p>Disfruta de nuestros productos premium y diseños exclusivos de camisas estampadas.</p>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/productos" class="button">Explorar Colección</a>
                </div>
            </div>
        </body>
        </html>
        `
    }
}
