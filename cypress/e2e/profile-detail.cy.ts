/**
 * E2E-09 — Perfil com campos obrigatórios e complementares (UC-06 / RF-007, RF-008)
 */
describe('Profile detail', () => {
  it('shows required and complementary trainer information', () => {
    cy.fixture('catalog').then(({
      deepLinkTrainerId,
      deepLinkTrainerName,
      deepLinkProfession,
      deepLinkDescriptionSnippet,
      deepLinkCity,
    }) => {
      cy.visitProfile(deepLinkTrainerId)

      cy.get('h1:visible').should('contain.text', deepLinkTrainerName)
      cy.get('[data-testid="trainer-location"]')
        .should('be.visible')
        .and('contain.text', deepLinkProfession)
        .and('contain.text', deepLinkCity)
      cy.contains(':visible', 'R$').should('exist')
      cy.get('img[alt*="Foto de"], [role="img"][aria-label*="Avatar"]')
        .should('exist')

      cy.contains(':visible', 'Sobre').should('exist')
      cy.contains(deepLinkDescriptionSnippet).should('be.visible')
    })
  })
})
