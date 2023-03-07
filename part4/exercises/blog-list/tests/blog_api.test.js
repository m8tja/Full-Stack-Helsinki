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

afterAll(async () => {
  await mongoose.connection.close()
})