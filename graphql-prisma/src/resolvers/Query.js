const Query = {
  test() {
    return ['CREATED', 'DELETED']
  },
  me() {
    return users[0];
  },
  post() {
    return {
      id: 1,
      title: 'First post',
      body: 'Some random text',
      published: false
    }
  },
  users(parent, args, { db }, info) {
    console.log(args);
    if (!args.query) return db.users;
    let u = db.users.filter(user => {
      return user.id.toString() === args.query;
    })
    return u;
  },
  posts(parent, args, { db }, info) {
    if (!args.query) return db.posts;
    return db.posts.filter(post => post.id.toString() === args.query);
  },
  comments(parent, args, { db }, info) {
    return db.comments;
  }
}

export { Query as default }
