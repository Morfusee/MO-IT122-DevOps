/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
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
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

// Cypress configuration to handle uncaught exceptions related to NEXT_REDIRECT
Cypress.on("uncaught:exception", (err) => {
  console.log("err.message", err.message);

  // Check if the error message includes "NEXT_REDIRECT"
  if (err.message.includes("NEXT_REDIRECT")) {
    // This block is added to handle server-side redirects in Next.js.
    // Next.js often performs server-side redirects for various reasons, such as:
    // - Authentication flows (redirecting to login page if not authenticated)
    // - Conditional rendering based on user data
    // - Route changes based on server-side logic
    // When these redirects occur, they can throw a "NEXT_REDIRECT" error,
    // which is expected behavior and should not cause the test to fail.
    // Returning false here prevents Cypress from failing the test when such an error is encountered.
    return false;
  }
});

Cypress.Commands.add("login", (email, password) => {
  cy.session("user", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3333/login",
      body: {
        email,
        password,
      },
    });
  });
});
