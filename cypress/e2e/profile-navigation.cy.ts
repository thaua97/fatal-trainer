/**
 * E2E-04 — Abrir perfil a partir do card (UC-06 / RF-007)
 * E2E-05 — Voltar à listagem (UC-07 / RF-009)
 */
describe('Profile navigation', () => {
  beforeEach(() => {
    cy.visitCatalog()
    cy.waitForTrainerCards()
  })

  it('opens trainer profile from card and returns to catalog', () => {
    cy.get('[data-testid="trainer-card"]').first().click()

    cy.url().should('match', /\/personal-trainers\/trainer-\d+/)
    cy.get('[data-testid="trainer-profile-page"]').should('be.visible')

    cy.go('back')

    cy.url().should('include', '/personal-trainers')
    cy.url().should('not.match', /\/personal-trainers\/trainer-/)
    cy.get('[data-testid="trainer-list"]').should('be.visible')
    cy.get('[data-testid="trainer-card"]').should('have.length.at.least', 1)
  })
})
