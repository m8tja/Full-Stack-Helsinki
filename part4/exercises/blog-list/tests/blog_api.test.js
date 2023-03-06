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

afterAll(async () => {
  await mongoose.connection.close()
})