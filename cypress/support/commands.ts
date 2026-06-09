/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      visitCatalog(): Chainable<void>
      visitProfile(trainerId: string): Chainable<void>
      dismissCityModal(): Chainable<void>
      waitForTrainerCards(): Chainable<void>
      selectCatalogSort(sortLabel: string): Chainable<void>
      getTrainerCardPrices(): Chainable<number[]>
      getTrainerCardRatings(): Chainable<number[]>
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

Cypress.Commands.add('visitProfile', (trainerId: string) => {
  cy.visit(`/personal-trainers/${trainerId}`)
  cy.get('[data-testid="trainer-profile-page"]', { timeout: 15000 }).should('be.visible')
  cy.get('h1', { timeout: 15000 }).should('exist').and('not.be.empty')
})

Cypress.Commands.add('selectCatalogSort', (sortLabel: string) => {
  cy.get('[data-testid="trainer-filters-sidebar"]', { timeout: 10000 })
    .scrollIntoView()

  cy.get('body').then(($body) => {
    const desktopSort = $body.find('[data-testid="trainer-sort"]')
    const sortTestId = desktopSort.length > 0 ? 'trainer-sort' : 'trainer-sort-select'

    cy.get(`[data-testid="${sortTestId}"]`)
      .first()
      .click({ force: true })
  })

  cy.contains('[role="option"]', sortLabel, { timeout: 10000 })
    .click({ force: true })

  cy.wait(400)
})

Cypress.Commands.add('getTrainerCardPrices', () => {
  const prices: number[] = []

  return cy.get('[data-testid="trainer-card"]').each(($card) => {
    const text = $card.text()
    const match = text.match(/R\$\s*([\d.]+(?:,\d{1,2})?)/)
    if (match?.[1]) {
      prices.push(Number(match[1].replace(/\./g, '').replace(',', '.')))
    }
  }).then(() => prices)
})

Cypress.Commands.add('getTrainerCardRatings', () => {
  const ratings: number[] = []

  return cy.get('[data-testid="trainer-card"]').each(($card) => {
    const badge = $card.find('[class*="amber-400"]').parent().text()
    const match = badge.match(/(\d+[,.]\d+)/)
    if (match?.[1]) {
      ratings.push(Number(match[1].replace(',', '.')))
    }
  }).then(() => ratings)
})

export {}
