const jwt = require("jsonwebtoken")
const blogRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post("/", async (request, response) => {
  const body = request.body
  /*
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if(!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" })
  }

  const user = await User.findById(decodedToken.id)
  */
  const user = request.user

  const blog = new Blog ({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  })

  if(!blog.likes) {
    blog.likes = 0
  }

  if(!blog.url || !blog.title) {
    return response.status(400).end()
  }

  const savedBlog = await blog.save()
  await savedBlog.populate("user", { username: 1, name: 1 })
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogRouter.put("/:id", async (request, response) => {
  const body = request.body
  console.log("BODY: ", body)

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user.id
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  await updatedBlog.populate("user", { username: 1, name: 1 })
  
  response.status(200).json(updatedBlog)
})

blogRouter.delete("/:id", async (request, response) => {

  /*
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if(!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" })
  }

  const user = await User.findById(decodedToken.id)
  */
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if(blog.user.toString() === user.id.toString()) {
    await blog.deleteOne()
    response.status(204).end()
  }
  
  response.status(400).end()
})

const getTokenFrom = request => {
  const authorization = request.get("authorization")

  if(authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "")
  }

  return null
}

module.exports = blogRouter