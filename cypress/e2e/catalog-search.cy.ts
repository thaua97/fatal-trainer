/**
 * E2E-02 — Buscar trainer por nome (UC-02 / RF-003)
 */
describe('Catalog search', () => {
  beforeEach(() => {
    cy.visitCatalog()
    cy.waitForTrainerCards()
  })

  it('filters trainers by name', () => {
    cy.fixture('catalog').then(({ searchTerm }) => {
      cy.get('[data-testid="trainer-search"]:visible').first().clear().type(searchTerm)
      cy.wait(300)

      cy.get('[data-testid="trainer-card"]')
        .should('have.length.at.least', 1)
        .each(($card) => {
          cy.wrap($card).should('contain.text', searchTerm)
        })
    })
  })

  it('shows empty state when search has no results', () => {
    cy.fixture('catalog').then(({ noResultsSearchTerm }) => {
      cy.get('[data-testid="trainer-search"]:visible').first().clear().type(noResultsSearchTerm)
      cy.wait(300)

      cy.get('[data-testid="trainer-list-empty"]').should('be.visible')
      cy.get('[data-testid="trainer-card"]').should('not.exist')
    })
  })
})
