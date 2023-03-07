const mongoose = require("mongoose")
const supertest = require("supertest")
const helper = require("./test_helper")
const app = require("../app")
const api = supertest(app)

const Blog = require("../models/blog")

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.blogs)
})

test("blogs are returned as json", async () => {
  const returnedBlogs = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/)

  expect(returnedBlogs.body).toHaveLength(helper.blogs.length)
}, 100000)

test("blog has property id and not _id", async () => {
  const returnedBlogs = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/)

  console.log(returnedBlogs)
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
    expect(blogsAtEnd).toHaveLength(helper.blogs.length + 1)

    const title = blogsAtEnd.map(b => b.title)
    expect(title).toContain(
      "The Clean Code Blog"
    )

    const author = blogsAtEnd.map(b => b.author)
    expect(author).toContain(
      "Robert C. Martin"
    )
})

afterAll(async () => {
  await mongoose.connection.close()
})