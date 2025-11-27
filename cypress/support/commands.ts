/// <reference types="cypress" />

// Custom commands
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/auth/signin')
  cy.get('input[name="email"]').type(email)
  cy.get('input[name="password"]').type(password)
  cy.get('button[type="submit"]').click()
})

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
    }
  }
}

export {}
