describe('Session Form Spec', () => {
  // --- CREATE ---
  it('should create a new session successfully', () => {
    // 1. Login Admin
    cy.login(true, []);

    // 2. Intercepts
    cy.intercept('GET', '/api/teacher', [
      { id: 1, firstName: 'Prof', lastName: 'Un' },
    ]).as('getTeachers');

    cy.intercept('POST', '/api/session', {
      body: {
        id: 1,
        name: 'Yoga Matin',
        date: '2025-04-01',
        teacher_id: 1,
        description: 'Une super séance',
        users: [],
        createdAt: '2025-04-01',
        updatedAt: '2025-04-01',
      },
    }).as('createRequest');

    // 3. Navigation UI (Au lieu de cy.visit)
    // On est déjà sur '/sessions' grâce au login.
    cy.get('button[routerLink="create"]').click();

    // 4. Vérification qu'on est bien arrivés
    cy.url().should('include', '/sessions/create');
    cy.wait('@getTeachers');

    // 5. Remplissage
    cy.get('input[formControlName=name]').type('Yoga Matin');
    cy.get('input[formControlName=date]').type('2025-04-01');
    cy.get('textarea[formControlName=description]').type('Une super séance');

    cy.get('mat-select[formControlName=teacher_id]').click();
    cy.get('mat-option').contains('Prof Un').click();

    cy.get('button[type=submit]').click();

    // 6. Assertions
    cy.wait('@createRequest').then((interception) => {
      expect(interception.request.body).to.deep.include({
        name: 'Yoga Matin',
        date: '2025-04-01',
        teacher_id: 1,
      });
    });

    cy.url().should('include', '/sessions');
    cy.contains('Session created !').should('be.visible');
  });

  // --- UPDATE ---
  it('should update an existing session', () => {
    // Setup : On injecte une session pour pouvoir cliquer dessus
    const sessionToEdit = {
      id: 1,
      name: 'Yoga Ancien',
      date: '2025-04-01',
      teacher_id: 1,
      description: 'Ancienne description',
      users: [],
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
    };

    cy.login(true, [sessionToEdit]);

    // 2. Intercepts
    cy.intercept('GET', '/api/teacher', [
      { id: 1, firstName: 'Prof', lastName: 'Un' },
    ]).as('getTeachers');

    // Pour le formulaire d'update
    cy.intercept('GET', '/api/session/1', sessionToEdit).as('getSession');

    cy.intercept('PUT', '/api/session/1', {
      body: {
        ...sessionToEdit,
        name: 'Yoga Updated',
        description: 'Nouvelle description',
      },
    }).as('updateRequest');

    // Navigation UI : On clique sur le bouton "Edit" de la liste

    cy.contains('Edit').click();

    // Vérification navigation
    cy.url().should('include', '/sessions/update/1');
    cy.wait('@getTeachers');
    cy.wait('@getSession');

    // Action (Sécurisée avec clear séparé)
    cy.get('input[formControlName=name]').clear();
    cy.get('input[formControlName=name]').type('Yoga Updated');

    cy.get('textarea[formControlName=description]').clear();
    cy.get('textarea[formControlName=description]').type(
      'Nouvelle description'
    );

    cy.get('button[type=submit]').click();

    // Assertions
    cy.wait('@updateRequest').then((interception) => {
      expect(interception.request.body).to.deep.include({
        name: 'Yoga Updated',
        description: 'Nouvelle description',
      });
    });

    cy.url().should('include', '/sessions');
    cy.contains('Session updated !').should('be.visible');
  });

  it('should go back to sessions list from create page', () => {
    // Setup
    cy.login(true, []);

    // On doit mocker les profs car le formulaire les charge à l'init
    cy.intercept('GET', '/api/teacher', []).as('getTeachers');

    // Navigation vers la création
    cy.get('button[routerLink="create"]').click();
    cy.wait('@getTeachers'); // Attendre que la page soit stable

    // Action : Cliquer sur le bouton retour
    cy.get('[data-cy=back-button]').click();

    // Vérification
    cy.url().should('not.include', '/create');
    cy.url().should('include', '/sessions');
  });
});
