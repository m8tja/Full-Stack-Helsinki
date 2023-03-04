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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}