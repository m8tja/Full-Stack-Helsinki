import React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/extend-expect"
import Blog from "./Blog"
import userEvent from "@testing-library/user-event"

const user = {
  username: "tester",
  name: "Test User"
}

const blog = {
  title: "First class tests",
  author: "Robert C. Martin",
  url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
  likes: 10,
  user: user
}

test("title and content are displayed, url and likes are hidden", () => {
  const { container } = render(<Blog blog={blog} user={user}/>)

  const divTitleAuthor = container.querySelector(".title-author")
  expect(divTitleAuthor).toHaveStyle("display: block")

  const divUrl = container.querySelector(".url")
  expect(divUrl).toHaveStyle("display: none")

  const divLikes = container.querySelector(".likes")
  expect(divLikes).toHaveStyle("display: none")
})

test("after clicking the button, url and likes are displayed", async () => {
  const user = userEvent.setup()

  const { container } = render(<Blog blog={blog} user={user}/>)

  const button = screen.getByText("view")
  await user.click(button)

  const divUrl = container.querySelector(".url")
  expect(divUrl).toHaveStyle("display: block")

  const divLikes = container.querySelector(".likes")
  expect(divLikes).toHaveStyle("display: block")
})

test("if the button is clicked twice, the function is called twice", async () => {
  const likeBlog = jest.fn()
  const user = userEvent.setup()

  render(<Blog blog={blog} user={user} likeBlog={likeBlog}/>)

  const button = screen.getByText("like")
  await user.click(button)
  await user.click(button)

  expect(likeBlog.mock.calls).toHaveLength(2)
  //expect(likeBlog).toHaveBeenCalledTimes(2)
})