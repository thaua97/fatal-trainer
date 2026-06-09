/**
 * E2E-10 — Deep link para perfil (UC-06 / RF-013)
 */
describe('Profile deep link', () => {
  it('opens trainer profile directly from URL', () => {
    cy.fixture('catalog').then(({ deepLinkTrainerId, deepLinkTrainerName }) => {
      cy.visitProfile(deepLinkTrainerId)

      cy.url().should('include', `/personal-trainers/${deepLinkTrainerId}`)
      cy.get('[data-testid="trainer-profile-page"]').should('be.visible')
      cy.get('h1').should('contain.text', deepLinkTrainerName)
    })
  })

  it('returns to catalog from profile back button', () => {
    cy.fixture('catalog').then(({ deepLinkTrainerId }) => {
      cy.visitProfile(deepLinkTrainerId)

      cy.get('[data-testid="profile-back-button"]:visible')
        .first()
        .click()

      cy.url().should('include', '/personal-trainers')
      cy.url().should('not.include', deepLinkTrainerId)
    })
  })
})
