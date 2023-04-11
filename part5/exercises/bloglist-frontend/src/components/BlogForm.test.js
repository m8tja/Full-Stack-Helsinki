import React from "react"
import { render, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom/extend-expect"
import BlogForm from "./BlogForm"

test("a new blog is created with the right details", () => {
  const createBlog = jest.fn()
  const setErrorType = jest.fn()
  const setErrorMessage = jest.fn()

  const component = render(<BlogForm createBlog={createBlog} setErrorType={setErrorType} setErrorMessage={setErrorMessage}/>)

  const titleInput = component.container.querySelector("#title")
  const authorInput = component.container.querySelector("#author")
  const urlInput = component.container.querySelector("#url")
  const createButton = component.container.querySelector("#create")

  const newBlog = {
    title: "Testing BlogForm component",
    author: "Mateja",
    url: "www.testblogform.com"
  }

  fireEvent.change(titleInput, {
    target: { value: newBlog.title }
  })

  fireEvent.change(authorInput, {
    target: { value: newBlog.author }
  })

  fireEvent.change(urlInput, {
    target: { value: newBlog.url }
  })

  fireEvent.click(createButton)

  expect(createBlog).toHaveBeenCalledWith(newBlog)
})
