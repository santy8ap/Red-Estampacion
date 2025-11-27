describe('Products Page', () => {
  beforeEach(() => {
    cy.visit('/productos')
  })

  it('should display products page', () => {
    cy.contains('Productos').should('be.visible')
  })

  it('should display product cards', () => {
    cy.get('[data-cy="product-card"]', { timeout: 10000 })
      .should('have.length.greaterThan', 0)
  })

  it('should navigate to product detail', () => {
    cy.get('[data-cy="product-card"]').first().click()
    cy.url().should('include', '/productos/')
  })
})
