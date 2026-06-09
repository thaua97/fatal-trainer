/**
 * E2E-07 — Carregar mais resultados (UC-05 / RF-006, RF-011)
 */
describe('Catalog load more', () => {
  beforeEach(() => {
    cy.visitCatalog()
    cy.waitForTrainerCards()
  })

  it('loads the first batch without rendering the full dataset', () => {
    cy.fixture('catalog').then(({ pageSize, minDatasetTotal }) => {
      cy.get('[data-testid="trainer-card"]').should('have.length', pageSize)
      cy.get('[data-testid="trainer-card"]').its('length').should('be.lessThan', minDatasetTotal)
      cy.get('[data-testid="trainer-list-load-more"]').should('be.visible')
    })
  })

  it('loads the next batch without duplicating cards', () => {
    cy.fixture('catalog').then(({ pageSize }) => {
      const names: string[] = []

      cy.get('[data-testid="trainer-card"] h2').each(($heading) => {
        names.push($heading.text().trim())
      })

      cy.get('[data-testid="trainer-list-load-more"]')
        .scrollIntoView()
        .click({ force: true })

      cy.get('[data-testid="trainer-card"]', { timeout: 15000 })
        .should('have.length', pageSize * 2)

      cy.get('[data-testid="trainer-card"] h2').then(($headings) => {
        const allNames = [...$headings].map(heading => heading.innerText.trim())
        expect(new Set(allNames).size).to.equal(allNames.length)
        expect(allNames.length).to.equal(pageSize * 2)
        names.forEach((name) => {
          expect(allNames).to.include(name)
        })
      })
    })
  })
})
