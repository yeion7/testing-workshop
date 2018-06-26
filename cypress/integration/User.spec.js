import user from "../fixtures/user.json";

context("Users", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.title().should("include", "React App");
  });

  it("Can add a user", () => {
    cy.createUser();

    cy.get(".ant-card")
      .contains(user.name)
      .should("have.class", "ant-card-meta-title");

    cy.get(".ant-card")
      .contains(user.alias)
      .should("have.class", "ant-card-meta-description");
  });

  it("can direct to user", () => {
    cy.createUser();
    cy.showUser();
    cy.location("pathname").should("include", "user");
    cy.get(".ant-layout-sider-children").contains(user.name);
  });
});
