describe('Login spec', () => {
  // Mise en place du contexte avant chaque test
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should login successfully', () => {
    // Interception propre avec Alias
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    }).as('loginRequest'); // On nomme la requête

    // On simule une session vide au démarrage
    cy.intercept('GET', '/api/session', []).as('sessionRequest');

    // Actions explicites
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234');

    // On clique sur le bouton Submit (sélecteur robuste à adapter si besoin)
    // Astuce : cy.get('button[type="submit"]') est souvent le plus sûr
    cy.get('button[type="submit"]').click();

    // Synchronisation : On attend que le back-end virtuel réponde
    cy.wait('@loginRequest');

    // Vérification
    cy.url().should('include', '/sessions');
  });

  // Test du cas d'erreur
  it('should display error on failed login', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { message: 'Unauthorized' },
    }).as('loginFail');

    cy.get('input[formControlName=email]').type('wrong@email.com');
    cy.get('input[formControlName=password]').type('wrongpass');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginFail');

    // Vérifie que l'URL n'a pas changé ou qu'un message d'erreur est là
    cy.url().should('include', '/login');
    cy.get('.error').should('be.visible'); // Vérifie qu'il y a une classe .error dans le HTML
  });
});
