describe("Note app", function() {
  beforeEach(function() {
    cy.visit("")
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`)
    const user = {
      name: "Matti Luukkainen",
      username: "mluukkai",
      password: "salainen"
    }
    cy.request("POST", `${Cypress.env("BACKEND")}/users`, user)
  })

  it("front page can be opened", function() {
    cy.contains("Notes")
    cy.contains("Note app, Department of Computer Science, University of Helsinki 2023")
  })

  it("login form can be opened", function() {
    cy.contains("log in").click()
    cy.get("#username").type("mluukkai") //cy.get("input:first").type("mluukkai")
    cy.get("#password").type("salainen") //cy.get("input:last").type("salainen")
    cy.get("#login-button").click()

    cy.contains("Matti Luukkainen logged in")
  })

  describe("when logged in", function() {
    beforeEach(function() {
      cy.login({ username: "mluukkai", password: "salainen" })
    })

    it("a new note can be created", function() {
      cy.contains("new note").click()
      cy.get("input").type("a note created by cypress")
      cy.contains("save").click()
      cy.contains("a note created by cypress")
    })

    describe("and several notes exist", function() {
      beforeEach(function() {
        cy.createNote({ content: "another note cypress", important: true })
        cy.createNote({ content: "second note", important: false })
        cy.createNote({ content: "third note", important: false })
      })

      it("it can be made not important", function() {
        cy.contains("another note cypress").parent().find("button").as("theButton")
        cy.get("@theButton").click()
        cy.get("@theButton").should("contain", "make important")
      })

      it("one of those can be made important", function() {
        cy.contains("second note").parent().find("button").as("theButton")
        cy.get("@theButton").click()
        cy.get("@theButton").should("contain", "make not important")
        /*
        cy.contains("second note")
          .contains("make important")
          .click()

        cy.contains("second note")
          .contains("make not important")
        */
      })
    })
  })

  it("login fails with wrong password", function() {
    cy.contains("log in").click()
    cy.get("#username").type("mluukkai")
    cy.get("#password").type("wrong")
    cy.get("#login-button").click()

    //cy.get(".error").contains("Wrong credentials")
    cy.get(".error")
      .should("contain", "Wrong credentials")
      .should("have.css", "color", "rgb(255, 0, 0)")
      .should("have.css", "border-style", "solid")

    cy.get("html").should("not.contain", "Matti Luukkainen logged in")
  })
})