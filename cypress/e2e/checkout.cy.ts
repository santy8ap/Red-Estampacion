describe('Checkout Process', () => {
  beforeEach(() => {
    // Limpiar localStorage
    cy.clearLocalStorage()
  })

  it('should complete checkout flow', () => {
    // 1. Ir a productos
    cy.visit('/productos')
    
    // 2. Seleccionar un producto
    cy.get('[data-cy="product-card"]').first().click()
    
    // 3. Agregar al carrito (simulado)
    cy.visit('/carrito')
    
    // 4. Ir a checkout
    cy.contains('Finalizar compra').click()
    
    // 5. Verificar que llegamos al checkout
    cy.url().should('include', '/checkout')
  })

  it('should validate checkout form', () => {
    cy.visit('/checkout')
    
    // Intentar enviar formulario vacío
    cy.get('button[type="submit"]').click()
    
    // Verificar que aparecen errores de validación
    cy.contains('requerido').should('be.visible')
  })
})
