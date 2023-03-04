const _ = require("lodash")

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {

  let sum = 0

  for(let i = 0; i < blogs.length; i++) {
    sum += blogs[i].likes
  }

  return sum
}

const favoriteBlog = (blogs) => {

  let currentMax = 0
  let maxIndex = 0

  for(let i = 0; i < blogs.length; i++) {
    if(blogs[i].likes > currentMax) {
      maxIndex = i
      currentMax = blogs[i].likes
    }
  }

  return (blogs.length === 0 ? [] : blogs[maxIndex])
}

const mostBlogs = (blogs) => {

  if(blogs.length === 0) {
    return []
  }

  const groups = _.map(_.countBy(blogs, "author"), (val, key) => ({author: key, blogs: val}))
  const mostBlogs = _.orderBy(groups, ["blogs"], ["desc"])[0]

  return mostBlogs
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}