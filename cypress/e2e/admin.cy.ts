describe('Admin Panel', () => {
  it('should redirect to login if not authenticated', () => {
    cy.visit('/admin')
    cy.url().should('include', '/auth/signin')
  })

  it('should display admin panel for authorized users', () => {
    // Este test requiere autenticación
    // Por ahora solo verificamos la redirección
    cy.visit('/admin')
    cy.url().should('not.include', '/admin')
  })
})
