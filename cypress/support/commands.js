import "cypress-testing-library/add-commands";
import user from "../fixtures/user.json";

Cypress.Commands.add("createUser", () => {
  cy.contains("usuario").click();
  cy.queryByLabelText("Nombre")
    .type(user.name)
    .should("have.value", user.name);

  cy.queryByLabelText("Usuario")
    .type(user.alias)
    .should("have.value", user.alias);

  cy.queryByLabelText("Descripción")
    .type(user.description)
    .should("have.value", user.description);

  cy.get(".ant-btn-primary")
    .contains("Crear")
    .click({ force: true });
});

Cypress.Commands.add("deleteUser", () => {
  cy.get(".ant-card-actions .ant-btn").click({
    force: true,
    multiple: true
  });

  cy.get(".ant-layout-content")
    .contains("usuarios")
    .should("have.text", "No existen usuarios :(");
});

Cypress.Commands.add("showUser", () => {
  cy.get(".ant-card-actions li a")
    .first()
    .click({
      force: true
    });
});

Cypress.Commands.add("createTweet", () => {
  cy.get("textarea")
    .type("hola", { delay: 1 })
    .type("{enter}");

  cy.get(".ant-list-item").contains("hola");
  cy.get(".anticon-delete").should("have.attr", "role", "button");
});
