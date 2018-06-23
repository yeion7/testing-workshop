context("Tweets", () => {
  beforeEach(() => {
    cy.visit("localhost:3000/");
  });

  it("can create a tweet", () => {
    cy.createUser();

    cy.showUser();

    cy.get(".ant-list-empty-text").contains("No data");

    cy.createTweet();
  });
});
