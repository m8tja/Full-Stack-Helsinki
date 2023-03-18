const mongoose = require("mongoose")
const supertest = require("supertest")
const helper = require("./test_helper")
const app = require("../app")
const api = supertest(app)

const Blog = require("../models/blog")
const User = require("../models/user")

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.blogsList)
  await User.deleteMany({})
  await User.insertMany(helper.userList)
})

test("blogs are returned as json", async () => {
  const returnedBlogs = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/)

  expect(returnedBlogs.body).toHaveLength(helper.blogsList.length)
}, 100000)

test("blog has property id and not _id", async () => {
  const returnedBlogs = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/)

  //console.log(returnedBlogs)
  expect(returnedBlogs.body[0].id).toBeDefined()
})

test("a blog can be added", async () => {
  const newBlog = {
    title: "The Clean Code Blog",
    author: "Robert C. Martin",
    url: "https://blog.cleancoder.com/uncle-bob/2017/03/16/DrCalvin.html",
    likes: 4,
  }

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.blogsList.length + 1)

    const title = blogsAtEnd.map(b => b.title)
    expect(title).toContain(
      "The Clean Code Blog"
    )

    const author = blogsAtEnd.map(b => b.author)
    expect(author).toContain(
      "Robert C. Martin"
    )
})

test("a blog with no likes has 0 likes", async () => {
  const newBlog = {
    title: "Loopy",
    author: "Robert C. Martin",
    url: "https://blog.cleancoder.com/uncle-bob/2020/09/30/loopy.html"
  }

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/)

  const savedBlog = await helper.blogInDb(newBlog.title, newBlog.url)

  expect(savedBlog.likes).toEqual(0)
})

test("a blog with no title cannot be posted", async () => {
  const newBlog = {
    author: "Robert C. Martin",
    url: "https://blog.cleancoder.com/uncle-bob/2020/09/30/loopy.html"
  }

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(400)
})

test("a blog with no url cannot be posted", async () => {
  const newBlog = {
    title: "Loopy",
    author: "Robert C. Martin"
  }

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(400)
})

test("a blog can be updated", async () => {
  const blogs = await helper.blogsInDb()
  const blogToUpdate = blogs[0]

  const updatedBlog = {
    title: blogToUpdate.title,
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes: blogToUpdate.likes + 1
  }

  await api
    .put(`/api/blogs/${blogs[0].id}`)
    .send(updatedBlog)
    .expect(200)

  const blogsAfter = await helper.blogsInDb()

  const likes = blogsAfter.map(b => b.likes)

  expect(likes[0]).toBe(updatedBlog.likes)
})

test("a blog can be deleted", async () => {
  const blogs = await helper.blogsInDb()
  const blogToDelete = blogs[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(
    helper.blogsList.length - 1
  )

  const titles = blogsAtEnd.map(b => b.title)

  expect(titles).not.toContain(blogToDelete.title)
})

test("user with a password that is too short, is not added", async () => {
  const user = {
    username: "edijkstra",
    name: "Edsger Dijkstra",
    password: "ed"
  }

  const initialUsersInDb = await helper.usersInDb()

  const response = await api
    .post("/api/users")
    .send(user)
    .expect(403)

  const usersinDbAfter = await helper.usersInDb()

  expect(usersinDbAfter.length).toEqual(initialUsersInDb.length)
  expect(response.body.error).toContain("User validation failed: password: Path `password` is too short.")
})

test("user with a username that is too short, is not added", async () => {
  const user = {
    username: "ed",
    name: "Edsger Dijkstra",
    password: "dijkstra"
  }

  const initialUsersInDb = await helper.usersInDb()

  const response = await api
    .post("/api/users")
    .send(user)
    .expect(400)

  const usersinDbAfter = await helper.usersInDb()

  expect(usersinDbAfter.length).toEqual(initialUsersInDb.length)
  expect(response.body.error).toContain("User validation failed: username: Path `username` (`ed`) is shorter than the minimum allowed length (3).")
})

test("user with no username, is not added", async () => {
  const user = {
    name: "Edsger Dijkstra",
    password: "dijkstra"
  }

  const initialUsersInDb = await helper.usersInDb()

  const response = await api
    .post("/api/users")
    .send(user)
    .expect(400)

  const usersinDbAfter = await helper.usersInDb()

  expect(usersinDbAfter.length).toEqual(initialUsersInDb.length)
  expect(response.body.error).toContain("User validation failed: username: Path `username` is required.")
})

test("user with no password, is not added", async () => {
  const user = {
    username: "edijkstra",
    name: "Edsger Dijkstra"
  }

  const initialUsersInDb = await helper.usersInDb()

  const response = await api
    .post("/api/users")
    .send(user)
    .expect(400)

  const usersinDbAfter = await helper.usersInDb()

  expect(usersinDbAfter.length).toEqual(initialUsersInDb.length)
  expect(response.body.error).toContain("User validation failed: password: Path `password` is required.")
})

test("user with the same username, is not added", async () => {
  const user = {
    username: "hellas",
    name: "Matti Hellas",
    password: "salainen"
  }

  const initialUsersInDb = await helper.usersInDb()

  const response = await api
    .post("/api/users")
    .send(user)
    .expect(400)

  const usersinDbAfter = await helper.usersInDb()

  expect(usersinDbAfter.length).toEqual(initialUsersInDb.length)
  expect(response.body.error).toContain("username already exists")
})

afterAll(async () => {
  await mongoose.connection.close()
})