const bcrypt = require("bcrypt")
const usersRotuer = require("express").Router()
const User = require("../models/user")

usersRotuer.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", { url: 1, title: 1, author: 1 })

  response.json(users)
})

usersRotuer.post("/", async (request, response) => {
  const { username, name, password } = request.body

  if (!password) {
    return response.status(400).json({ error: "User validation failed: password: Path `password` is required." })
  }

  if (password.length < 3) {
    return response.status(403).json({ error: "User validation failed: password: Path `password` is too short." })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username, 
    name, 
    passwordHash
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRotuer