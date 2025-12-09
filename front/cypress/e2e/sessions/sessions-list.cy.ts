describe('Sessions List spec', () => {
  it('should display sessions for admin', () => {
    const sessions = [
      {
        id: 1,
        name: 'Morning Yoga',
        date: '2025-01-01T10:00:00.000+00:00',
        teacher_id: 1,
        description: 'Wake up session',
        users: [],
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
      },
      {
        id: 2,
        name: 'Evening Yoga',
        date: '2025-01-01T18:00:00.000+00:00',
        teacher_id: 1,
        description: 'Relax session',
        users: [],
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
      },
    ];

    cy.login(true, sessions);

    cy.get('.items .item').should('have.length', 2);
    // On valide le contenu de la première carte (Echantillon)
    cy.get('.items .item')
      .first()
      .within(() => {
        cy.contains('Morning Yoga');
        // Pour le bouton Edit (Admin)
        cy.contains('Edit').should('be.visible');
      });
    cy.get('button[routerLink="create"]').should('be.visible');
  });
});
