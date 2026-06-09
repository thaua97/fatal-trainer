/**
 * E2E-03 — Aplicar filtro e ver resultados (UC-03 / RF-004)
 */
describe('Catalog filters', () => {
  beforeEach(() => {
    cy.visitCatalog()
    cy.waitForTrainerCards()
  })

  it('applies specialty filter and clears it', () => {
    cy.fixture('catalog').then(({ specialtyTestId, specialtyFilter }) => {
      cy.get(`[data-testid="${specialtyTestId}"]`)
        .scrollIntoView()
        .click({ force: true })

      cy.get('[data-testid="active-filter-chips"]')
        .should('be.visible')
        .and('contain.text', specialtyFilter)

      cy.get('[data-testid="trainer-card"]').should('have.length.at.least', 1)

      cy.get('[data-testid="clear-filters"]').scrollIntoView().click({ force: true })
      cy.get('[data-testid="active-filter-chips"]').should('not.exist')
    })
  })
})
