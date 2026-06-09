/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      visitCatalog(): Chainable<void>
      dismissCityModal(): Chainable<void>
      waitForTrainerCards(): Chainable<void>
    }
  }
}

Cypress.Commands.add('dismissCityModal', () => {
  cy.get('body').then(($body) => {
    if ($body.find('[data-testid="city-selector-modal"]').length > 0) {
      cy.get('[data-testid="city-modal-skip"]').click()
      cy.get('[data-testid="city-selector-modal"]').should('not.exist')
    }
  })
})

Cypress.Commands.add('visitCatalog', () => {
  cy.visit('/personal-trainers')
  cy.get('[data-testid="city-selector-modal"]', { timeout: 10000 }).should('be.visible')
  cy.dismissCityModal()
  cy.get('[data-testid="trainer-list-loading"]', { timeout: 15000 }).should('not.exist')
  cy.get('[data-testid="trainer-list-awaiting-city"]', { timeout: 5000 }).should('not.exist')
  cy.get('[data-testid="trainer-list-error"]', { timeout: 5000 }).should('not.exist')
  cy.get('[data-testid="trainer-list"], [data-testid="trainer-list-empty"]', { timeout: 15000 })
    .should('be.visible')
})

Cypress.Commands.add('waitForTrainerCards', () => {
  cy.get('[data-testid="trainer-list"]', { timeout: 15000 }).should('be.visible')
  cy.get('[data-testid="trainer-card"]', { timeout: 15000 })
    .should('have.length.at.least', 1)
})

export {}
