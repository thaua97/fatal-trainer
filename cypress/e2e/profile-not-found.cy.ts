/**
 * E2E-11 — Perfil inexistente (UC-06 E1 / T-03)
 */
describe('Profile not found', () => {
  it('shows 404 state and link back to catalog', () => {
    cy.fixture('catalog').then(({ invalidTrainerId }) => {
      cy.visit(`/personal-trainers/${invalidTrainerId}`)

      cy.get('[data-testid="trainer-not-found"]', { timeout: 15000 }).should('be.visible')
      cy.get('[data-testid="back-to-list"]').should('be.visible').click()

      cy.url().should('include', '/personal-trainers')
      cy.get('[data-testid="trainer-list"], [data-testid="city-selector-modal"]').should('exist')
    })
  })
})
