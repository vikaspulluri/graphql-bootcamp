const Comment = {
  author(parent, args, {db}, info) {
    return db.users.find(user => user.id.toString() === parent.author);
  },
  post(parent, args, {db}, info) {
    return db.posts.find(post => post.id.toString() === parent.post);
  }
}

export { Comment as default }
