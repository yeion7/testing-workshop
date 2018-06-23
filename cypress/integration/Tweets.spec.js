context("Tweets", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("can create a tweet", () => {
    cy.createUser();

    cy.showUser();

    cy.get(".ant-list-empty-text").contains("No data");

    cy.createTweet();
  });
});
