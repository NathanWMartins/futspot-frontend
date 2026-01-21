describe("Agendamento - fluxo principal", () => {
  beforeEach(() => {
    cy.loginByApi("jogador");

    cy.intercept("POST", "**/locais/search", {
      statusCode: 200,
      body: [
        {
          id: 1,
          nome: "Arena Teste",
          cidade: "São Paulo",
        },
      ],
    }).as("searchLocais");

    cy.visit("/jogador/home");
  });

  it("deve buscar local e realizar agendamento com sucesso", () => {
    cy.get('[data-cy="input-cidade"]').type("São Pau");
    cy.contains("São Paulo").click();

    cy.get('[data-cy="input-data"]').type("25/01/2026");
    cy.get('[data-cy="btn-procurar"]').click();

    cy.url().should("include", "/jogador/resultados");

    cy.get('[data-cy="results-card-local"]').first().click();

    cy.get('[data-cy="local-nome"]').should("be.visible");

    cy.get('[data-cy="local-input-data"]').type("2026-01-25");

    cy.get('[data-cy="local-slot-horario"]').first().click();

    cy.get('[data-cy="btn-reservar"]').click();

    cy.get('[data-cy="snackbar-feedback"]')
      .should("be.visible")
      .and("contain", "confirm");
  });
});
