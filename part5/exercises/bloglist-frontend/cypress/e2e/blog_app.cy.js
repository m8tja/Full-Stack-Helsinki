describe("Blog app", function() {
  beforeEach(function() {
    cy.request("POST", "http://localhost:3003/api/testing/reset")

    const user = {
      name: "Mateja Cerina",
      username: "mcerina",
      password: "salainen"
    }
    cy.request("POST", "http://localhost:3003/api/users", user)

    const user2 = {
      name: "Ibsy Cerina",
      username: "icerina",
      password: "salainen"
    }
    cy.request("POST", "http://localhost:3003/api/users", user2)

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
  })

  describe("When a blog is created", function() {
    beforeEach(function() {
      cy.login({ username: "mcerina", password: "salainen" })
      cy.get("#new-blog-button").click()
      cy.get("#title").type("Cypress testing")
      cy.get("#author").type("Mateja Cerina")
      cy.get("#url").type("www.testingblogswithcypress.com")
      cy.get("#create").click()
    })

    it("A blog can be liked", function() {
      cy.get("#view-button").click()
      cy.contains("likes 0")
      cy.get("#like-button").click()
      cy.contains("likes 1")
    })

    it("A blog can be deleted by the user who created it", function() {
      cy.get("#view-button").click()
      cy.get("#delete-button").click()
      cy.get("html").should("not.contain", "Cypress testing Mateja Cerina")
    })

    it("A blog can't be deleted by a user that didn't create it", function() {
      cy.get("#logout-button").click()
      cy.login({ username: "icerina", password: "salainen" })
      cy.contains("Cypress testing Mateja Cerina")
      cy.get("#view-button").click()
      cy.get("#delete-button").should("have.css", "display", "none")
    })
  })

  describe("When there are multiple blogs", function() {
    beforeEach(function() {
      cy.login({ username: "mcerina", password: "salainen" })
      cy.get("#new-blog-button").click()
      cy.get("#title").type("Blog with the second most likes")
      cy.get("#author").type("Ibsy Cerina")
      cy.get("#url").type("www.testingblogswithcypress.com")
      cy.get("#create").click()
      cy.get("#title").type("Blog with the least likes")
      cy.get("#author").type("Pepi Cerina")
      cy.get("#url").type("www.testingblogswithcypress.com")
      cy.get("#create").click()
      cy.get("#title").type("Blog with the most likes")
      cy.get("#author").type("Mateja Cerina")
      cy.get("#url").type("www.testingblogswithcypress.com")
      cy.get("#create").click()
    })

    it.only("Blogs are ordered by likes", function() {
      cy.contains("Blog with the most likes").find("#view-button").as("firstViewButton")
      cy.get("@firstViewButton").click()
      cy.contains("Blog with the second most likes").find("#view-button").as("secondViewButton")
      cy.get("@secondViewButton").click()
      cy.contains("Blog with the least likes").find("#view-button").as("thirdViewButton")
      cy.get("@thirdViewButton").click()

      cy.contains("Blog with the least likes").parent().find("#like-button").as("thirdLikeButton")
      cy.get("@thirdLikeButton").click()
      cy.wait(500)
      cy.contains("Blog with the most likes").parent().find("#like-button").as("firstLikeButton")
      cy.get("@firstLikeButton").click()
      cy.wait(500)
      cy.get("@firstLikeButton").click()
      cy.wait(500)
      cy.contains("Blog with the second most likes").parent().find("#like-button").as("secondLikeButton")
      cy.get("@secondLikeButton").click()
      cy.wait(500)
      cy.get("@secondLikeButton").click()
      cy.wait(500)
      cy.get("@firstLikeButton").click()
      cy.wait(500)
      cy.get(".blog").eq(0).should("contain", "Blog with the most likes")
      cy.get(".blog").eq(1).should("contain", "Blog with the second most likes")
      cy.get(".blog").eq(2).should("contain", "Blog with the least likes")
    })
  })
})