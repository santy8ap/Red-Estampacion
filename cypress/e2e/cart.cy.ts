describe('Shopping Cart', () => {
  it('should display cart page', () => {
    cy.visit('/carrito')
    cy.contains('Carrito').should('be.visible')
  })

  it('should show empty cart message', () => {
    cy.clearLocalStorage()
    cy.visit('/carrito')
    cy.contains('vacío').should('be.visible')
  })
})
