describe('Register spec', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should register successfully', () => {
    // On intercepte la requête d'inscription
    cy.intercept('POST', '/api/auth/register', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
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
    cy.wait('@registerRequest');
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
