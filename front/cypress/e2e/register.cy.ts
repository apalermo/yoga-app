describe('Register spec', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should register successfully', () => {
    // On intercepte la requête d'inscription
    cy.intercept('POST', '/api/auth/register', {
      body: {
        id: 1,
        username: 'toto@test.com',
        firstName: 'Toto',
        lastName: 'TEST',
        admin: false,
      },
    }).as('registerRequest');

    //  Remplissage du formulaire (4 champs)
    cy.get('input[formControlName=firstName]').type('Toto');
    cy.get('input[formControlName=lastName]').type('TEST');
    cy.get('input[formControlName=email]').type('toto@test.com');
    cy.get('input[formControlName=password]').type('test!1234');

    //  Action
    cy.get('button[type=submit]').click();

    // Vérification
    cy.wait('@registerRequest').then((interception) => {
      const body = interception.request.body;

      // On vérifie que l'objet envoyé contient bien nos 4 champs
      expect(body).to.deep.include({
        firstName: 'Toto',
        lastName: 'TEST',
        email: 'toto@test.com',
        password: 'test!1234',
      });
    });
    cy.url().should('include', '/login');
  });

  it('should display error message on failure', () => {
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 400,
      body: { message: 'Email already exists' },
    }).as('registerFail');

    cy.get('input[formControlName=firstName]').type('Yoga');
    cy.get('input[formControlName=lastName]').type('STUDIO');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234');

    cy.get('button[type=submit]').click();

    cy.wait('@registerFail');
    cy.get('.error').should('be.visible');
  });
});
