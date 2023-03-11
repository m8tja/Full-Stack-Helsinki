const mongoose = require("mongoose")
const supertest = require("supertest")
const helper = require("./test_helper")
const app = require("../app")
const api = supertest(app)

const Blog = require("../models/blog")

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.blogsList)
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

afterAll(async () => {
  await mongoose.connection.close()
})