describe("Blog app", function() {
  beforeEach(function() {
    cy.request("POST", "http://localhost:3003/api/testing/reset")

    const user = {
      name: "Mateja Cerina",
      username: "mcerina",
      password: "salainen"
    }
    cy.request("POST", "http://localhost:3003/api/users", user)

    cy.visit("http://localhost:3000")
  })

  it("Login form is shown", function() {
    cy.contains("Log in to the application")
    cy.contains("username")
    cy.contains("password")
    cy.contains("login")
  })

  describe("Login", function() {
    it("succeeds with correct credentials", function() {
      cy.get("#username").type("mcerina")
      cy.get("#password").type("salainen")
      cy.get("#login-button").click()

      cy.contains("Mateja Cerina logged in")
      cy.contains("Log out")
      cy.contains("new blog")
    })

    it("fails with wrong credentials", function() {
      cy.get("#username").type("mcerina")
      cy.get("#password").type("wrong")
      cy.get("#login-button").click()

      cy.contains("Wrong username or password")
      cy.get("#error-message").should("have.css", "color", "rgb(255, 0, 0)")
    })
  })
})