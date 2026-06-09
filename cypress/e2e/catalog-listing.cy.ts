/**
 * E2E-01 — Abrir listagem → ver cards (UC-01 / RF-001, RF-002)
 */
describe('Catalog listing', () => {
  beforeEach(() => {
    cy.visitCatalog()
  })

  it('displays trainer cards with required fields', () => {
    cy.get('[data-testid="trainer-list"]').should('be.visible')
    cy.get('[data-testid="trainer-card"]').should('have.length.at.least', 1)

    cy.get('[data-testid="trainer-card"]').first().within(() => {
      cy.get('h2').should('not.be.empty')
      cy.contains('R$').should('be.visible')
      cy.get('figure img, figure [class*="avatar"]').should('exist')
    })
  })
})
