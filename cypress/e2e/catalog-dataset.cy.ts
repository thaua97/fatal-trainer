/**
 * E2E-08 — Dataset e paginação server-side (RF-010, RF-011)
 */
describe('Catalog dataset', () => {
  it('reports at least 500 trainers from the API', () => {
    cy.intercept('GET', '**/api/personal-trainers*').as('trainers')

    cy.visitCatalog()
    cy.waitForTrainerCards()

    cy.fixture('catalog').then(({ minDatasetTotal }) => {
      cy.wait('@trainers').then(({ response }) => {
        expect(response?.statusCode).to.eq(200)
        expect(response?.body?.total).to.be.at.least(minDatasetTotal)
      })

      cy.get('[data-testid="catalog-results-count"]')
        .should('be.visible')
        .invoke('text')
        .then((text) => {
          const match = text.match(/(\d[\d.]*)/)
          expect(Number(match?.[1]?.replace(/\./g, ''))).to.be.at.least(minDatasetTotal)
        })
    })
  })
})
