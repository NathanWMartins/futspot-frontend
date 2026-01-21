/// <reference types="cypress" />
Cypress.Commands.add("loginByApi", (tipo = "jogador") => {
  cy.request("POST", "http://localhost:5173/auth/login", {
    email: "nathan@g.com",
    senha: "123456",
    tipoUsuario: tipo,
  }).then((response) => {
    window.localStorage.setItem("token", response.body.token);
    window.localStorage.setItem(
      "user",
      JSON.stringify(response.body.user)
    );
  });
});
