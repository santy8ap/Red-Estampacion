describe('Home Page', () => {
  it('should load homepage', () => {
    cy.visit('/')
    cy.contains('Red Estampación').should('be.visible')
  })

  it('should display featured products', () => {
    cy.visit('/')
    cy.get('[data-cy="featured-products"]', { timeout: 10000 })
      .should('be.visible')
  })

  it('should navigate to products', () => {
    cy.visit('/')
    cy.contains('Ver todos').click()
    cy.url().should('include', '/productos')
  })
})
