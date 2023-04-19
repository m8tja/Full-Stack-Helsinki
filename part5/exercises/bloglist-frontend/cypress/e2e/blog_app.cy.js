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

  describe("When logged in", function() {
    beforeEach(function() {
      cy.login({ username: "mcerina", password: "salainen" })
    })

    it("A blog can be created", function() {
      cy.get("#new-blog-button").click()
      cy.get("#title").type("Cypress testing")
      cy.get("#author").type("Mateja Cerina")
      cy.get("#url").type("www.testingblogswithcypress.com")
      cy.get("#create").click()

      cy.contains("A new blog Cypress testing by Mateja Cerina added")
      cy.get("#error-message").should("have.css", "color", "rgb(0, 128, 0)")
      cy.contains("Cypress testing Mateja Cerina")
      cy.contains("view")
    })

    it("A blog can be liked", function() {
      cy.get("#new-blog-button").click()
      cy.get("#title").type("Cypress testing")
      cy.get("#author").type("Mateja Cerina")
      cy.get("#url").type("www.testingblogswithcypress.com")
      cy.get("#create").click()
      cy.get("#view-button").click()

      cy.contains("likes 0")
      cy.get("#like-button").click()
      cy.contains("likes 1")
    })
  })
})