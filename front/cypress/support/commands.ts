// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
// avoid eslint error
declare namespace Cypress {
  interface Chainable {
    login(isAdmin?: boolean, sessionData?: any[]): Chainable<void>;
  }
}
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
// cypress/support/commands.ts

// custom login function
Cypress.Commands.add('login', (isAdmin = false, sessionData = []) => {
  cy.visit('/login');

  cy.intercept('POST', '/api/auth/login', {
    body: {
      id: 1,
      username: 'yoga@studio.com',
      firstName: 'Admin',
      lastName: 'Admin',
      admin: isAdmin,
    },
  }).as('loginRequest');

  // ICI : On utilise les données passées en paramètre !
  cy.intercept('GET', '/api/session', sessionData).as('session');

  cy.get('input[formControlName=email]').type('yoga@studio.com');
  cy.get('input[formControlName=password]').type('test!1234');
  cy.get('button[type=submit]').click();

  cy.wait('@loginRequest');
  cy.url().should('include', '/sessions');
});
