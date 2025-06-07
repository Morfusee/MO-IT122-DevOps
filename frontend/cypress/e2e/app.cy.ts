const testUser = {
  firstName: "John",
  lastName: "Doe",
  email: "test@email.com",
  password: "123456",
};

const testPrompts = {
  biology: "Can you teach me all about biology?",
  mitochondria: "What does the mitochondria do?",
  chatRename: "Biography",
};

// Authentication Test Suite
describe("Auth Page", () => {
  // Open website
  it("Visit the website", () => {
    cy.visit("/");
    cy.contains("Welcome back!");
  });

  it("Register an account", () => {
    cy.visit("/");
    cy.contains("a", "Create account").click();

    cy.url().should("include", "/register");

    cy.contains("Join now!");

    cy.get('input[name="fname"]').type(testUser.firstName);
    cy.get('input[name="lname"]').type(testUser.lastName);
    cy.get('input[name="email"]').type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password);
    cy.get('input[name="cpassword"]').type(testUser.password);

    cy.contains("button", "Sign up").click();

    cy.url().should("include", "/login");
  });

  it("Login to the account", () => {
    cy.visit("/");
    cy.contains("Welcome back!");
    cy.url().should("include", "/login");

    cy.get('input[name="email"]').type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password);

    cy.contains("button", "Login").click();

    cy.url({ timeout: 200000 }).should("include", "/chat");

    cy.get('button[data-name="account-menu"]').click();

    cy.get('[data-name="account-popup"]').contains(
      `${testUser.firstName} ${testUser.lastName}`
    );
    cy.get('[data-name="account-popup"]').contains(testUser.email);
  });
});

// Chat Test Suite
describe("Chat Page", () => {
  // Logs in the user before each test
  beforeEach(() => {
    cy.login(testUser.email, testUser.password);
  });

  it("Visit the chat page", () => {
    cy.visit("/chat");
    cy.contains(`Hello ${testUser.firstName} ${testUser.lastName}`);
  });

  it("Initiate a new chat", () => {
    cy.visit("/chat");
    cy.get('textarea[name="new-prompt-input"]')
      .type(testPrompts.biology)
      .type(`{enter}`);

    cy.url({ timeout: 20000 }).should("match", /\/chat\/[a-zA-Z0-9_-]+$/);

    cy.get('[data-name="message-history"]').contains(testPrompts.biology);
    cy.get('[data-name="llm-message"]');
  });

  it("Ask a new question", () => {
    cy.visit("/chat");

    cy.get('[data-name="chat-history-item"]').click();
    cy.url().should("match", /\/chat\/[a-zA-Z0-9_-]+$/);

    cy.get('textarea[name="prompt-input"]')
      .type(testPrompts.mitochondria)
      .type(`{enter}`);

    cy.get('[data-name="llm-message"]', { timeout: 20000 })
      .its("length")
      .should("be.gte", 2);
  });

  it("Rename the chat title", () => {
    cy.visit("/chat");

    cy.get('[data-name="chat-history-item"]')
      .trigger("mouseover")
      .get('[data-name="chat-item-menu-trigger"]')
      .click()
      .get('[data-name="menu-rename-button"]')
      .click();

    cy.get('[data-name="rename-input"]').clear().type(testPrompts.chatRename);

    cy.contains("button", "Edit").click();

    cy.get('[data-name="chat-history-item"]')
      .contains(testPrompts.chatRename)
      .click();

    cy.get('[data-name="chat-title"]').contains(testPrompts.chatRename);
  });

  it("Initiate a new chat", () => {
    cy.visit("/chat");
    cy.get('textarea[name="new-prompt-input"]')
      .type(testPrompts.biology)
      .type(`{enter}`);

    cy.url({ timeout: 20000 }).should("match", /\/chat\/[a-zA-Z0-9_-]+$/);

    cy.get('[data-name="message-history"]').contains(testPrompts.biology);
    cy.get('[data-name="llm-message"]');
  });

  it("Delete the chat", () => {
    cy.visit("/chat");

    cy.contains('[data-name="chat-history-item"]', testPrompts.chatRename)
      .trigger("mouseover")
      .get('[data-name="chat-item-menu-trigger"]')
      .click()
      .get('[data-name="menu-delete-button"]')
      .click();

    cy.contains("button", "Delete").click();

    cy.get('[data-name="chat-history-item"]')
      .contains(testPrompts.chatRename)
      .should("not.exist");
  });
});
