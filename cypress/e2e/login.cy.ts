describe("Login - AuthDialog", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("deve abrir o modal de login ao clicar em Entrar", () => {
    cy.get('[data-cy="btn-entrar"]').click();

    cy.contains("Entrar no FutSpot").should("be.visible");
  });

  it("deve realizar login com sucesso como jogador", () => {
    cy.get('[data-cy="btn-entrar"]').click();

    cy.get('[data-cy="input-email"]').type("nathan@g.com");
    cy.get('[data-cy="input-senha"]').type("123456");

    cy.get('[data-cy="btn-submit-login"]').click();

    cy.url().should("include", "/jogador/home");
  });

  it("deve logar com sucesso (mock)", () => {
    cy.intercept("POST", "**/login", {
      statusCode: 200,
      body: {
        user: {
          id: 1,
          nome: "Nathan",
          tipoUsuario: "jogador",
        },
        token: "fake-jwt-token",
      },
    }).as("login");

    cy.get('[data-cy="btn-entrar"]').click();
    cy.get('[data-cy="input-email"]').type("nathan@g.com");
    cy.get('[data-cy="input-senha"]').type("123456");
    cy.get('[data-cy="btn-submit-login"]').click();

    cy.wait("@login");

    cy.url().should("include", "/jogador/home");
  });
  it("deve exibir erro ao falhar login", () => {
    cy.intercept("POST", "**/login", {
      statusCode: 401,
      body: {
        message: "E-mail ou senha inválidos",
      },
    }).as("loginError");

    cy.get('[data-cy="btn-entrar"]').click();
    cy.get('[data-cy="input-email"]').type("errado@email.com");
    cy.get('[data-cy="input-senha"]').type("senhaerrada");
    cy.get('[data-cy="btn-submit-login"]').click();

    cy.contains("E-mail ou senha inválidos").should("be.visible");
  });
});
