import {
  assertSortedAscending,
  assertSortedDescending,
} from '../support/catalog-helpers'

/**
 * E2E-06 — Ordenar resultados (UC-04 / RF-005)
 */
describe('Catalog sort', () => {
  beforeEach(() => {
    cy.visitCatalog()
    cy.waitForTrainerCards()
  })

  it('sorts trainers by lowest price ascending', () => {
    cy.fixture('catalog').then(({ sortPriceAsc }) => {
      let defaultFirstName = ''

      cy.get('[data-testid="trainer-card"]')
        .first()
        .find('h2')
        .invoke('text')
        .then((name) => {
          defaultFirstName = name.trim()
        })

      cy.intercept('GET', '**/api/personal-trainers*').as('trainers')

      cy.selectCatalogSort(sortPriceAsc)

      cy.wait('@trainers').then(({ request, response }) => {
        expect(request.url).to.include('sortBy=price')
        expect(request.url).not.to.include('page=2')
        expect(response?.body?.items?.length).to.be.at.least(1)
      })

      cy.get('[data-testid="trainer-card"]')
        .first()
        .find('h2')
        .invoke('text')
        .should((name) => {
          expect(name.trim()).not.to.equal(defaultFirstName)
        })
    })
  })

  it('sorts trainers by highest rating descending', () => {
    cy.fixture('catalog').then(({ sortRating }) => {
      cy.intercept('GET', '**/api/personal-trainers*').as('trainers')

      cy.selectCatalogSort(sortRating)

      cy.wait('@trainers').then(({ request, response }) => {
        expect(request.url).to.include('sortBy=rating')

        const ratings = (response?.body?.items ?? []).map(
          (trainer: { rating: number }) => trainer.rating,
        )
        expect(ratings.length).to.be.at.least(2)
        assertSortedDescending(ratings.filter(Number.isFinite))
      })
    })
  })

  it('resets incremental loading when sort changes', () => {
    cy.fixture('catalog').then(({ pageSize, sortPriceAsc }) => {
      cy.get('[data-testid="trainer-card"]').should('have.length', pageSize)

      cy.get('[data-testid="trainer-list-load-more"]')
        .scrollIntoView()
        .click({ force: true })

      cy.get('[data-testid="trainer-card"]', { timeout: 15000 })
        .should('have.length', pageSize * 2)

      cy.selectCatalogSort(sortPriceAsc)

      cy.get('[data-testid="trainer-card"]', { timeout: 15000 })
        .should('have.length', pageSize)
      cy.get('[data-testid="trainer-list-load-more"]').should('be.visible')
    })
  })
})
