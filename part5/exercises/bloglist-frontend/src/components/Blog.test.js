import React from "react"
import { render } from "@testing-library/react" //screen
import "@testing-library/jest-dom/extend-expect"
import Blog from "./Blog"
//import userEvent from "@testing-library/user-event"

test("renders content - CSS test", () => {
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

  const { container } = render(<Blog blog={blog} user={user}/>)

  const divTitleAuthor = container.querySelector(".title-author")
  expect(divTitleAuthor).toHaveStyle("display: block")

  const divUrl = container.querySelector(".url")
  expect(divUrl).toHaveStyle("display: none")

  const divLikes = container.querySelector(".likes")
  expect(divLikes).toHaveStyle("display: none")
})