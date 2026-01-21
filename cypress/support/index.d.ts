/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    loginByApi(tipo?: "jogador" | "locador"): Chainable<void>;
  }
}
