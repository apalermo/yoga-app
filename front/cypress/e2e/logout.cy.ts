describe('Logout spec', () => {
  it('should logout successfully', () => {
    // On s'identifie
    cy.login(true);

    // On vérifie l'existance du bouton logout et on clique dessus
    cy.get('[data-cy="logout"]').click();

    // On est bien sur la page de login
    cy.url().should('include', '/login');

    // On vérifie qu'on ne voit plus le bouton Logout
    cy.get('[data-cy="logout"]').should('not.exist');
    // On vérifie qu'on voit les boutons Login/Register
    cy.get('[data-cy="login"]').should('be.visible');
    cy.get('[data-cy="register"]').should('be.visible');
  });
});
