const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogPosts) => {

  let sum = 0

  for(let i = 0; i < blogPosts.length; i++) {
    sum += blogPosts[i].likes
  }

  return sum
}

module.exports = {
  dummy,
  totalLikes
}