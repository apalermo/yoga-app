describe('Me Spec', () => {
  // --- CAS 1 : UTILISATEUR SIMPLE (Peut supprimer son compte) ---
  it('should display user info and allow account deletion', () => {
    // User standard (Admin: false)
    cy.login(false, []);

    const mockUser = {
      id: 1,
      email: 'user@studio.com',
      lastName: 'User',
      firstName: 'Simple',
      admin: false,
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
    };

    // Interception de la récupération du profil
    cy.intercept('GET', '/api/user/1', mockUser).as('getUser');

    // Interception de la suppression (DELETE)
    cy.intercept('DELETE', '/api/user/1', {
      statusCode: 200,
    }).as('deleteRequest');

    // Navigation
    cy.get('[data-cy="me"]').click();
    cy.wait('@getUser');

    // Vérifications Visuelles
    cy.contains('Simple USER').should('be.visible');
    cy.contains('user@studio.com').should('be.visible');

    // Vérification spécifique User standard
    cy.contains('You are admin').should('not.exist');
    cy.get('[data-cy="delete"]').should('be.visible');

    // Supprimer le compte
    cy.get('[data-cy="delete"]').click();

    // Vérification post-suppression
    cy.wait('@deleteRequest');

    // On est redirigé vers l'accueil ou login + SnackBar
    cy.contains('Your account has been deleted !').should('be.visible');
    cy.url().should('include', '/'); // Retour à l'accueil
  });

  // --- CAS 2 : ADMIN (Information seulement, pas de suppression) ---
  it('should display admin info without delete button', () => {
    // Admin
    cy.login(true, []);

    const mockAdmin = {
      id: 1,
      email: 'Yoga@studio.com',
      lastName: 'Admin',
      firstName: 'Admin',
      admin: true,
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
    };

    cy.intercept('GET', '/api/user/1', mockAdmin).as('getAdmin');

    cy.get('[data-cy="me"]').click();
    cy.wait('@getAdmin');

    // Vérifications
    cy.contains('Admin ADMIN').should('be.visible');
    cy.contains('Yoga@studio.com').should('be.visible');

    // Vérification spécifique Admin
    cy.contains('You are admin').should('be.visible');

    // L'admin ne doit pas voir le bouton de suppression
    cy.get('[data-cy="delete"]').should('not.exist');
  });

  // --- CAS 3 : NAVIGATION (Retour) ---
  it('should navigate back', () => {
    cy.login(false, []);

    cy.intercept('GET', '/api/user/1', {
      id: 1,
      email: 'a@a.com',
      lastName: 'A',
      firstName: 'A',
      admin: false,
      createdAt: '',
      updatedAt: '',
    }).as('getUser');

    cy.get('[data-cy="me"]').click();
    cy.wait('@getUser');

    // Test du bouton retour (mat-icon arrow_back)
    cy.get('button mat-icon').contains('arrow_back').click();

    // On vérifie qu'on a quitté la page /me
    cy.url().should('not.include', '/me');
  });
});
