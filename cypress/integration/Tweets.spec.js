context("Tweets", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.title().should("include", "React App");
  });

  it("can create a tweet", () => {
    cy.createUser();

    cy.showUser();

    cy.get(".ant-list-empty-text").contains("No data");

    cy.createTweet();
  });
});
