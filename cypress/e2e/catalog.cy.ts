describe('Catalog listing', () => {
  it('loads the homepage', () => {
    cy.visit('/')
    cy.contains('Explorar personais').should('be.visible')
  })
})
