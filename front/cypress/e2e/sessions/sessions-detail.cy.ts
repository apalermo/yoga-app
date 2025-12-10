describe('Session Detail Spec', () => {
  // --- CAS 1 : ADMIN (Voit Delete, ne voit pas Participate) ---
  it('should display delete button for admin', () => {
    // Setup Admin : On injecte la session dans la liste dès le login
    const mockSession = {
      id: 1,
      name: 'Yoga Matin',
      date: '2025-04-01',
      teacher_id: 1,
      description: 'Une super séance',
      users: [],
      createdAt: '2025-04-01',
      updatedAt: '2025-04-01',
      Teacher: { id: 1, firstName: 'Prof', lastName: 'Un' },
    };

    cy.login(true, [mockSession]);

    // Intercepts pour le détail
    cy.intercept('GET', '/api/session/1', mockSession).as('getSession');
    cy.intercept('GET', '/api/teacher/1', mockSession.Teacher).as('getTeacher');
    cy.intercept('DELETE', '/api/session/1', { statusCode: 200 }).as(
      'deleteRequest'
    );
    cy.intercept('GET', '/api/session', []).as('getSessionsRefreshed');

    // On clique sur Detail depuis la liste
    cy.contains('Detail').click();
    cy.wait('@getSession');

    // Vérifications
    cy.contains('Prof UN').should('be.visible');
    cy.contains('Delete').should('be.visible');
    cy.contains('Participate').should('not.exist');
    cy.contains('Do not participate').should('not.exist');

    // Action Delete
    cy.contains('Delete').click();
    cy.wait('@deleteRequest');
    cy.contains('Session deleted !').should('be.visible');
    cy.url().should('include', '/sessions');
  });

  // --- CAS 2 : USER STANDARD ---
  it('should display participate button for simple user', () => {
    // Setup User
    const mockSession = {
      id: 1,
      name: 'Yoga Matin',
      date: '2025-04-01',
      teacher_id: 1,
      description: 'Une super séance',
      users: [], // Pas inscrit
      createdAt: '2025-04-01',
      updatedAt: '2025-04-01',
      Teacher: { id: 1, firstName: 'Prof', lastName: 'Un' },
    };

    cy.login(false, [mockSession]); // Admin false

    cy.intercept('GET', '/api/session/1', mockSession).as('getSession');
    cy.intercept('GET', '/api/teacher/1', mockSession.Teacher).as('getTeacher');
    cy.intercept('POST', '/api/session/1/participate/1', {
      statusCode: 200,
    }).as('participateRequest');

    // Navigation UI
    cy.contains('Detail').click();
    cy.wait('@getSession');

    // Vérif & Action
    cy.contains('Participate').should('be.visible');
    cy.contains('Do not participate').should('not.exist');
    cy.contains('Delete').should('not.exist');

    cy.contains('Participate').click();
    cy.wait('@participateRequest');
  });

  // --- CAS 3 : USER DÉJÀ INSCRIT ---
  it('should display do not participate button for already participating user', () => {
    const userId = 1;
    const mockSession = {
      id: 1,
      name: 'Yoga Matin',
      date: '2025-04-01',
      teacher_id: 1,
      description: 'Une super séance',
      users: [userId], // Déjà inscrit
      createdAt: '2025-04-01',
      updatedAt: '2025-04-01',
      Teacher: { id: 1, firstName: 'Prof', lastName: 'Un' },
    };

    cy.login(false, [mockSession]);

    cy.intercept('GET', '/api/session/1', mockSession).as('getSession');
    cy.intercept('GET', '/api/teacher/1', mockSession.Teacher).as('getTeacher');
    cy.intercept('DELETE', '/api/session/1/participate/1', {
      statusCode: 200,
    }).as('unParticipateRequest');

    // Navigation UI
    cy.contains('Detail').click();
    cy.wait('@getSession');

    // Vérif & Action
    cy.contains('Do not participate').should('be.visible');
    cy.contains('Do not participate').click();
    cy.wait('@unParticipateRequest');
  });

  // --- CAS 4 : NAVIGATION (Bouton Retour) ---
  it('should navigate back to sessions list', () => {
    // Setup : On réutilise le mock de base (peu importe le user)
    const mockSession = {
      id: 1,
      name: 'Yoga Matin',
      date: '2025-04-01',
      teacher_id: 1,
      description: 'Une super séance',
      users: [],
      createdAt: '2025-04-01',
      updatedAt: '2025-04-01',
      Teacher: { id: 1, firstName: 'Prof', lastName: 'Un' },
    };

    cy.login(true, [mockSession]);

    cy.intercept('GET', '/api/session/1', mockSession).as('getSession');
    cy.intercept('GET', '/api/teacher/1', mockSession.Teacher).as('getTeacher');

    // On navigue vers le détail
    cy.contains('Detail').click();
    cy.wait('@getSession');

    // Action : Clic sur le bouton retour
    cy.get('mat-icon').contains('arrow_back').click();

    // Vérification : Retour à la liste
    cy.url().should('include', '/sessions');
    // On vérifie qu'on ne voit plus le détail mais bien la liste
    cy.contains('Sessions available').should('be.visible');
  });
});
