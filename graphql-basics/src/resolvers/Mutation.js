import uuidv4 from 'uuid/v4';

const Mutation = {
  createUser(parent, args, {db}, info) {
    const emailTaken = db.users.some(user => user.email === args.data.email);

    if (emailTaken) {
      throw new Error('Email already exists!');
    }

    const user = {
      id: uuidv4(),
      ...args.data
    }

    db.users.push(user);

    return user;
  },
  updateUser(parent, { id, data }, {db}, info) {
    const user = db.users.find(user => user.id.toString() === id.toString());
    if (!user) {
      throw new Error('User not found!');
    }

    if (typeof data.email === 'string') {
      const emailTaken = db.users.some(user => user.email === data.email);
      if (emailTaken) {
        throw new Error('Email already taken');
      }
      user.email = data.email;
    }

    if (typeof data.name === 'string') {
      user.name = data.name;
    }

    if (typeof data.age !== undefined) {
      user.age = data.age;
    }
    return user;
  },
  deleteUser(parent, args, {db}, info) {
    const index = db.users.findIndex(user => user.id.toString() === args.id);
    if (index < 0) {
      throw new Error('User not found');
    }
    const deletedUsers = db.users.splice(index, 1);
    posts = db.posts.filter(post => {
      let match = post.author === args.id;
      if (match) {
        db.comments.filter(comment => comment.post !== post.id);
      }
      return !match;
    });
    db.comments = comments.filter(comment => comment.author !== args.id);
    return deletedUser[0];
  },
  createPost(parent, args, {db}, info) {
    const userExists = db.users.some(user => user.id === args.data.author);
    if (!userExists) throw new Error('Author not found!');

    const post = {
      id: uuidv4(),
      ...args.data
    }
    db.posts.push(post);
    return post;
  },
  createComment(parent, args, {db}, info) {
    const userExists = db.users.some(user => user.id.toString() === args.data.author);
    if (!userExists) throw new Error('Author not found!');

    const post = db.posts.some(post => post.id.toString() === args.post);
    if (!post) throw new Error('Post not found!');

    const comment = {
      id: uuidv4(),
      ...args.data
    }
    db.comments.push(comment);
    return comment;
  }
}

export { Mutation as default }
